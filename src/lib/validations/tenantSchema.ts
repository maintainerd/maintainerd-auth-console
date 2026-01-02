/**
 * Tenant Form Validation Schemas
 * Yup validation schemas for tenant-related forms
 */

import * as yup from 'yup'

// Create Tenant Form Schema
export const createTenantSchema = yup.object({
  name: yup
    .string()
    .required('Tenant name is required')
    .min(2, 'Tenant name must be at least 2 characters')
    .max(100, 'Tenant name must not exceed 100 characters')
    .matches(
      /^[a-z0-9-]+$/,
      'Tenant name can only contain lowercase letters, numbers, and hyphens'
    ),
  display_name: yup
    .string()
    .required('Display name is required')
    .min(2, 'Display name must be at least 2 characters')
    .max(100, 'Display name must not exceed 100 characters'),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters'),
  status: yup
    .string()
    .required('Status is required')
    .oneOf(['active', 'inactive', 'suspended'], 'Invalid status'),
  is_public: yup
    .boolean()
    .required('Please specify if tenant is public')
})

export type CreateTenantFormData = yup.InferType<typeof createTenantSchema>
