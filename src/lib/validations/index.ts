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
  loginSchema,
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

// Signup Flow schemas
export {
  signupFlowSchema,
  type SignupFlowFormData
} from './signupFlowSchema'

// Security Settings schemas
export {
  securitySettingsSchema,
  type SecuritySettingsFormData
} from './securitySettingsSchema'

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
