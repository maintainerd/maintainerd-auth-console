import * as yup from 'yup'

export const PASSWORD_POLICY_LIMITS = {
  maxLength: 128,
  maxHistoryCount: 24,
  maxAgeDays: 3650,
  maxTemporaryPasswordValidityHours: 720,
} as const

export const passwordPoliciesSchema = yup.object({
  min_length: yup
    .number()
    .integer('Must be a whole number')
    .required('Minimum length is required')
    .min(1, 'Must be at least 1')
    .max(PASSWORD_POLICY_LIMITS.maxLength, `Cannot exceed ${PASSWORD_POLICY_LIMITS.maxLength}`),
  max_length: yup
    .number()
    .integer('Must be a whole number')
    .required('Maximum length is required')
    .min(64, 'Must be at least 64')
    .max(PASSWORD_POLICY_LIMITS.maxLength, `Cannot exceed ${PASSWORD_POLICY_LIMITS.maxLength}`)
    .test(
      'not-less-than-minimum',
      'Maximum length must be greater than or equal to minimum length',
      function (value) {
        return value >= this.parent.min_length
      },
    ),
  require_uppercase: yup.boolean().required(),
  require_lowercase: yup.boolean().required(),
  require_number: yup.boolean().required(),
  require_symbol: yup.boolean().required(),
  reject_common_passwords: yup.boolean().required(),
  check_hibp: yup.boolean().required(),
  password_history_count: yup
    .number()
    .integer('Must be a whole number')
    .required()
    .min(0, 'Cannot be negative')
    .max(PASSWORD_POLICY_LIMITS.maxHistoryCount, `Cannot exceed ${PASSWORD_POLICY_LIMITS.maxHistoryCount}`),
  max_age_days: yup
    .number()
    .integer('Must be a whole number')
    .required()
    .min(0, 'Cannot be negative')
    .max(PASSWORD_POLICY_LIMITS.maxAgeDays, `Cannot exceed ${PASSWORD_POLICY_LIMITS.maxAgeDays} days`),
  temporary_password_validity_hours: yup
    .number()
    .integer('Must be a whole number')
    .required()
    .min(1, 'Must be at least 1 hour')
    .max(
      PASSWORD_POLICY_LIMITS.maxTemporaryPasswordValidityHours,
      `Cannot exceed ${PASSWORD_POLICY_LIMITS.maxTemporaryPasswordValidityHours} hours`,
    ),
  hash_algorithm: yup
    .string()
    .required('Hashing algorithm is required')
    .oneOf(['argon2id', 'bcrypt', 'scrypt', 'pbkdf2'], 'Invalid algorithm'),
  min_strength_score: yup
    .number()
    .integer('Must be a whole number')
    .required()
    .min(0, 'Must be 0–4')
    .max(4, 'Must be 0–4'),
}).required()

export type PasswordPoliciesFormData = yup.InferType<typeof passwordPoliciesSchema>
