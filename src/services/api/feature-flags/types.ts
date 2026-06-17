export interface FeatureFlags {
  enable_passwordless_login: boolean
  enable_email_sending: boolean
  enable_sms_sending: boolean
  enable_social_logins: boolean
  enable_audit_export: boolean
  enable_advanced_analytics: boolean
  enable_experimental_features: boolean
}

export interface FeatureFlagsResponse {
  success: boolean
  data: FeatureFlags
  message: string
}

export type FeatureFlagsPayload = Partial<FeatureFlags>
