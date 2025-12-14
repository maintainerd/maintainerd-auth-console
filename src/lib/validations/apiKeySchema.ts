/**
 * API Key Form Validation Schema
 * Yup validation schema for API key-related forms
 */

import * as yup from 'yup'

// API Key Form Schema
export const apiKeySchema = yup.object({
  name: yup
    .string()
    .required('API key name is required')
    .min(2, 'API key name must be at least 2 characters')
    .max(100, 'API key name must not exceed 100 characters')
    .matches(
      /^[a-z0-9-]+$/,
      'API key name must contain only lowercase letters, numbers, and hyphens'
    ),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters'),
  expiresAt: yup
    .string()
    .nullable()
    .notRequired()
    .test('future-date', 'Expiration date must be in the future', function(value) {
      if (!value) return true // Allow null/empty for "never expires"
      const expirationDate = new Date(value)
      const now = new Date()
      return expirationDate > now
    }),
  rateLimit: yup
    .number()
    .required('Rate limit is required')
    .min(1, 'Rate limit must be at least 1')
    .max(1000000, 'Rate limit must not exceed 1,000,000'),
  status: yup
    .string()
    .oneOf(['active', 'inactive', 'expired'], 'Invalid status')
    .required('Status is required'),
})

export type ApiKeyFormData = {
  name: string
  description: string
  expiresAt?: string | null
  rateLimit: number
  status: 'active' | 'inactive' | 'expired'
}

