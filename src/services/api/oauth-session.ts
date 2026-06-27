export interface OAuthSession {
  accessToken: string
  refreshToken?: string
  idToken?: string
  tokenType: string
  expiresAt: number
  clientId: string
}

const STORAGE_KEY = 'maintainerd.auth.console.oauth.session'

export function getStoredOAuthSession(): OAuthSession | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const session = JSON.parse(raw) as OAuthSession
    if (!session.accessToken || !session.clientId) return null
    return session
  } catch {
    return null
  }
}

export function storeOAuthSession(session: OAuthSession) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function clearOAuthSession() {
  window.localStorage.removeItem(STORAGE_KEY)
}

