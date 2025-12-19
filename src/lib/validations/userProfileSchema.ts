/**
 * User Profile Form Validation Schema
 * Yup validation schema for user profile forms
 */

import * as yup from 'yup'

// User Profile Form Schema
export const userProfileSchema = yup.object({
  first_name: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(100, 'First name must not exceed 100 characters'),
  middle_name: yup
    .string()
    .optional()
    .max(100, 'Middle name must not exceed 100 characters'),
  last_name: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(100, 'Last name must not exceed 100 characters'),
  suffix: yup
    .string()
    .optional()
    .max(20, 'Suffix must not exceed 20 characters'),
  display_name: yup
    .string()
    .optional()
    .max(200, 'Display name must not exceed 200 characters'),
  birthdate: yup
    .string()
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Birthdate must be in YYYY-MM-DD format',
      excludeEmptyString: true
    }),
  gender: yup
    .string()
    .optional()
    .oneOf(['male', 'female', 'other', ''], 'Invalid gender'),
  bio: yup
    .string()
    .optional()
    .max(500, 'Bio must not exceed 500 characters'),
  phone: yup
    .string()
    .optional()
    .matches(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
      {
        message: 'Invalid phone number format',
        excludeEmptyString: true
      }
    ),
  email: yup
    .string()
    .optional()
    .email('Invalid email address')
    .max(255, 'Email must not exceed 255 characters'),
  address: yup
    .string()
    .optional()
    .max(255, 'Address must not exceed 255 characters'),
  city: yup
    .string()
    .optional()
    .max(100, 'City must not exceed 100 characters'),
  country: yup
    .string()
    .optional()
    .max(2, 'Country code must be 2 characters'),
  timezone: yup
    .string()
    .optional()
    .max(100, 'Timezone must not exceed 100 characters'),
  language: yup
    .string()
    .optional()
    .max(10, 'Language code must not exceed 10 characters'),
  profile_url: yup
    .string()
    .optional()
    .url('Invalid URL format')
    .max(255, 'Profile URL must not exceed 255 characters'),
})

export type UserProfileFormData = {
  first_name: string
  middle_name: string | undefined
  last_name: string
  suffix: string | undefined
  display_name: string | undefined
  birthdate: string | undefined
  gender: string | undefined
  bio: string | undefined
  phone: string | undefined
  email: string | undefined
  address: string | undefined
  city: string | undefined
  country: string | undefined
  timezone: string | undefined
  language: string | undefined
  profile_url: string | undefined
}
