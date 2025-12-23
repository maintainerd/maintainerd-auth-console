/**
 * Security Settings API Service
 */

import { get, put } from '@/services'
import type {
  GeneralSecuritySettingsType,
  GeneralSecuritySettingsPayload,
  GeneralSecuritySettingsResponseInterface,
  ApiResponse
} from './types'

const API_ENDPOINTS = {
  GENERAL_SETTINGS: '/security-settings/general',
}

/**
 * Fetch general security settings
 */
export async function fetchGeneralSecuritySettings(): Promise<GeneralSecuritySettingsType> {
  const response = await get<GeneralSecuritySettingsResponseInterface>(API_ENDPOINTS.GENERAL_SETTINGS)

  if (!response.success) {
    throw new Error(response.message || 'Failed to fetch general security settings')
  }

  // Transform snake_case response to camelCase
  const data = response.data
  
  const transformed: GeneralSecuritySettingsType = {
    mfaRequired: data.mfa_required,
    mfaMethods: data.mfa_methods,
    passwordlessLogin: data.passwordless_login,
    socialLoginEnabled: data.social_login_enabled,
    requireEmailVerification: data.require_email_verification,
    allowPasswordReset: data.allow_password_reset,
    securityNotifications: data.security_notifications,
    suspiciousActivityAlerts: data.suspicious_activity_alerts,
    encryptionAtRest: data.encryption_at_rest,
    encryptionInTransit: data.encryption_in_transit,
    dataRetentionDays: data.data_retention_days,
    automaticBackups: data.automatic_backups,
    backupEncryption: data.backup_encryption,
    complianceMode: data.compliance_mode,
    deviceTrustEnabled: data.device_trust_enabled,
    anonymousAnalytics: data.anonymous_analytics
  }
  
  return transformed
}

/**
 * Update general security settings
 */
export async function updateGeneralSecuritySettings(
  data: GeneralSecuritySettingsPayload
): Promise<GeneralSecuritySettingsType> {
  const response = await put<ApiResponse<GeneralSecuritySettingsType>>(
    API_ENDPOINTS.GENERAL_SETTINGS,
    data
  )

  if (!response.success) {
    throw new Error(response.message || 'Failed to update general security settings')
  }

  return response.data
}
