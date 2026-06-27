/**
 * Identity Provider Form Validation Schema
 * Yup validation schema for identity provider-related forms
 */

import * as yup from 'yup'

const EXTERNAL_PROVIDERS = [
  'cognito',
  'auth0',
  'google',
  'facebook',
  'github',
  'gitlab',
  'microsoft',
  'apple',
  'linkedin',
  'twitter',
]

function activeExternalProvider(provider: unknown, status: unknown): boolean {
  return typeof provider === 'string' && EXTERNAL_PROVIDERS.includes(provider) && status === 'active'
}

function activeTokenFederation(allowTokenFederation: unknown, status: unknown): boolean {
  return allowTokenFederation === true && status === 'active'
}

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
    .oneOf(
      [
        'maintainerd',
        'cognito',
        'auth0',
        'google',
        'facebook',
        'github',
        'gitlab',
        'microsoft',
        'apple',
        'linkedin',
        'twitter',
      ],
      'Invalid provider'
    )
    .required('Provider is required'),
  status: yup
    .string()
    .oneOf(['active', 'inactive'], 'Invalid status')
    .required('Status is required'),
  issuer: yup
    .string()
    .nullable()
    .when(['provider', 'status'], ([provider, status], schema) =>
      activeExternalProvider(provider, status)
        ? schema.required('Issuer URL is required for active external providers').url('Issuer must be a valid URL')
        : schema.notRequired()
    ),
  clientId: yup
    .string()
    .nullable()
    .when(['provider', 'status'], ([provider, status], schema) =>
      activeExternalProvider(provider, status)
        ? schema.required('Client ID is required for active external providers')
        : schema.notRequired()
    ),
  clientSecret: yup.string().nullable(),
  allowJITProvisioning: yup.boolean().default(false),
  allowRegistration: yup.boolean().default(true),
  allowTokenFederation: yup.boolean().default(false),
  allowedAudiences: yup
    .string()
    .nullable()
    .when(['allowTokenFederation', 'status'], ([allowTokenFederation, status], schema) =>
      activeTokenFederation(allowTokenFederation, status)
        ? schema.required('At least one allowed audience is required when token federation is enabled')
        : schema.notRequired()
    ),
  emailDomains: yup.string().nullable(),
})

export type IdentityProviderFormData = yup.InferType<typeof identityProviderSchema>
