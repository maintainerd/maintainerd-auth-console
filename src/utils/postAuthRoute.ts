/**
 * Post-authentication routing
 *
 * Single source of truth for "where should this user go now?" once we have a
 * session (after login, MFA, registration, or email verification). All callers
 * — LoginForm, RegisterForm, VerifyEmailPage, RegisterProfilePage,
 * RedirectIfAuthenticated — must use this so the registration/verification
 * flow stays consistent.
 *
 * Decision order (mirrors the backend gating):
 *   1. tenant requires email verification AND email not verified → /email-verification
 *   2. no profile yet                                            → /register/profile
 *   3. otherwise                                                 → /{tenant}/dashboard
 */

import type { AccountEntity } from '@/services/api/auth/types'
import type { TenantEntity } from '@/services/api/tenants/types'
import { getTenantIdentifierFromPath } from '@/utils/tenant'

export const VERIFY_EMAIL_ROUTE = '/email-verification'
export const REGISTER_PROFILE_ROUTE = '/register/profile'
export const REGISTER_ROUTE = '/register'
export const REGISTER_INVITE_ROUTE = '/register/invite'
export const LOGIN_ROUTE = '/login'
export const NO_ACCESS_ROUTE = '/no-access'
export const SERVICE_UNAVAILABLE_ROUTE = '/service-unavailable'

// Public auth pages an authenticated, fully-registered user should never sit on.
const AUTH_PAGES = ['/login', '/register', '/register/invite', '/forgot-password', '/reset-password']

function isAuthPage(pathname: string): boolean {
  if (AUTH_PAGES.includes(pathname)) return true
  // /:tenantId/login is also an auth page
  return /^\/[^/]+\/login$/.test(pathname)
}

export function dashboardRoute(tenant?: TenantEntity | null): string {
  const tenantIdentifier = tenant?.identifier || 'default'
  return `/${tenantIdentifier}/dashboard`
}

export function resolvePostAuthRoute(
  account: AccountEntity | null | undefined,
  tenant?: TenantEntity | null,
): string {
  // No account yet (e.g. just-registered session that hasn't loaded /account)
  // — the profile step is the safe next stop.
  if (!account) {
    return REGISTER_PROFILE_ROUTE
  }

  if (tenant?.registration_config?.require_email_verification && !account.email_verified) {
    return VERIFY_EMAIL_ROUTE
  }

  if (!account.profiles?.length) {
    return REGISTER_PROFILE_ROUTE
  }

  return dashboardRoute(tenant)
}

export interface GuardContext {
  pathname: string
  isAuthenticated: boolean
  account: AccountEntity | null | undefined
  tenant: TenantEntity | null | undefined
}

/**
 * The single source of truth for "should this URL be allowed to render, and if
 * not, where should we send the user?" — given the current path and session.
 *
 * Returns a path to redirect to, or `null` to render the requested route.
 * Used by the app bootstrap gate on first load/reload and by the runtime route
 * guard, so all of login / register / email-verification / profile / dashboard
 * gating lives here instead of being scattered across pages.
 *
 * Callers must only invoke this once auth+tenant initialization has completed
 * (otherwise account/tenant are not yet known).
 */
export function resolveGuardRedirect(ctx: GuardContext): string | null {
  const { pathname, isAuthenticated, account, tenant } = ctx

  // First-run setup and the no-access page are never gated.
  if (pathname === NO_ACCESS_ROUTE || pathname === SERVICE_UNAVAILABLE_ROUTE || pathname.startsWith('/setup')) {
    return null
  }

  // Where this session belongs: login (unauth) or the resolved post-auth step.
  const home = isAuthenticated ? resolvePostAuthRoute(account, tenant) : LOGIN_ROUTE

  // Root → resolved home / login.
  if (pathname === '/') {
    return home
  }

  // Self-registration disabled by the tenant: the register page is off-limits.
  // (Authenticated users are already bounced to their home by the block below.)
  if (
    pathname === REGISTER_ROUTE &&
    !isAuthenticated &&
    tenant?.registration_config?.self_registration_enabled === false
  ) {
    return LOGIN_ROUTE
  }

  // Public auth pages: only bounce authenticated users to their home.
  if (isAuthPage(pathname)) {
    return isAuthenticated ? home : null
  }

  // Email-verification step: an unauthenticated visitor arrived from a login
  // redirect (no session yet) and is allowed to verify; an authenticated user
  // only stays if verification is genuinely their current step.
  if (pathname === VERIFY_EMAIL_ROUTE) {
    if (!isAuthenticated) return null
    return home === VERIFY_EMAIL_ROUTE ? null : home
  }

  // Profile-registration step: requires a session; only stays if it's the step.
  if (pathname === REGISTER_PROFILE_ROUTE) {
    if (!isAuthenticated) return LOGIN_ROUTE
    return home === REGISTER_PROFILE_ROUTE ? null : home
  }

  // Everything else is a tenant-scoped protected page.
  if (!isAuthenticated) return LOGIN_ROUTE
  // Registration not finished → send them to the outstanding step.
  if (home !== dashboardRoute(tenant)) return home
  // Tenant isolation: the URL's tenant must match the signed-in user's tenant.
  const urlTenant = getTenantIdentifierFromPath(pathname)
  const ownTenant = account?.tenant?.identifier
  if (urlTenant && ownTenant && urlTenant !== ownTenant) return NO_ACCESS_ROUTE

  return null
}
