/**
 * Role Form Validation Schema
 * Yup validation schema for role-related forms
 */

import * as yup from 'yup'

// Role Form Schema
export const roleSchema = yup.object({
  name: yup
    .string()
    .required('Role name is required')
    .min(2, 'Role name must be at least 2 characters')
    .max(100, 'Role name must not exceed 100 characters')
    .matches(
      /^[a-z0-9-_]+$/,
      'Role name must contain only lowercase letters, numbers, hyphens, and underscores'
    ),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters'),
  status: yup
    .string()
    .oneOf(['active', 'inactive'], 'Invalid status')
    .required('Status is required'),
})

export type RoleFormData = yup.InferType<typeof roleSchema>
