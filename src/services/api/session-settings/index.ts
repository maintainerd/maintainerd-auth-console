/**
 * Session Settings API Service
 */

import { get, put } from '@/services'
import type {
  SessionSettingsType,
  SessionSettingsPayload,
  SessionSettingsResponseInterface,
  ApiResponse
} from './types'

const API_ENDPOINTS = {
  SESSION_SETTINGS: '/security-settings/session',
}

/**
 * Fetch session settings
 */
export async function fetchSessionSettings(): Promise<SessionSettingsType> {
  const response = await get<SessionSettingsResponseInterface>(API_ENDPOINTS.SESSION_SETTINGS)

  if (!response.success) {
    throw new Error(response.message || 'Failed to fetch session settings')
  }

  // Transform snake_case response to camelCase
  const snakeData = response.data
  
  const transformed: SessionSettingsType = {
    sessionTimeout: snakeData.session_timeout,
    idleTimeout: snakeData.idle_timeout,
    absoluteTimeout: snakeData.absolute_timeout,
    rememberMeEnabled: snakeData.remember_me_enabled,
    rememberMeDuration: snakeData.remember_me_duration,
    concurrentSessionsEnabled: snakeData.concurrent_sessions_enabled,
    maxConcurrentSessions: snakeData.max_concurrent_sessions,
    sessionBindingEnabled: snakeData.session_binding_enabled,
    ipBindingEnabled: snakeData.ip_binding_enabled,
    deviceBindingEnabled: snakeData.device_binding_enabled,
    sessionLoggingEnabled: snakeData.session_logging_enabled,
    suspiciousSessionDetection: snakeData.suspicious_session_detection,
    geoLocationTracking: snakeData.geo_location_tracking,
    deviceFingerprintingEnabled: snakeData.device_fingerprinting_enabled,
    forceLogoutOnPasswordChange: snakeData.force_logout_on_password_change,
    forceLogoutOnRoleChange: snakeData.force_logout_on_role_change,
    adminCanTerminateSessions: snakeData.admin_can_terminate_sessions,
    userCanViewActiveSessions: snakeData.user_can_view_active_sessions,
    sessionTokenRotation: snakeData.session_token_rotation,
    tokenRotationInterval: snakeData.token_rotation_interval,
    secureSessionCookies: snakeData.secure_session_cookies,
    sameSiteCookies: snakeData.same_site_cookies
  }
  
  return transformed
}

/**
 * Update session settings
 */
export async function updateSessionSettings(
  data: SessionSettingsPayload
): Promise<SessionSettingsType> {
  const response = await put<ApiResponse<SessionSettingsType>>(
    API_ENDPOINTS.SESSION_SETTINGS,
    data
  )

  if (!response.success) {
    throw new Error(response.message || 'Failed to update session settings')
  }

  return response.data
}
