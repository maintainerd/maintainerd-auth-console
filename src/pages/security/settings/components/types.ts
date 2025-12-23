import type { FieldErrors } from "react-hook-form"

export interface SecuritySettings {
  // Multi-Factor Authentication
  mfaRequired: boolean
  mfaMethods: string[]
  
  // Login Methods
  passwordlessLogin: boolean
  socialLoginEnabled: boolean
  requireEmailVerification: boolean
  allowPasswordReset: boolean
  
  // Notifications
  securityNotifications: boolean
  suspiciousActivityAlerts: boolean
  
  // Data Protection
  encryptionAtRest: boolean
  encryptionInTransit: boolean
  dataRetentionDays: number
  automaticBackups: boolean
  backupEncryption: boolean
  
  // Compliance
  complianceMode: string
  
  // Advanced Security
  deviceTrustEnabled: boolean
  anonymousAnalytics: boolean
}

export interface BaseSettingsProps {
  onUpdate: (updates: Partial<SecuritySettings>) => void
  errors?: FieldErrors<SecuritySettings>
}
