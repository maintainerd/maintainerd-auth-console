/**
 * Client Form Validation Schema
 * Yup validation schema for client forms
 */

import * as yup from 'yup'

export const clientSchema = yup.object({
  name: yup
    .string()
    .required('Client name is required')
    .min(3, 'Client name must be at least 3 characters')
    .max(50, 'Client name must not exceed 50 characters')
    .matches(
      /^[a-z0-9\-_]+$/,
      'Client name can only contain lowercase letters, numbers, hyphens, and underscores'
    ),
  displayName: yup
    .string()
    .required('Display name is required')
    .min(8, 'Display name must be at least 8 characters')
    .max(200, 'Display name must not exceed 200 characters'),
  clientType: yup
    .string()
    .required('Client type is required')
    .oneOf(['spa', 'traditional', 'mobile', 'm2m'], 'Invalid client type'),
  domain: yup
    .string()
    .required('Domain is required')
    .min(3, 'Domain must be at least 3 characters')
    .max(100, 'Domain must not exceed 100 characters'),
  status: yup
    .string()
    .required('Status is required')
    .oneOf(['active', 'inactive'], 'Invalid status'),
})

export type ClientFormData = yup.InferType<typeof clientSchema>
