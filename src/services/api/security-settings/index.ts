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
  const response = await get<any>(API_ENDPOINTS.GENERAL_SETTINGS)

  if (!response.success) {
    throw new Error(response.message || 'Failed to fetch general security settings')
  }

  // Transform snake_case response to camelCase
  const snakeData = response.data
  
  const transformed = {
    mfaRequired: snakeData.mfa_required,
    mfaMethods: snakeData.mfa_methods,
    passwordlessLogin: snakeData.passwordless_login,
    socialLoginEnabled: snakeData.social_login_enabled,
    requireEmailVerification: snakeData.require_email_verification,
    allowPasswordReset: snakeData.allow_password_reset,
    securityNotifications: snakeData.security_notifications,
    suspiciousActivityAlerts: snakeData.suspicious_activity_alerts,
    encryptionAtRest: snakeData.encryption_at_rest,
    encryptionInTransit: snakeData.encryption_in_transit,
    dataRetentionDays: snakeData.data_retention_days,
    automaticBackups: snakeData.automatic_backups,
    backupEncryption: snakeData.backup_encryption,
    complianceMode: snakeData.compliance_mode,
    deviceTrustEnabled: snakeData.device_trust_enabled,
    anonymousAnalytics: snakeData.anonymous_analytics
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
