import axios from 'axios'
import { API_CONFIG, TOKEN_DELIVERY_HEADER } from '../config'
import { storeOAuthSession, setSessionIdTokenHint } from '../oauth-session'
import { buildConsoleAuthorizeUrl, consumePendingOAuthFlow, discardPendingOAuthFlow } from '@/utils/oauthFlow'
import type { ApiResponse } from '../types'

export interface PublicClient {
  client_id: string
  name: string
  display_name: string
  client_type: string
  domain?: string
  tenant_id: string
}

interface OAuthTokenResponse {
  access_token: string
  refresh_token?: string
  id_token?: string
  token_type?: string
  expires_in?: number
  scope?: string
}

export async function fetchConsoleClient(tenantIdentifier: string): Promise<PublicClient> {
  const response = await axios.get<ApiResponse<PublicClient>>(`${API_CONFIG.PUBLIC_BASE_URL}/client/console`, {
    params: { tenant_id: tenantIdentifier },
    withCredentials: true,
  })
  if (!response.data.success || !response.data.data) {
    throw new Error(typeof response.data.error === 'string' ? response.data.error : 'Console client not found')
  }
  return response.data.data
}

// startConsoleOAuthLogin kicks off the hosted-identity OAuth2 (authorization
// code + PKCE) flow: it resolves this tenant's console client, builds the
// authorize URL, and navigates the browser to the identity app. Shared by the
// landing page's "Sign in" button and the route guard's auto-redirect for
// unauthenticated access to a protected page.
export async function startConsoleOAuthLogin(tenantIdentifier: string, returnTo = ''): Promise<void> {
  const client = await fetchConsoleClient(tenantIdentifier)
  const authorizeUrl = await buildConsoleAuthorizeUrl({
    clientId: client.client_id,
    tenantId: tenantIdentifier,
    returnTo,
  })
  window.location.assign(authorizeUrl)
}

type SilentOAuthMessage = {
  type: 'maintainerd:oauth:silent'
  state: string
  redirect_uri?: string
  error?: string
}

// Attempts a non-interactive authorization in a hidden identity iframe. This
// succeeds for an existing same-site SSO session with prior consent. Any
// login/consent requirement resolves false so the caller can use the normal
// visible authorization redirect.
export async function tryConsoleSilentOAuthLogin(tenantIdentifier: string, returnTo = ''): Promise<boolean> {
  const client = await fetchConsoleClient(tenantIdentifier)
  const authorizeUrl = await buildConsoleAuthorizeUrl({
    clientId: client.client_id,
    tenantId: tenantIdentifier,
    returnTo,
    prompt: 'none',
  })
  const expectedIdentityOrigin = new URL(API_CONFIG.IDENTITY_BASE_URL).origin
  const iframe = document.createElement('iframe')
  iframe.hidden = true
  iframe.setAttribute('aria-hidden', 'true')

  return new Promise<boolean>((resolve) => {
    let settled = false
    const finish = (value: boolean) => {
      if (settled) return
      settled = true
      window.clearTimeout(timeout)
      window.removeEventListener('message', onMessage)
      iframe.remove()
      resolve(value)
    }
    const onMessage = async (event: MessageEvent<SilentOAuthMessage>) => {
      if (event.origin !== expectedIdentityOrigin || event.source !== iframe.contentWindow) return
      const message = event.data
      if (!message || message.type !== 'maintainerd:oauth:silent' || !message.state) return
      if (message.error || !message.redirect_uri) {
        discardPendingOAuthFlow(message.state)
        finish(false)
        return
      }
      const redirect = new URL(message.redirect_uri)
      const code = redirect.searchParams.get('code')
      const state = redirect.searchParams.get('state')
      if (!code || !state || state !== message.state) {
        discardPendingOAuthFlow(message.state)
        finish(false)
        return
      }
      const flow = consumePendingOAuthFlow(state)
      if (!flow) {
        finish(false)
        return
      }
      try {
        await exchangeAuthorizationCode({
          clientId: flow.clientId,
          code,
          redirectUri: flow.redirectUri,
          codeVerifier: flow.codeVerifier,
        })
        finish(true)
      } catch {
        finish(false)
      }
    }
    const timeout = window.setTimeout(() => finish(false), 5000)
    window.addEventListener('message', onMessage)
    document.body.appendChild(iframe)
    iframe.src = authorizeUrl
  })
}

export async function exchangeAuthorizationCode(params: {
  clientId: string
  code: string
  redirectUri: string
  codeVerifier: string
}) {
  const form = new URLSearchParams({
    grant_type: 'authorization_code',
    code: params.code,
    redirect_uri: params.redirectUri,
    code_verifier: params.codeVerifier,
    client_id: params.clientId,
  })

  // `X-Token-Delivery: cookie` asks the backend to deliver the access/id/refresh
  // tokens as httpOnly cookies (Set-Cookie) instead of only in the response body,
  // and `withCredentials` lets the browser store them. The tokens are therefore
  // NEVER persisted in localStorage — only a non-secret client marker is.
  //
  // TODO(auth-cookies): the RP token endpoint (`POST /oauth/token`,
  // authorization_code grant) does not yet honor `X-Token-Delivery: cookie` on
  // the backend — only `/refresh-token` and the login/broker-callback paths call
  // `SetAuthCookies`. Until `/oauth/token` sets cookies here, the console's
  // authenticated session depends on the backend delivering the httpOnly cookies
  // on this exchange; the header is sent so it works transparently once the
  // backend adds cookie delivery to this grant. We intentionally do not fall back
  // to storing the tokens in localStorage.
  const response = await axios.post<OAuthTokenResponse>(`${API_CONFIG.PUBLIC_BASE_URL}/oauth/token`, form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', ...TOKEN_DELIVERY_HEADER },
    withCredentials: true,
  })

  // Persist only the non-secret client id (needed for RP-initiated logout). Keep
  // the id_token as an in-memory logout hint for this page session only.
  storeOAuthSession({ clientId: params.clientId })
  setSessionIdTokenHint(response.data.id_token)
}
