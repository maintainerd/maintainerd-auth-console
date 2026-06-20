/**
 * Validation Schemas Index
 * Central export point for all validation schemas
 */

// Setup schemas
export {
  setupTenantSchema,
  setupAdminSchema,
  setupProfileContactSchema,
  setupProfileLocationSchema,
  type SetupTenantFormData,
  type SetupAdminFormData,
  type SetupProfileContactFormData,
  type SetupProfileLocationFormData,
} from './setupSchema'

// Auth schemas
export {
  buildLoginSchema,
  buildRegisterSchema,
  buildResetPasswordSchema,
  forgotPasswordSchema,
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
  type PolicyFormData,
} from './policySchema'

// Identity Provider schemas
export {
  identityProviderSchema,
  type IdentityProviderFormData
} from './identityProviderSchema'

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
  PASSWORD_POLICY_LIMITS,
  passwordPoliciesSchema,
  type PasswordPoliciesFormData
} from './passwordPoliciesSchema'

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

// Tenant settings schemas
export { rateLimitConfigSchema, type RateLimitConfigFormData } from './rateLimitConfigSchema'
export { auditConfigSchema, type AuditConfigFormData } from './auditConfigSchema'
export { maintenanceConfigSchema, type MaintenanceConfigFormData } from './maintenanceConfigSchema'
