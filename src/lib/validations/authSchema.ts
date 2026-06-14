/**
 * Authentication Form Validation Schemas
 * Yup validation schemas for authentication-related forms
 */

import * as yup from 'yup'
import type { PasswordConfigPublic } from '@/services/api/tenants/types'

export function buildPasswordValidation(cfg?: PasswordConfigPublic) {
  let schema = yup.string().required('Password is required')

  const minLen = cfg?.min_length ?? 12
  const maxLen = cfg?.max_length ?? 128
  schema = schema.min(minLen, `Password must be at least ${minLen} characters`)
  if (maxLen > 0) {
    schema = schema.max(maxLen, `Password must not exceed ${maxLen} characters`)
  }
  if (cfg?.require_uppercase) {
    schema = schema.matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
  }
  if (cfg?.require_lowercase) {
    schema = schema.matches(/[a-z]/, 'Password must contain at least one lowercase letter')
  }
  if (cfg?.require_number) {
    schema = schema.matches(/[0-9]/, 'Password must contain at least one digit')
  }
  if (cfg?.require_symbol) {
    schema = schema.matches(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, 'Password must contain at least one special character')
  }
  return schema
}

export function buildLoginSchema(cfg?: PasswordConfigPublic) {
  return yup.object({
    email: yup
      .string()
      .required('Email is required')
      .email('Please enter a valid email address')
      .max(255, 'Email must not exceed 255 characters'),
    password: buildPasswordValidation(cfg),
  })
}

export interface LoginFormData {
  email: string
  password: string
}

// Register Form Schema (config-driven)
// Mirrors buildLoginSchema: the password rules come from the tenant's
// password_config so registration enforces the same policy the backend does.
export function buildRegisterSchema(cfg?: PasswordConfigPublic) {
  return yup.object({
    email: yup
      .string()
      .required('Email is required')
      .email('Please enter a valid email address')
      .max(255, 'Email must not exceed 255 characters'),
    password: buildPasswordValidation(cfg),
    confirmPassword: yup
      .string()
      .required('Please confirm your password')
      .oneOf([yup.ref('password')], 'Passwords must match'),
  })
}

// Register Form Schema (static fallback — kept for back-compat / typing)
export const registerSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must not exceed 255 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number, and special character'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match')
})

export type RegisterFormData = yup.InferType<typeof registerSchema>

// Forgot Password Form Schema
export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must not exceed 255 characters')
})

export type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>

// Reset Password Form Schema
export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number, and special character'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match')
})

export type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>
