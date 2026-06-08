/**
 * User Profile Form Validation Schema
 *
 * Mirrors the backend `ProfileRequestDTO` validation (internal/user/validation_profile.go):
 * only `first_name` is required; every other field is optional but, when present,
 * must satisfy the same length / format / enum rules. Empty inputs are normalised
 * to `undefined` so we never send empty strings (the backend uses NilOrNotEmpty).
 */

import * as yup from 'yup'

export const GENDER_VALUES = ['male', 'female', 'other', 'prefer_not_to_say'] as const

// An optional, trimmed string that becomes `undefined` when blank.
const optionalString = () =>
  yup
    .string()
    .transform((value: unknown) => {
      if (typeof value !== 'string') return undefined
      const trimmed = value.trim()
      return trimmed === '' ? undefined : trimmed
    })
    .optional()

export const userProfileSchema = yup.object({
  first_name: yup
    .string()
    .transform((value: unknown) => (typeof value === 'string' ? value.trim() : value))
    .required('First name is required')
    .max(100, 'First name must be at most 100 characters'),
  middle_name: optionalString().max(100, 'Middle name must be at most 100 characters'),
  last_name: optionalString().max(100, 'Last name must be at most 100 characters'),
  suffix: optionalString().max(50, 'Suffix must be at most 50 characters'),
  display_name: optionalString().max(100, 'Display name must be at most 100 characters'),
  birthdate: optionalString().matches(/^\d{4}-\d{2}-\d{2}$/, 'Birthdate must be in YYYY-MM-DD format'),
  gender: optionalString().oneOf(GENDER_VALUES as unknown as string[], 'Invalid gender'),
  bio: optionalString().max(1000, 'Bio must be at most 1000 characters'),
  phone: optionalString().max(20, 'Phone must be at most 20 characters'),
  email: optionalString().email('Invalid email address').max(255, 'Email must be at most 255 characters'),
  address: optionalString().max(500, 'Address must be at most 500 characters'),
  city: optionalString().max(100, 'City must be at most 100 characters'),
  country: yup
    .string()
    .transform((value: unknown) => {
      if (typeof value !== 'string') return undefined
      const trimmed = value.trim()
      return trimmed === '' ? undefined : trimmed.toUpperCase()
    })
    .optional()
    .length(2, 'Country must be a 2-letter ISO code (e.g., US)'),
  timezone: optionalString().max(50, 'Timezone must be at most 50 characters'),
  language: optionalString().max(10, 'Language must be at most 10 characters'),
  profile_url: optionalString()
    .test('is-http-url', 'Enter a valid URL starting with http:// or https://', (value) => {
      if (!value) return true
      try {
        const url = new URL(value)
        return url.protocol === 'http:' || url.protocol === 'https:'
      } catch {
        return false
      }
    })
    .max(1000, 'Profile URL must be at most 1000 characters'),
})

export type UserProfileFormData = yup.InferType<typeof userProfileSchema>
