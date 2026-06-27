/**
 * Authentication Service
 * Handles authentication API calls and storage operations
 */

import { post, get } from '../client'
import { API_CONFIG, API_ENDPOINTS } from '../config'
import { clearOAuthSession, getStoredOAuthSession } from '../oauth-session'
import type { ApiResponse } from '../types'
import type { ProfileEntity, AccountEntity, LogoutResponse, CreateProfileRequest, CreateProfileResponse, ProfileResponse } from './types'

type AccountResponse = ApiResponse<AccountEntity>

/**
 * Logout user (local only — clears the stored OAuth session).
 * @returns Promise<LogoutResponse>
 */
export async function logout(): Promise<LogoutResponse> {
  clearOAuthSession()
  return { success: true, message: 'Logout successful' }
}

/**
 * Local-only logout: clears the console's stored OAuth tokens and performs a
 * full-document navigation to `to` (defaults to the public `/login` page).
 *
 * This does NOT end the hosted-identity SSO session — use it for flows that want
 * to re-authenticate immediately (e.g. switching tenants). For a real "sign me
 * out" use `logoutViaIdentity()`.
 *
 * The hard navigation is deliberate: a React Router `navigate` would flip
 * `isAuthenticated` to false while still on a protected route, and the route
 * guard would momentarily see "unauthenticated on a protected route" and fire
 * the hosted-identity OAuth redirect — bouncing the user straight back in.
 */
export function logoutAndRedirect(to: string = '/login'): void {
  clearOAuthSession()
  window.location.replace(to)
}

/**
 * Full logout: ends the hosted-identity SSO session, not just the local console
 * session.
 *
 * Clears the local OAuth tokens, then redirects the browser through identity's
 * RP-initiated logout (OIDC `end_session`) carrying `id_token_hint`, `client_id`,
 * and a registered `post_logout_redirect_uri`. Identity forwards the request to
 * the backend, which revokes the refresh tokens AND clears the `__Host-*`
 * session cookies, then redirects back to the console.
 *
 * Without this the identity session cookie survives logout and the next "Sign
 * in" silently re-authenticates the user (the SSO logout loop). The
 * post_logout_redirect_uri must be a URI registered for the console client
 * (the client_uri seed registers `<console-origin>/logout`).
 */
export function logoutViaIdentity(): void {
  const session = getStoredOAuthSession()
  clearOAuthSession()

  const params = new URLSearchParams()
  if (session?.idToken) params.set('id_token_hint', session.idToken)
  if (session?.clientId) params.set('client_id', session.clientId)
  params.set('post_logout_redirect_uri', `${window.location.origin}/logout`)

  window.location.replace(`${API_CONFIG.IDENTITY_BASE_URL}/oauth/end_session?${params.toString()}`)
}

/**
 * Fetch user profile from API
 * @returns Promise<ProfileEntity | null> - Returns null if profile doesn't exist (e.g., newly registered user)
 */
export async function fetchProfile(): Promise<ProfileEntity | null> {
  try {
    const response = await get<ProfileResponse>(API_ENDPOINTS.AUTH.PROFILE)

    if (response.success && response.data) {
      return response.data
    }

    return null
  } catch {
    return null
  }
}

/**
 * Create user profile for authenticated users (requires cookie token)
 * @param data - Profile creation data
 * @returns Promise<CreateProfileResponse>
 */
export async function createUserProfile(data: CreateProfileRequest): Promise<CreateProfileResponse> {
  const response = await post<CreateProfileResponse>(
    API_ENDPOINTS.AUTH.PROFILE,
    data
  )
  return response
}

/**
 * Create profile for registered users (dedicated register flow)
 * @param data - Profile creation data
 * @returns Promise<CreateProfileResponse>
 */
export async function createRegisterProfile(data: CreateProfileRequest): Promise<CreateProfileResponse> {
  const response = await post<CreateProfileResponse>(
    API_ENDPOINTS.AUTH.PROFILE,
    data
  )
  return response
}

/**
 * Validate if the user is still authenticated with the backend
 * This checks if the backend cookie is still valid by calling the profile endpoint
 * @returns Promise<ProfileEntity | null> - Returns profile if authenticated, null otherwise
 */
export async function validateAuthentication(): Promise<AccountEntity | null> {
  try {
    const response = await get<AccountResponse>(API_ENDPOINTS.AUTH.ACCOUNT)
    if (response.success && response.data) return response.data
    return null
  } catch (err: unknown) {
    const apiErr = err as { status?: number }
    if (apiErr?.status === 401 || apiErr?.status === 403) throw err
    return null
  }
}

export async function fetchAccount(): Promise<AccountEntity | null> {
  try {
    const response = await get<AccountResponse>(API_ENDPOINTS.AUTH.ACCOUNT)
    if (response.success && response.data) return response.data
    return null
  } catch { return null }
}

// Export functions as an object for backward compatibility
export const authService = {
  logout,
  fetchProfile,
  fetchAccount,
  createUserProfile,
  createRegisterProfile,
  validateAuthentication,
}
