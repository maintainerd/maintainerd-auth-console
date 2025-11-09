/**
 * Setup Form Validation Schemas
 * Yup validation schemas for setup-related forms
 */

import * as yup from 'yup'

// Setup Tenant Form Schema
export const setupTenantSchema = yup.object({
  name: yup
    .string()
    .required('Tenant name is required')
    .min(2, 'Tenant name must be at least 2 characters')
    .max(100, 'Tenant name must not exceed 100 characters')
    .matches(
      /^[a-zA-Z0-9\s\-_&.()]+$/,
      'Tenant name can only contain letters, numbers, spaces, and common punctuation'
    ),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters')
})

// Type inference from schema
export type SetupTenantFormData = yup.InferType<typeof setupTenantSchema>

// Setup Admin Form Schema (for future use)
export const setupAdminSchema = yup.object({
  fullName: yup
    .string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters')
    .matches(
      /^[a-zA-Z\s\-']+$/,
      'Full name can only contain letters, spaces, hyphens, and apostrophes'
    ),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must not exceed 255 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match')
})

export type SetupAdminFormData = yup.InferType<typeof setupAdminSchema>
