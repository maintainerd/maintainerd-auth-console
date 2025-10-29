export type SmsTemplateType = 
  | "welcome" 
  | "verification" 
  | "password_reset" 
  | "invitation" 
  | "notification" 
  | "marketing" 
  | "transactional"
  | "custom"

export type SmsTemplateCategory = "authentication" | "user_management" | "notifications" | "marketing" | "system"

export type SmsTemplateVariable = {
  name: string
  description: string
  example: string
  required: boolean
}

export type SmsTemplateContent = {
  message: string
  maxLength: number
}

export type SmsTemplate = {
  id: string
  name: string
  description: string
  type: SmsTemplateType
  category: SmsTemplateCategory

  // Content
  content: SmsTemplateContent

  // Configuration
  variables: SmsTemplateVariable[]
  isSystem: boolean
  isDefault: boolean

  // Metadata
  createdAt: string
  createdBy: string

  // Preview
  previewUrl?: string
}

// Constants
export const smsTemplateTypes: SmsTemplateType[] = [
  "welcome",
  "verification", 
  "password_reset",
  "invitation",
  "notification",
  "marketing",
  "transactional",
  "custom"
]

export const smsTemplateCategories: SmsTemplateCategory[] = [
  "authentication",
  "user_management", 
  "notifications",
  "marketing",
  "system"
]

export const typeDescriptions: Record<SmsTemplateType, string> = {
  welcome: "Welcome new users to your platform",
  verification: "Phone number verification messages",
  password_reset: "Password reset and recovery SMS",
  invitation: "User invitation and onboarding SMS",
  notification: "System and user notifications",
  marketing: "Promotional and marketing campaigns",
  transactional: "Order confirmations and receipts",
  custom: "Custom SMS templates for specific needs"
}

export const categoryDescriptions: Record<SmsTemplateCategory, string> = {
  authentication: "Login, signup, and security-related messages",
  user_management: "User invitations, role changes, and account updates",
  notifications: "System alerts, reminders, and status updates",
  marketing: "Promotional campaigns and product announcements",
  system: "System-generated messages and automated communications"
}
