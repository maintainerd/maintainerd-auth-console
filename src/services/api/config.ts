/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

// Runtime environment injected by docker-entrypoint.sh into window.__ENV__.
// Lets a single built image target different API origins per deployment without
// a rebuild. Values are optional; build-time import.meta.env is the fallback.
declare global {
  interface Window {
    __ENV__?: Record<string, string | undefined>
  }
}

function runtimeEnv(key: string): string | undefined {
  if (typeof window === 'undefined') return undefined
  const value = window.__ENV__?.[key]
  // Ignore empty placeholders left by the local-dev config.js.
  return value && value.trim() !== '' ? value : undefined
}

// Get base URL from environment variables
// In development, use relative path to go through Vite proxy
// In production, prefer runtime config, then the build-time value, then a default.
const getBaseUrl = () => {
  if (import.meta.env.DEV) {
    // Development: use relative path to go through Vite proxy
    return '/api/v1'
  }
  // Production: runtime injection wins, then build-time env, then fallback.
  return (
    runtimeEnv('VITE_AUTH_API_BASE_URL') ||
    import.meta.env.VITE_AUTH_API_BASE_URL ||
    'https://private-api.auth.maintainerd.local/api/v1'
  )
}

const getPublicBaseUrl = () => {
  if (import.meta.env.DEV) {
    // Development: use a relative path so the request goes through the Vite
    // proxy (/public-api → public-api.auth.maintainerd.local). This keeps the
    // OAuth bootstrap calls same-origin and avoids cross-origin CORS / browser
    // cert-trust failures that would otherwise abort the flow before it starts.
    return '/public-api/api/v1'
  }
  return (
    runtimeEnv('VITE_AUTH_PUBLIC_API_BASE_URL') ||
    import.meta.env.VITE_AUTH_PUBLIC_API_BASE_URL ||
    'https://public-api.auth.maintainerd.local/api/v1'
  )
}

const getIdentityBaseUrl = () => {
  return (
    runtimeEnv('VITE_AUTH_IDENTITY_BASE_URL') ||
    import.meta.env.VITE_AUTH_IDENTITY_BASE_URL ||
    'https://identity.auth.maintainerd.local'
  ).replace(/\/$/, '')
}

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  PUBLIC_BASE_URL: getPublicBaseUrl(),
  IDENTITY_BASE_URL: getIdentityBaseUrl(),
  TIMEOUT: 30000, // 30 seconds
  HEADERS: {
    'Content-Type': 'application/json',
  },
} as const

// Token delivery mode for this app. Sent on every token-issuing request
// (login, register, refresh) so the backend delivers tokens as httpOnly cookies
// instead of in the response body. Single source of truth — reuse everywhere.
export const TOKEN_DELIVERY_HEADER = { 'X-Token-Delivery': 'cookie' } as const

// API Endpoints
export const API_ENDPOINTS = {
  SETUP: {
    STATUS: '/setup/status',
    CREATE_TENANT: '/setup/create_tenant',
    CREATE_ADMIN: '/setup/create_admin',
    COMPLETE: '/setup/complete',
  },
  AUTH: {
    LOGIN: '/login',
    // Login MFA second step (issues an acr=2 session on success).
    LOGIN_MFA_VERIFY: '/login/mfa/verify',
    LOGIN_MFA_SEND_SMS: '/login/mfa/send-sms',
    LOGIN_MFA_SEND_EMAIL_OTP: '/login/mfa/send-email-otp',
    LOGIN_MFA_WEBAUTHN_BEGIN: '/login/mfa/webauthn/begin',
    REGISTER: '/register',
    REGISTER_INVITE: '/register/invite',
    LOGOUT: '/logout',
    // POST /api/v1/refresh-token — rotates the session using the httpOnly
    // refresh-token cookie (scoped to this path) and Set-Cookies fresh tokens
    // when called with `X-Token-Delivery: cookie`.
    REFRESH: '/refresh-token',
    PROFILE: '/profile',
    ACCOUNT: '/account',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  TENANT: '/tenant',
  SERVICE: '/services',
  API: '/apis',
  PERMISSION: '/permissions',
  POLICY: '/policies',
  IDENTITY_PROVIDER: '/identity_providers',
  IDENTITY_PROVIDER_TEST: '/identity_providers/test',
  CLIENT: '/clients',
  ROLE: '/roles',
  USER: '/users',
  REGISTRATION_FLOW: '/registration_flows',
  INVITE: '/invite',
  BRANDING: '/branding',
  EMAIL_TEMPLATE: '/email_templates',
  SMS_TEMPLATE: '/sms_templates',
  LOGIN_TEMPLATE: '/login_templates',
  AUTH_EVENTS: '/auth-events',
  WEBHOOK_ENDPOINT: '/webhook-endpoints',
  WEBHOOK_REPLAY: '/webhook-replay',
  EVENT_TYPE: '/event-types',
  TENANT_EVENT_TYPE: '/tenant-event-types',
  EVENT_ROUTE: '/event-routes',
  DASHBOARD: '/dashboard',
  AUTH_EVENTS_EXPORT: '/auth-events/export',
  AUTH_EVENTS_COUNT: '/auth-events/count',
  MANAGEMENT_AUDIT_LOG: '/management-audit-log',
  WORKLOAD_IDENTITY_FEDERATIONS: '/workload-identity-federations',
  CLIENT_ROLES: (id: string) => `/clients/${id}/roles`,
  USER_CONSENTS: (id: string) => `/users/${id}/consents`,
  USER_TRUSTED_DEVICES: (id: string) => `/users/${id}/devices`,
  USER_ERASURE_REQUESTS: (id: string) => `/users/${id}/erasure-requests`,
  POLICY_HISTORY: (id: string) => `/policies/${id}/history`,
} as const
