/**
 * Threat Detection Settings API Types
 */

/**
 * Threat detection settings configuration
 */
export interface ThreatDetectionSettingsType {
  // Brute Force Protection
  bruteForceEnabled?: boolean
  maxFailedAttempts?: number
  bruteForceWindow?: number
  accountLockoutDuration?: number
  
  // Anomaly Detection
  anomalyDetectionEnabled?: boolean
  behaviorAnalysis?: boolean
  velocityChecking?: boolean
  geoAnomalyDetection?: boolean
  deviceAnomalyDetection?: boolean
  
  // Bot Protection
  botProtectionEnabled?: boolean
  captchaEnabled?: boolean
  userAgentFiltering?: boolean
  honeypotEnabled?: boolean
  
  // Real-time Monitoring
  realTimeAlertsEnabled?: boolean
  suspiciousActivityThreshold?: string
  autoBlockSuspiciousIPs?: boolean
  alertAdminsEnabled?: boolean
  logSuspiciousActivity?: boolean
  
  // Machine Learning
  mlThreatDetection?: boolean
  adaptiveLearning?: boolean
  riskScoring?: boolean
  behaviorBaselines?: boolean
  
  // Response Actions
  autoResponseEnabled?: boolean
  escalationEnabled?: boolean
  quarantineEnabled?: boolean
  notificationChannels?: string[]
}

/**
 * API payload with snake_case fields for backend
 */
export interface ThreatDetectionSettingsPayload {
  brute_force_enabled?: boolean
  max_failed_attempts?: number
  brute_force_window?: number
  account_lockout_duration?: number
  anomaly_detection_enabled?: boolean
  behavior_analysis?: boolean
  velocity_checking?: boolean
  geo_anomaly_detection?: boolean
  device_anomaly_detection?: boolean
  bot_protection_enabled?: boolean
  captcha_enabled?: boolean
  user_agent_filtering?: boolean
  honeypot_enabled?: boolean
  real_time_alerts_enabled?: boolean
  suspicious_activity_threshold?: string
  auto_block_suspicious_ips?: boolean
  alert_admins_enabled?: boolean
  log_suspicious_activity?: boolean
  ml_threat_detection?: boolean
  adaptive_learning?: boolean
  risk_scoring?: boolean
  behavior_baselines?: boolean
  auto_response_enabled?: boolean
  escalation_enabled?: boolean
  quarantine_enabled?: boolean
  notification_channels?: string[]
}

/**
 * API Response for threat detection settings (backend returns snake_case)
 */
export interface ThreatDetectionSettingsResponseInterface {
  success: boolean
  data: ThreatDetectionSettingsPayload
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
