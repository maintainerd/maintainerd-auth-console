/**
 * User Form Validation Schema
 * Yup validation schema for user-related forms
 */

import * as yup from 'yup'

// User Form Schema
export const userSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(100, 'Username must not exceed 100 characters')
    .matches(
      /^[a-zA-Z0-9._@-]+$/,
      'Username must contain only letters, numbers, dots, underscores, @ and hyphens'
    ),
  fullname: yup
    .string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(150, 'Full name must not exceed 150 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email address')
    .max(255, 'Email must not exceed 255 characters'),
  phone: yup
    .string()
    .optional()
    .matches(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
      {
        message: 'Invalid phone number format',
        excludeEmptyString: true
      }
    ),
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
  fullname: string
  email: string
  phone: string | undefined
  password: string | undefined
  status: 'active' | 'inactive' | 'pending' | 'suspended'
}
