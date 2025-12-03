/**
 * Identity Provider Form Validation Schema
 * Yup validation schema for identity provider-related forms
 */

import * as yup from 'yup'

// Identity Provider Form Schema
export const identityProviderSchema = yup.object({
  name: yup
    .string()
    .required('Provider name is required')
    .min(2, 'Provider name must be at least 2 characters')
    .max(50, 'Provider name must not exceed 50 characters')
    .matches(
      /^[a-z0-9-]+$/,
      'Provider name must contain only lowercase letters, numbers, and hyphens'
    )
    .test(
      'no-leading-trailing-hyphen',
      'Provider name cannot start or end with a hyphen',
      (value) => {
        if (!value) return true
        return !value.startsWith('-') && !value.endsWith('-')
      }
    ),
  displayName: yup
    .string()
    .required('Display name is required')
    .min(2, 'Display name must be at least 2 characters')
    .max(100, 'Display name must not exceed 100 characters'),
  provider: yup
    .string()
    .oneOf(['internal', 'cognito', 'auth0'], 'Invalid provider')
    .required('Provider is required'),
  status: yup
    .string()
    .oneOf(['active', 'inactive'], 'Invalid status')
    .required('Status is required'),
})

export type IdentityProviderFormData = yup.InferType<typeof identityProviderSchema>

