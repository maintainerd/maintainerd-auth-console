/**
 * Password Policies Validation Schema
 */

import * as yup from 'yup'

export const passwordPoliciesSchema = yup.object({
  // Basic Requirements
  minLength: yup.number().required().min(4, 'Minimum length must be at least 4').max(128, 'Minimum length cannot exceed 128'),
  maxLength: yup.number().required().min(4, 'Maximum length must be at least 4').max(256, 'Maximum length cannot exceed 256'),
  requireUppercase: yup.boolean().required(),
  requireLowercase: yup.boolean().required(),
  requireNumbers: yup.boolean().required(),
  requireSpecialChars: yup.boolean().required(),
  allowedSpecialChars: yup.string().required(),
  
  // Advanced Requirements
  preventCommonPasswords: yup.boolean().required(),
  preventUserInfoInPassword: yup.boolean().required(),
  preventSequentialChars: yup.boolean().required(),
  preventRepeatingChars: yup.boolean().required(),
  maxRepeatingChars: yup.number().required().min(1, 'Must be at least 1').max(10, 'Cannot exceed 10'),
  
  // Expiration & History
  passwordExpiration: yup.boolean().required(),
  expirationDays: yup.number().required().min(1, 'Must be at least 1 day').max(365, 'Cannot exceed 365 days'),
  expirationWarningDays: yup.number().required().min(1, 'Must be at least 1 day').max(90, 'Cannot exceed 90 days'),
  passwordHistory: yup.boolean().required(),
  historyCount: yup.number().required().min(1, 'Must be at least 1').max(24, 'Cannot exceed 24'),
  
  // Reset & Recovery
  allowSelfReset: yup.boolean().required(),
  resetTokenExpiry: yup.number().required().min(1, 'Must be at least 1 hour').max(72, 'Cannot exceed 72 hours'),
  maxResetAttempts: yup.number().required().min(1, 'Must be at least 1').max(10, 'Cannot exceed 10'),
  resetCooldown: yup.number().required().min(1, 'Must be at least 1 minute').max(60, 'Cannot exceed 60 minutes'),
  
  // Strength Requirements
  minimumStrengthScore: yup.number().required().min(1, 'Must be at least 1').max(5, 'Cannot exceed 5'),
  showStrengthMeter: yup.boolean().required(),
  blockWeakPasswords: yup.boolean().required(),
}).required()

export type PasswordPoliciesFormData = yup.InferType<typeof passwordPoliciesSchema>
