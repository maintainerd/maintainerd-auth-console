/**
 * Security Settings Validation Schema
 */

import * as yup from 'yup'

export const securitySettingsSchema = yup.object({
  // Multi-Factor Authentication
  mfaRequired: yup.boolean().required(),
  mfaMethods: yup.array().of(yup.string().required()).required().min(1, 'At least one MFA method is required when MFA is enabled'),
  
  // Login Methods
  passwordlessLogin: yup.boolean().required(),
  socialLoginEnabled: yup.boolean().required(),
  requireEmailVerification: yup.boolean().required(),
  allowPasswordReset: yup.boolean().required(),
  
  // Notifications
  securityNotifications: yup.boolean().required(),
  suspiciousActivityAlerts: yup.boolean().required(),
  
  // Data Protection
  encryptionAtRest: yup.boolean().required(),
  encryptionInTransit: yup.boolean().required(),
  dataRetentionDays: yup.number().required().positive('Data retention must be a positive number').integer('Data retention must be a whole number'),
  automaticBackups: yup.boolean().required(),
  backupEncryption: yup.boolean().required(),
  
  // Compliance
  complianceMode: yup.string().required().oneOf(['standard', 'gdpr', 'hipaa', 'sox', 'pci'], 'Invalid compliance mode'),
  
  // Advanced Security
  deviceTrustEnabled: yup.boolean().required(),
  anonymousAnalytics: yup.boolean().required(),
}).required()

export type SecuritySettingsFormData = yup.InferType<typeof securitySettingsSchema>
