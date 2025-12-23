/**
 * Threat Detection Settings Validation Schema
 */

import * as yup from 'yup'

export const threatDetectionSettingsSchema = yup.object({
  // Brute Force Protection
  bruteForceEnabled: yup.boolean().required(),
  maxFailedAttempts: yup.number().required().min(1).max(50),
  bruteForceWindow: yup.number().required().min(1).max(60),
  accountLockoutDuration: yup.number().required().min(1).max(1440),
  
  // Anomaly Detection
  anomalyDetectionEnabled: yup.boolean().required(),
  behaviorAnalysis: yup.boolean().required(),
  velocityChecking: yup.boolean().required(),
  geoAnomalyDetection: yup.boolean().required(),
  deviceAnomalyDetection: yup.boolean().required(),
  
  // Bot Protection
  botProtectionEnabled: yup.boolean().required(),
  captchaEnabled: yup.boolean().required(),
  userAgentFiltering: yup.boolean().required(),
  honeypotEnabled: yup.boolean().required(),
  
  // Real-time Monitoring
  realTimeAlertsEnabled: yup.boolean().required(),
  suspiciousActivityThreshold: yup.string().required().oneOf(['low', 'medium', 'high', 'critical']),
  autoBlockSuspiciousIPs: yup.boolean().required(),
  alertAdminsEnabled: yup.boolean().required(),
  logSuspiciousActivity: yup.boolean().required(),
  
  // Machine Learning
  mlThreatDetection: yup.boolean().required(),
  adaptiveLearning: yup.boolean().required(),
  riskScoring: yup.boolean().required(),
  behaviorBaselines: yup.boolean().required(),
  
  // Response Actions
  autoResponseEnabled: yup.boolean().required(),
  escalationEnabled: yup.boolean().required(),
  quarantineEnabled: yup.boolean().required(),
  notificationChannels: yup.array().of(yup.string().required()).required(),
}).required()

export type ThreatDetectionSettingsFormData = yup.InferType<typeof threatDetectionSettingsSchema>
