
export type EmailTemplateType = 
  | "welcome" 
  | "verification" 
  | "password_reset" 
  | "invitation" 
  | "notification" 
  | "marketing" 
  | "transactional"
  | "custom"

export type EmailTemplateCategory = "authentication" | "user_management" | "notifications" | "marketing" | "system"

export type EmailTemplateVariable = {
  name: string
  description: string
  example: string
  required: boolean
}

export type EmailTemplateContent = {
  subject: string
  htmlBody: string
  textBody: string
  preheader?: string
}

export type EmailTemplateDesign = {
  // Colors
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  linkColor: string
  
  // Typography
  fontFamily: string
  fontSize: "small" | "medium" | "large"
  
  // Layout
  width: number
  padding: "compact" | "normal" | "spacious"
  borderRadius: "none" | "small" | "medium" | "large"
  
  // Branding
  showLogo: boolean
  logoUrl?: string
  logoWidth?: number
  logoHeight?: number
  
  // Footer
  showFooter: boolean
  footerText?: string
  showUnsubscribe: boolean
  showSocialLinks: boolean
  socialLinks?: {
    platform: string
    url: string
  }[]
}

export type EmailTemplate = {
  id: string
  name: string
  description: string
  type: EmailTemplateType
  category: EmailTemplateCategory

  // Content
  content: EmailTemplateContent
  design: EmailTemplateDesign

  // Configuration
  variables: EmailTemplateVariable[]
  isSystem: boolean
  isDefault: boolean

  // Metadata
  createdAt: string
  createdBy: string

  // Preview
  previewUrl?: string
}

// Constants
export const emailTemplateTypes: EmailTemplateType[] = [
  "welcome",
  "verification", 
  "password_reset",
  "invitation",
  "notification",
  "marketing",
  "transactional",
  "custom"
]

export const emailTemplateCategories: EmailTemplateCategory[] = [
  "authentication",
  "user_management", 
  "notifications",
  "marketing",
  "system"
]

export const typeDescriptions: Record<EmailTemplateType, string> = {
  welcome: "Welcome new users to your platform",
  verification: "Email address verification messages",
  password_reset: "Password reset and recovery emails",
  invitation: "User invitation and onboarding emails",
  notification: "System and user notifications",
  marketing: "Promotional and marketing campaigns",
  transactional: "Order confirmations and receipts",
  custom: "Custom email templates for specific needs"
}

export const categoryDescriptions: Record<EmailTemplateCategory, string> = {
  authentication: "Login, signup, and security-related emails",
  user_management: "User account and profile management",
  notifications: "System alerts and user notifications", 
  marketing: "Promotional content and campaigns",
  system: "System-generated administrative emails"
}

// Default variables available in all templates
export const defaultVariables: EmailTemplateVariable[] = [
  {
    name: "user.name",
    description: "User's full name",
    example: "John Doe",
    required: false
  },
  {
    name: "user.email", 
    description: "User's email address",
    example: "john@example.com",
    required: false
  },
  {
    name: "user.firstName",
    description: "User's first name",
    example: "John",
    required: false
  },
  {
    name: "company.name",
    description: "Company or application name",
    example: "Acme Corp",
    required: false
  },
  {
    name: "company.url",
    description: "Company website URL",
    example: "https://acme.com",
    required: false
  },
  {
    name: "support.email",
    description: "Support email address",
    example: "support@acme.com",
    required: false
  },
  {
    name: "support.url",
    description: "Support page URL",
    example: "https://acme.com/support",
    required: false
  }
]
