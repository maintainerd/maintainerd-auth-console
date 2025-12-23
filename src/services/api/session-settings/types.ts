/**
 * Session Settings API Types
 */

/**
 * Session settings configuration
 */
export interface SessionSettingsType {
  // Session Timeouts
  sessionTimeout?: number
  idleTimeout?: number
  absoluteTimeout?: number
  rememberMeEnabled?: boolean
  rememberMeDuration?: number
  
  // Session Security
  concurrentSessionsEnabled?: boolean
  maxConcurrentSessions?: number
  sessionBindingEnabled?: boolean
  ipBindingEnabled?: boolean
  deviceBindingEnabled?: boolean
  
  // Session Monitoring
  sessionLoggingEnabled?: boolean
  suspiciousSessionDetection?: boolean
  geoLocationTracking?: boolean
  deviceFingerprintingEnabled?: boolean
  
  // Session Termination
  forceLogoutOnPasswordChange?: boolean
  forceLogoutOnRoleChange?: boolean
  adminCanTerminateSessions?: boolean
  userCanViewActiveSessions?: boolean
  
  // Advanced Settings
  sessionTokenRotation?: boolean
  tokenRotationInterval?: number
  secureSessionCookies?: boolean
  sameSiteCookies?: string
}

/**
 * API payload with snake_case fields for backend
 */
export interface SessionSettingsPayload {
  session_timeout?: number
  idle_timeout?: number
  absolute_timeout?: number
  remember_me_enabled?: boolean
  remember_me_duration?: number
  concurrent_sessions_enabled?: boolean
  max_concurrent_sessions?: number
  session_binding_enabled?: boolean
  ip_binding_enabled?: boolean
  device_binding_enabled?: boolean
  session_logging_enabled?: boolean
  suspicious_session_detection?: boolean
  geo_location_tracking?: boolean
  device_fingerprinting_enabled?: boolean
  force_logout_on_password_change?: boolean
  force_logout_on_role_change?: boolean
  admin_can_terminate_sessions?: boolean
  user_can_view_active_sessions?: boolean
  session_token_rotation?: boolean
  token_rotation_interval?: number
  secure_session_cookies?: boolean
  same_site_cookies?: string
}

/**
 * API Response for session settings (backend returns snake_case)
 */
export interface SessionSettingsResponseInterface {
  success: boolean
  data: SessionSettingsPayload
  message: string
}

/**
 * Generic API Response
 */
export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}
