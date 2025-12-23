/**
 * IP Restriction Settings Types
 */

export interface IpRestrictionSettingsType {
  ipRestrictionsEnabled: boolean
  defaultAction: string
  logBlockedAttempts: boolean
  geoBlockingEnabled: boolean
  rateLimitingEnabled: boolean
  requestsPerMinute: number
  burstLimit: number
  blockedCountries: string[]
  allowedCountries: string[]
  proxyDetectionEnabled: boolean
  vpnDetectionEnabled: boolean
  torDetectionEnabled: boolean
  cloudProviderBlocking: boolean
}

export interface IpRestrictionSettingsPayload {
  ip_restrictions_enabled: boolean
  default_action: string
  log_blocked_attempts: boolean
  geo_blocking_enabled: boolean
  rate_limiting_enabled: boolean
  requests_per_minute: number
  burst_limit: number
  blocked_countries: string[]
  allowed_countries: string[]
  proxy_detection_enabled: boolean
  vpn_detection_enabled: boolean
  tor_detection_enabled: boolean
  cloud_provider_blocking: boolean
}

export interface IpRestrictionSettingsResponseInterface {
  success: boolean
  data: IpRestrictionSettingsPayload
  message: string
}
