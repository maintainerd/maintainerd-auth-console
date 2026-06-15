/**
 * Validation Schemas Index
 * Central export point for all validation schemas
 */

// Setup schemas
export {
  setupTenantSchema,
  setupAdminSchema,
  setupProfilePersonalSchema,
  setupProfileContactSchema,
  setupProfileLocationSchema,
  setupProfileCompleteSchema,
  type SetupTenantFormData,
  type SetupAdminFormData,
  type SetupProfilePersonalFormData,
  type SetupProfileContactFormData,
  type SetupProfileLocationFormData,
  type SetupProfileCompleteFormData
} from './setupSchema'

// Auth schemas
export {
  buildLoginSchema,
  buildPasswordValidation,
  buildRegisterSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type LoginFormData,
  type RegisterFormData,
  type ForgotPasswordFormData,
  type ResetPasswordFormData
} from './authSchema'

// Service schemas
export {
  serviceSchema,
  type ServiceFormData
} from './serviceSchema'

// API schemas
export {
  apiSchema,
  type ApiFormData
} from './apiSchema'

// Policy schemas
export {
  policySchema,
  policyStatementSchema,
  policyDocumentSchema,
  type PolicyFormData,
  type PolicyStatementFormData,
  type PolicyDocumentFormData
} from './policySchema'

// Identity Provider schemas
export {
  identityProviderSchema,
  type IdentityProviderFormData
} from './identityProviderSchema'

// Social Provider schemas
export {
  socialProviderSchema,
  type SocialProviderFormData
} from './socialProviderSchema'

// Client schemas
export {
  clientSchema,
  type ClientFormData
} from './clientSchema'

// API Key schemas
export {
  apiKeySchema,
  type ApiKeyFormData
} from './apiKeySchema'

// Role schemas
export {
  roleSchema,
  type RoleFormData
} from './roleSchema'

// Branding schemas
export {
  brandingSchema,
  type BrandingFormData
} from './brandingSchema'

// User schemas
export {
  userSchema,
  type UserFormData
} from './userSchema'

// User Profile schemas
export {
  userProfileSchema,
  type UserProfileFormData
} from './userProfileSchema'

// Tenant schemas
export {
  createTenantSchema,
  type CreateTenantFormData
} from './tenantSchema'

// Signup Flow schemas
export {
  signupFlowSchema,
  type SignupFlowFormData
} from './signupFlowSchema'

// Tenant Settings schemas
export {
  tenantSettingsSchema,
  type TenantSettingsFormData
} from './tenantSettingsSchema'

// Password Policies schemas
export {
  passwordPoliciesSchema,
  type PasswordPoliciesFormData
} from './passwordPoliciesSchema'

// Login Template schemas
export {
  loginTemplateSchema,
  type LoginTemplateFormData
} from './loginTemplateSchema'

// Session Settings schemas
export {
  sessionSettingsSchema,
  type SessionSettingsFormData
} from './sessionSettingsSchema'

// Token Config schemas
export {
  tokenConfigSchema,
  type TokenConfigFormData
} from './tokenConfigSchema'

// Lockout Config schemas
export {
  lockoutConfigSchema,
  type LockoutConfigFormData
} from './lockoutConfigSchema'

// Registration Config schemas
export {
  registrationConfigSchema,
  type RegistrationConfigFormData
} from './registrationConfigSchema'

// Threat Detection Settings schemas
export {
  threatDetectionSettingsSchema,
  type ThreatDetectionSettingsFormData
} from './threatDetectionSettingsSchema'

// Webhook schemas
export {
  webhookSchema,
  type WebhookFormData
} from './webhookSchema'
