export type LoginBrandingStatus = "active" | "inactive" | "draft"
export type LoginBrandingTemplate = "modern" | "classic" | "minimal" | "corporate" | "creative" | "custom"
export type LoginBrandingLayout = "centered" | "split" | "fullscreen" | "card"

export type LoginBrandingTheme = {
  // Colors
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  cardBackgroundColor: string
  textColor: string
  linkColor: string
  errorColor: string
  successColor: string
  
  // Typography
  fontFamily: string
  fontSize: "small" | "medium" | "large"
  
  // Spacing & Layout
  borderRadius: "none" | "small" | "medium" | "large"
  spacing: "compact" | "normal" | "spacious"
}

export type LoginBrandingAssets = {
  logo?: string
  logoWidth?: number
  logoHeight?: number
  backgroundImage?: string
  favicon?: string
}

export type LoginBrandingForm = {
  // Form Fields
  showEmailField: boolean
  showPasswordField: boolean
  showRememberMe: boolean
  showForgotPassword: boolean
  
  // Social Login
  enableSocialLogin: boolean
  socialProviders: string[]
  socialButtonStyle: "icons" | "buttons" | "compact"
  
  // Form Behavior
  enableSignup: boolean
  signupRedirectUrl?: string
  loginRedirectUrl?: string
  
  // Validation
  enableClientValidation: boolean
  showPasswordStrength: boolean
}

export type LoginBrandingContent = {
  // Page Content
  title: string
  subtitle?: string
  welcomeMessage?: string
  footerText?: string
  
  // Form Labels
  emailLabel: string
  passwordLabel: string
  loginButtonText: string
  signupButtonText: string
  forgotPasswordText: string
  rememberMeText: string
  
  // Links
  termsOfServiceUrl?: string
  privacyPolicyUrl?: string
  supportUrl?: string
}

export type LoginBranding = {
  id: string
  name: string
  description: string
  status: LoginBrandingStatus
  template: LoginBrandingTemplate
  layout: LoginBrandingLayout
  
  // Configuration
  theme: LoginBrandingTheme
  assets: LoginBrandingAssets
  form: LoginBrandingForm
  content: LoginBrandingContent
  
  // Metadata
  isDefault: boolean
  isSystem: boolean
  usageCount: number
  previewUrl: string
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
}

// Constants
export const loginBrandingStatuses: LoginBrandingStatus[] = ["active", "inactive", "draft"]
export const loginBrandingTemplates: LoginBrandingTemplate[] = [
  "modern",
  "classic", 
  "minimal",
  "corporate",
  "creative",
  "custom"
]
export const loginBrandingLayouts: LoginBrandingLayout[] = ["centered", "split", "fullscreen", "card"]

export const templateDescriptions: Record<LoginBrandingTemplate, string> = {
  modern: "Clean, contemporary design with subtle animations",
  classic: "Traditional login form with professional styling",
  minimal: "Simple, distraction-free interface",
  corporate: "Professional branding with company focus",
  creative: "Unique, visually engaging design",
  custom: "Fully customizable template with advanced options"
}

export const layoutDescriptions: Record<LoginBrandingLayout, string> = {
  centered: "Centered form on solid background",
  split: "Split screen with branding and form sections",
  fullscreen: "Full-screen background with overlay form",
  card: "Card-based form with shadow and borders"
}
