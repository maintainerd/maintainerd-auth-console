/**
 * API Form Validation Schema
 * Yup validation schema for API-related forms
 */

import * as yup from 'yup'

// API Form Schema
export const apiSchema = yup.object({
  name: yup
    .string()
    .required('API name is required')
    .min(2, 'API name must be at least 2 characters')
    .max(100, 'API name must not exceed 100 characters')
    .matches(
      /^[a-z0-9-]+$/,
      'API name must contain only lowercase letters, numbers, and hyphens'
    ),
  displayName: yup
    .string()
    .required('Display name is required')
    .min(2, 'Display name must be at least 2 characters')
    .max(100, 'Display name must not exceed 100 characters'),
  description: yup
    .string()
    .required('API description is required')
    .min(10, 'API description must be at least 10 characters')
    .max(500, 'API description must not exceed 500 characters'),
  apiType: yup
    .string()
    .oneOf(['rest', 'grpc', 'graphql', 'soap', 'webhook', 'websocket', 'rpc'], 'Invalid API type')
    .required('API type is required'),
  status: yup
    .string()
    .oneOf(['active', 'inactive'], 'Invalid status')
    .required('Status is required'),
  serviceId: yup
    .string()
    .required('Service is required')
})

export type ApiFormData = yup.InferType<typeof apiSchema>

