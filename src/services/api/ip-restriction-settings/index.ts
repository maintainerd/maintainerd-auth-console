/**
 * IP Restriction Settings API Service
 */

import { get, put } from '@/services'
import type {
  IpRestrictionSettingsType,
  IpRestrictionSettingsPayload,
  IpRestrictionSettingsResponseInterface,
} from './types'

export async function fetchIpRestrictionSettings(): Promise<IpRestrictionSettingsType> {
  const response = await get<IpRestrictionSettingsResponseInterface>(
    '/security-settings/ip'
  )

  if (!response.success) {
    throw new Error(response.message || 'Failed to fetch IP restriction settings')
  }

  // Transform snake_case response to camelCase
  const data = response.data

  return {
    ipRestrictionsEnabled: data.ip_restrictions_enabled,
    defaultAction: data.default_action,
    logBlockedAttempts: data.log_blocked_attempts,
    geoBlockingEnabled: data.geo_blocking_enabled,
    rateLimitingEnabled: data.rate_limiting_enabled,
    requestsPerMinute: data.requests_per_minute,
    burstLimit: data.burst_limit,
    blockedCountries: data.blocked_countries,
    allowedCountries: data.allowed_countries,
    proxyDetectionEnabled: data.proxy_detection_enabled,
    vpnDetectionEnabled: data.vpn_detection_enabled,
    torDetectionEnabled: data.tor_detection_enabled,
    cloudProviderBlocking: data.cloud_provider_blocking,
  }
}

export async function updateIpRestrictionSettings(
  payload: IpRestrictionSettingsPayload
): Promise<void> {
  await put('/security-settings/ip', payload)
}
