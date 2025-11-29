/**
 * Service Form Validation Schema
 * Yup validation schema for service-related forms
 */

import * as yup from 'yup'

// Service Form Schema
export const serviceSchema = yup.object({
  name: yup
    .string()
    .required('Service name is required')
    .min(2, 'Service name must be at least 2 characters')
    .max(100, 'Service name must not exceed 100 characters')
    .matches(
      /^[a-z0-9-]+$/,
      'Service name must contain only lowercase letters, numbers, and hyphens'
    ),
  displayName: yup
    .string()
    .required('Display name is required')
    .min(2, 'Display name must be at least 2 characters')
    .max(100, 'Display name must not exceed 100 characters'),
  description: yup
    .string()
    .required('Service description is required')
    .min(10, 'Service description must be at least 10 characters')
    .max(500, 'Service description must not exceed 500 characters'),
  version: yup
    .string()
    .required('Version is required')
    .max(50, 'Version must not exceed 50 characters'),
  status: yup
    .string()
    .oneOf(['active', 'maintenance', 'deprecated', 'inactive'], 'Invalid status')
    .required('Status is required'),
  isPublic: yup
    .boolean()
    .default(false)
})

export type ServiceFormData = yup.InferType<typeof serviceSchema>

