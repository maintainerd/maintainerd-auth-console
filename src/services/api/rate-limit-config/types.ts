export interface RateLimitConfig {
  enabled: boolean
  requests_per_window: number
  window_duration_seconds: number
  per_ip: boolean
  per_api_key: boolean
  exempt_ips: string[]
  endpoint_overrides: Record<string, number>
}

export interface RateLimitConfigResponse {
  success: boolean
  data: RateLimitConfig
  message: string
}

export type RateLimitConfigPayload = Partial<RateLimitConfig>
