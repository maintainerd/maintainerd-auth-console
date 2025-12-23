/**
 * Security Settings API Types
 */

/**
 * General security settings configuration
 */
export interface GeneralSecuritySettingsType {
  // Multi-Factor Authentication
  mfaRequired?: boolean
  mfaMethods?: string[]
  
  // Login Methods
  passwordlessLogin?: boolean
  socialLoginEnabled?: boolean
  requireEmailVerification?: boolean
  allowPasswordReset?: boolean
  
  // Notifications
  securityNotifications?: boolean
  suspiciousActivityAlerts?: boolean
  
  // Data Protection
  encryptionAtRest?: boolean
  encryptionInTransit?: boolean
  dataRetentionDays?: number
  automaticBackups?: boolean
  backupEncryption?: boolean
  
  // Compliance
  complianceMode?: string
  
  // Advanced Security
  deviceTrustEnabled?: boolean
  anonymousAnalytics?: boolean
}

/**
 * API payload with snake_case fields for backend
 */
export interface GeneralSecuritySettingsPayload {
  mfa_required?: boolean
  mfa_methods?: string[]
  passwordless_login?: boolean
  social_login_enabled?: boolean
  require_email_verification?: boolean
  allow_password_reset?: boolean
  security_notifications?: boolean
  suspicious_activity_alerts?: boolean
  encryption_at_rest?: boolean
  encryption_in_transit?: boolean
  data_retention_days?: number
  automatic_backups?: boolean
  backup_encryption?: boolean
  compliance_mode?: string
  device_trust_enabled?: boolean
  anonymous_analytics?: boolean
}

/**
 * API Response for general security settings (backend returns snake_case)
 */
export interface GeneralSecuritySettingsResponseInterface {
  success: boolean
  data: GeneralSecuritySettingsPayload
  message: string
}

/**
 * API Response structure
 */
export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}
