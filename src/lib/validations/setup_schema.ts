/**
 * Setup Form Validation Schemas
 * Yup validation schemas for setup-related forms
 */

import * as yup from 'yup'

// Setup Tenant Form Schema
export const setupTenantSchema = yup.object({
  name: yup
    .string()
    .required('Tenant name is required')
    .min(2, 'Tenant name must be at least 2 characters')
    .max(100, 'Tenant name must not exceed 100 characters')
    .matches(
      /^[a-zA-Z0-9\s\-_&.()]+$/,
      'Tenant name can only contain letters, numbers, spaces, and common punctuation'
    ),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters')
})

// Setup Admin Form Schema
export const setupAdminSchema = yup.object({
  fullname: yup
    .string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters')
    .matches(
      /^[a-zA-Z\s\-'.]+$/,
      'Full name can only contain letters, spaces, hyphens, apostrophes, and periods'
    ),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must not exceed 255 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match')
})

// Setup Profile Form Schema - Step 1: Personal Information
export const setupProfilePersonalSchema = yup.object().shape({
  first_name: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s\-'.]+$/, 'First name can only contain letters, spaces, hyphens, apostrophes, and periods'),
  middle_name: yup
    .string()
    .nullable()
    .default(undefined)
    .transform((value) => {
      if (!value || value.trim() === '') return undefined
      return value.trim()
    })
    .max(50, 'Middle name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s\-'.]*$/, 'Middle name can only contain letters, spaces, hyphens, apostrophes, and periods'),
  last_name: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s\-'.]+$/, 'Last name can only contain letters, spaces, hyphens, apostrophes, and periods'),
  suffix: yup
    .string()
    .nullable()
    .default(undefined)
    .transform((value) => {
      if (!value || value.trim() === '') return undefined
      return value.trim()
    })
    .max(10, 'Suffix must not exceed 10 characters')
    .matches(/^[a-zA-Z.]*$/, 'Suffix can only contain letters and periods'),
  display_name: yup
    .string()
    .required('Display name is required')
    .min(2, 'Display name must be at least 2 characters')
    .max(100, 'Display name must not exceed 100 characters'),
  bio: yup
    .string()
    .nullable()
    .default(undefined)
    .transform((value) => {
      if (!value || value.trim() === '') return undefined
      return value.trim()
    })
    .max(500, 'Bio must not exceed 500 characters'),
  birthdate: yup
    .string()
    .nullable()
    .default(undefined)
    .transform((value) => {
      if (!value || value.trim() === '') return undefined
      return value.trim()
    })
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date (YYYY-MM-DD)'),
  gender: yup
    .string()
    .nullable()
    .default(undefined)
    .transform((value) => {
      if (!value || value.trim() === '') return undefined
      return value.trim()
    })
    .oneOf(['male', 'female', 'other', 'prefer_not_to_say'], 'Please select a valid gender option')
})

// Setup Profile Form Schema - Step 2: Contact Information
export const setupProfileContactSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must not exceed 255 characters'),
  phone: yup
    .string()
    .nullable()
    .default(undefined)
    .transform((value) => {
      if (!value || value.trim() === '') return undefined
      return value.trim()
    })
    .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
})

// Setup Profile Form Schema - Step 3: Location & Preferences
export const setupProfileLocationSchema = yup.object().shape({
  address: yup
    .string()
    .nullable()
    .default(undefined)
    .transform((value) => {
      if (!value || value.trim() === '') return undefined
      return value.trim()
    })
    .max(255, 'Address must not exceed 255 characters'),
  city: yup
    .string()
    .nullable()
    .default(undefined)
    .transform((value) => {
      if (!value || value.trim() === '') return undefined
      return value.trim()
    })
    .max(100, 'City must not exceed 100 characters')
    .matches(/^[a-zA-Z\s\-'.]*$/, 'City can only contain letters, spaces, hyphens, apostrophes, and periods'),
  country: yup
    .string()
    .nullable()
    .default(undefined)
    .transform((value) => {
      if (!value || value.trim() === '') return undefined
      return value.trim()
    })
    .length(2, 'Country must be a 2-letter country code')
    .matches(/^[A-Z]{2}$/, 'Country must be a valid 2-letter country code'),
  timezone: yup
    .string()
    .nullable()
    .default(undefined)
    .transform((value) => {
      if (!value || value.trim() === '') return undefined
      return value.trim()
    })
    .max(50, 'Timezone must not exceed 50 characters'),
  language: yup
    .string()
    .nullable()
    .default(undefined)
    .transform((value) => {
      if (!value || value.trim() === '') return undefined
      return value.trim()
    })
    .matches(/^[a-z]{2}(-[A-Z]{2})?$/, 'Language must be in format "en" or "en-US"')
})

// Setup Profile Form Schema - Step 4: Profile Picture
export const setupProfilePictureSchema = yup.object().shape({
  profile_url: yup
    .string()
    .nullable()
    .default(undefined)
    .transform((value) => {
      if (!value || value.trim() === '') return undefined
      return value.trim()
    })
    .url('Please enter a valid URL')
})

// Combined schema for complete profile
export const setupProfileCompleteSchema = yup.object({
  ...setupProfilePersonalSchema.fields,
  ...setupProfileContactSchema.fields,
  ...setupProfileLocationSchema.fields,
  ...setupProfilePictureSchema.fields
})

// Type inference from schemas
export type SetupTenantFormData = yup.InferType<typeof setupTenantSchema>
export type SetupAdminFormData = yup.InferType<typeof setupAdminSchema>

// Explicit type definitions for profile forms to avoid Yup inference issues
export type SetupProfilePersonalFormData = {
  first_name: string
  middle_name?: string
  last_name: string
  suffix?: string
  display_name: string
  bio?: string
}

export type SetupProfileContactFormData = {
  email: string
  phone?: string
  birthdate?: string
  gender?: string
}

export type SetupProfileLocationFormData = {
  address?: string
  city?: string
  country?: string
  timezone?: string
  language?: string
}

export type SetupProfilePictureFormData = {
  profile_url?: string
}

export type SetupProfileCompleteFormData = SetupProfilePersonalFormData &
  SetupProfileContactFormData &
  SetupProfileLocationFormData &
  SetupProfilePictureFormData
