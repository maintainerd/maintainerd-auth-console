/**
 * Authentication API Types
 * Type definitions for authentication-related API requests and responses
 */

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  success: boolean
  data: {
    access_token: string
    id_token: string
    refresh_token: string
    expires_in: number
    token_type: string
    issued_at: number
  }
  message: string
}

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface RefreshTokenResponse {
  success: boolean
  data: {
    access_token: string
    expires_in: number
    token_type: string
    issued_at: number
  }
  message: string
}

export interface LogoutRequest {
  refresh_token?: string
}

export interface LogoutResponse {
  success: boolean
  message: string
}

export interface RegisterRequest {
  username: string
  fullname: string
  email: string
  phone?: string
  password: string
}

export interface RegisterResponse {
  success: boolean
  data?: {
    user_id: string
    username: string
    email: string
    fullname: string
    phone?: string
    created_at: string
  }
  message: string
}

export interface ProfileResponse {
  success: boolean
  data?: any
  message?: string
}

// Profile creation types for authenticated users (using /profiles endpoint)
export interface CreateProfileRequest {
  first_name: string
  last_name: string
  display_name: string
  bio?: string
  birthdate?: string
  gender?: string
  phone?: string
  email: string
  address?: string
  city?: string
  country?: string
  timezone?: string
  language?: string
}

export interface CreateProfileResponse {
  success: boolean
  data?: {
    profile_id: string
    first_name: string
    last_name: string
    display_name: string
    bio?: string
    birthdate?: string
    gender?: string
    phone?: string
    email: string
    address?: string
    city?: string
    country?: string
    timezone?: string
    language?: string
    created_at: string
    updated_at: string
  }
  message: string
}
