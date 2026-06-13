import * as yup from 'yup'

export const passwordPoliciesSchema = yup.object({
  min_length: yup
    .number()
    .required('Minimum length is required')
    .min(1, 'Must be at least 1')
    .max(128, 'Cannot exceed 128'),
  max_length: yup
    .number()
    .required('Maximum length is required')
    .min(64, 'Must be at least 64')
    .max(128, 'Cannot exceed 128'),
  require_uppercase: yup.boolean().required(),
  require_lowercase: yup.boolean().required(),
  require_number: yup.boolean().required(),
  require_symbol: yup.boolean().required(),
  reject_common_passwords: yup.boolean().required(),
  check_hibp: yup.boolean().required(),
  password_history_count: yup
    .number()
    .required()
    .min(0, 'Cannot be negative'),
  max_age_days: yup
    .number()
    .required()
    .min(0, 'Cannot be negative'),
  temporary_password_validity_hours: yup
    .number()
    .required()
    .min(1, 'Must be at least 1 hour'),
  hash_algorithm: yup
    .string()
    .required('Hashing algorithm is required')
    .oneOf(['argon2id', 'bcrypt', 'scrypt', 'pbkdf2'], 'Invalid algorithm'),
  min_strength_score: yup
    .number()
    .required()
    .min(0, 'Must be 0–4')
    .max(4, 'Must be 0–4'),
}).required()

export type PasswordPoliciesFormData = yup.InferType<typeof passwordPoliciesSchema>
