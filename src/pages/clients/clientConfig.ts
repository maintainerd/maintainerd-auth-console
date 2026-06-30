export type ConfigEntry = [string, unknown]

export interface ConfigSection {
  title: string
  description: string
  entries: ConfigEntry[]
}

export const COMMON_CLIENT_CONFIG_KEYS = new Set([
  "access_token_lifetime",
  "access_token_ttl",
  "allowed_logout_urls",
  "allowed_origins",
  "allowed_scopes",
  "claim_mappers",
  "client_authentication_methods",
  "client_secret_expires_at",
  "consent_required",
  "cors_allowed_origins",
  "cors_enabled",
  "default_scopes",
  "grant_types",
  "id_token_lifetime",
  "jwks",
  "jwks_uri",
  "login_uri",
  "logout_uri",
  "multi_resource_refresh_token",
  "mtls_bound_cert_thumbprint",
  "pkce_required",
  "redirect_uris",
  "refresh_token_lifetime",
  "refresh_token_rotation",
  "refresh_token_ttl",
  "require_consent",
  "required_acr",
  "response_types",
  "scope_claim_mappings",
  "session_absolute_timeout",
  "session_idle_timeout",
  "token_endpoint_auth_method",
])

const REGISTRATION_FLOW_KEYS = new Set([
  "grant_types",
  "response_types",
  "token_endpoint_auth_method",
  "client_authentication_methods",
  "allowed_scopes",
  "default_scopes",
  "require_consent",
  "consent_required",
  "pkce_required",
])

const TOKEN_KEYS = new Set([
  "access_token_lifetime",
  "access_token_ttl",
  "refresh_token_lifetime",
  "refresh_token_ttl",
  "id_token_lifetime",
  "refresh_token_rotation",
  "multi_resource_refresh_token",
  "client_secret_expires_at",
])

const URI_AND_CORS_KEYS = new Set([
  "allowed_logout_urls",
  "allowed_origins",
  "cors_allowed_origins",
  "cors_enabled",
  "login_uri",
  "logout_uri",
  "redirect_uris",
])

const SECURITY_KEYS = new Set([
  "required_acr",
  "session_idle_timeout",
  "session_absolute_timeout",
])

const ADVANCED_KEYS = new Set([
  "jwks",
  "jwks_uri",
  "mtls_bound_cert_thumbprint",
  "scope_claim_mappings",
  "claim_mappers",
])

function collectEntries(config: Record<string, unknown>, keys: Set<string>): ConfigEntry[] {
  return Object.entries(config).filter(([key]) => keys.has(key))
}

export function getClientConfigSections(config: Record<string, unknown>): ConfigSection[] {
  const commonConfig = getKnownClientConfig(config)

  return [
    {
      title: "Authorization Flow",
      description: "OAuth and OIDC behavior supported by this client.",
      entries: collectEntries(commonConfig, REGISTRATION_FLOW_KEYS),
    },
    {
      title: "Token Settings",
      description: "Token lifetimes, rotation, and related security behavior.",
      entries: collectEntries(commonConfig, TOKEN_KEYS),
    },
    {
      title: "Step-up & Session Security",
      description: "Per-client authentication-assurance and session-lifetime overrides. Blank values inherit the tenant security policy.",
      entries: collectEntries(commonConfig, SECURITY_KEYS),
    },
    {
      title: "Application URI & CORS Settings",
      description: "Legacy URI lists and cross-origin authentication behavior stored in client config.",
      entries: collectEntries(commonConfig, URI_AND_CORS_KEYS),
    },
    {
      title: "Advanced Client Security",
      description: "JWT client authentication, mTLS, and claim mapping settings.",
      entries: collectEntries(commonConfig, ADVANCED_KEYS),
    },
  ].filter((section) => section.entries.length > 0)
}

export function getClientMetadataEntries(config: Record<string, unknown>): ConfigEntry[] {
  return Object.entries(getClientMetadata(config))
}

export function getClientMetadata(config: Record<string, unknown>): Record<string, unknown> {
  const metadata: Record<string, unknown> = {}

  Object.entries(config).forEach(([key, value]) => {
    if (key === "custom" && isRecord(value)) {
      Object.entries(value).forEach(([customKey, customValue]) => {
        if (!COMMON_CLIENT_CONFIG_KEYS.has(customKey)) {
          metadata[customKey] = customValue
        }
      })
      return
    }

    if (!COMMON_CLIENT_CONFIG_KEYS.has(key)) {
      metadata[key] = value
    }
  })

  return metadata
}

function getKnownClientConfig(config: Record<string, unknown>): Record<string, unknown> {
  const commonConfig: Record<string, unknown> = {}

  Object.entries(config).forEach(([key, value]) => {
    if (key !== "custom" && COMMON_CLIENT_CONFIG_KEYS.has(key)) {
      commonConfig[key] = value
    }
  })

  const custom = config.custom
  if (isRecord(custom)) {
    Object.entries(custom).forEach(([key, value]) => {
      if (COMMON_CLIENT_CONFIG_KEYS.has(key) && commonConfig[key] === undefined) {
        commonConfig[key] = value
      }
    })
  }

  return commonConfig
}

export function formatClientConfigValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return ""
  if (typeof value === "boolean") return value ? "Enabled" : "Disabled"
  if (Array.isArray(value)) return value.join(", ")
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

export function parseBooleanConfigValue(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true
    if (value.toLowerCase() === "false") return false
  }
  return fallback
}

export function parseNumberConfigValue(value: unknown, fallback: number): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function parseStringArrayConfigValue(value: unknown, fallback: string[] = []): string[] {
  if (Array.isArray(value)) {
    return value.map(String).map((item) => item.trim()).filter(Boolean)
  }

  if (typeof value === "string") {
    const trimmed = value.trim()
    if (!trimmed) return fallback

    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed: unknown = JSON.parse(trimmed)
        if (Array.isArray(parsed)) {
          return parsed.map(String).map((item) => item.trim()).filter(Boolean)
        }
      } catch {
        // Fall through to comma-separated parsing.
      }
    }

    return trimmed.split(",").map((item) => item.trim()).filter(Boolean)
  }

  return fallback
}

export function parseStringConfigValue(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value
  if (value === null || value === undefined) return fallback
  return String(value)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}
