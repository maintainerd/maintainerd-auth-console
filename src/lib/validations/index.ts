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

// Add more schema exports as needed
// export { userSchema, type UserFormData } from './userSchema'
