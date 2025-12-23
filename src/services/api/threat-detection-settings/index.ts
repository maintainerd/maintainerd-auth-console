/**
 * Threat Detection Settings API Service
 */

import { get, put } from '@/services'
import type {
  ThreatDetectionSettingsType,
  ThreatDetectionSettingsPayload,
  ThreatDetectionSettingsResponseInterface,
  ApiResponse
} from './types'

const API_ENDPOINTS = {
  THREAT_SETTINGS: '/security-settings/threat',
}

/**
 * Fetch threat detection settings
 */
export async function fetchThreatDetectionSettings(): Promise<ThreatDetectionSettingsType> {
  const response = await get<ThreatDetectionSettingsResponseInterface>(API_ENDPOINTS.THREAT_SETTINGS)

  if (!response.success) {
    throw new Error(response.message || 'Failed to fetch threat detection settings')
  }

  // Transform snake_case response to camelCase
  const snakeData = response.data
  
  const transformed: ThreatDetectionSettingsType = {
    bruteForceEnabled: snakeData.brute_force_enabled,
    maxFailedAttempts: snakeData.max_failed_attempts,
    bruteForceWindow: snakeData.brute_force_window,
    accountLockoutDuration: snakeData.account_lockout_duration,
    anomalyDetectionEnabled: snakeData.anomaly_detection_enabled,
    behaviorAnalysis: snakeData.behavior_analysis,
    velocityChecking: snakeData.velocity_checking,
    geoAnomalyDetection: snakeData.geo_anomaly_detection,
    deviceAnomalyDetection: snakeData.device_anomaly_detection,
    botProtectionEnabled: snakeData.bot_protection_enabled,
    captchaEnabled: snakeData.captcha_enabled,
    userAgentFiltering: snakeData.user_agent_filtering,
    honeypotEnabled: snakeData.honeypot_enabled,
    realTimeAlertsEnabled: snakeData.real_time_alerts_enabled,
    suspiciousActivityThreshold: snakeData.suspicious_activity_threshold,
    autoBlockSuspiciousIPs: snakeData.auto_block_suspicious_ips,
    alertAdminsEnabled: snakeData.alert_admins_enabled,
    logSuspiciousActivity: snakeData.log_suspicious_activity,
    mlThreatDetection: snakeData.ml_threat_detection,
    adaptiveLearning: snakeData.adaptive_learning,
    riskScoring: snakeData.risk_scoring,
    behaviorBaselines: snakeData.behavior_baselines,
    autoResponseEnabled: snakeData.auto_response_enabled,
    escalationEnabled: snakeData.escalation_enabled,
    quarantineEnabled: snakeData.quarantine_enabled,
    notificationChannels: snakeData.notification_channels
  }
  
  return transformed
}

/**
 * Update threat detection settings
 */
export async function updateThreatDetectionSettings(
  data: ThreatDetectionSettingsPayload
): Promise<ThreatDetectionSettingsType> {
  const response = await put<ApiResponse<ThreatDetectionSettingsType>>(
    API_ENDPOINTS.THREAT_SETTINGS,
    data
  )

  if (!response.success) {
    throw new Error(response.message || 'Failed to update threat detection settings')
  }

  return response.data
}
