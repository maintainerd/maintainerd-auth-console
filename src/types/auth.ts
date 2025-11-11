/**
 * Global Auth Types
 * Shared authentication types used across the application
 */

export interface AuthUserType {
  profile_uuid: string
  first_name: string
  last_name: string
  display_name: string
  bio: string
  birthdate: string
  gender: string
  phone: string
  email: string
  address: string
  city: string
  country: string
  timezone: string
  language: string
  created_at: string
  updated_at: string
}

export interface LoginCredentialsInterface {
  email: string
  password: string
}

export interface LoginResponseInterface {
  success: boolean
  message?: string
  user?: AuthUserType
}

export interface AuthValidationResponseInterface {
  valid: boolean
  user?: AuthUserType
}

export interface ProfileResponseInterface {
  success: boolean
  data: AuthUserType
  message: string
}
