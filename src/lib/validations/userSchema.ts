/**
 * User Form Validation Schema
 * Yup validation schema for user-related forms. Kept in sync with the backend
 * `UserCreateRequestDTO` / `UserUpdateRequestDTO` validation (internal/user).
 */

import * as yup from 'yup'

// User Form Schema
export const userSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters')
    .matches(
      /^[a-zA-Z0-9._@-]+$/,
      'Username must contain only letters, numbers, dots, underscores, @ and hyphens'
    ),
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email address')
    .max(255, 'Email must not exceed 255 characters'),
  phone: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional()
    .min(10, 'Phone must be at least 10 characters')
    .max(20, 'Phone must not exceed 20 characters'),
  password: yup
    .string()
    .when('$isCreating', {
      is: true,
      then: (schema) => schema
        .required('Password is required when creating a user')
        .min(8, 'Password must be at least 8 characters')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),
      otherwise: (schema) => schema.optional()
    }),
  status: yup
    .string()
    .oneOf(['active', 'inactive', 'pending', 'suspended'], 'Invalid status')
    .required('Status is required'),
})

export type UserFormData = {
  username: string
  email: string
  phone: string | undefined
  password: string | undefined
  status: 'active' | 'inactive' | 'pending' | 'suspended'
}
