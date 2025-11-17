/**
 * Authentication API Types
 * Type definitions for authentication-related API requests and responses
 */

import type { ApiResponse } from '../types/common'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse extends ApiResponse<{
  access_token: string
  id_token: string
  refresh_token: string
  expires_in: number
  token_type: string
  issued_at: number
}> {}

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface RefreshTokenResponse extends ApiResponse<{
  access_token: string
  expires_in: number
  token_type: string
  issued_at: number
}> {}

export interface LogoutRequest {
  refresh_token?: string
}

export interface LogoutResponse extends ApiResponse {}

export interface RegisterRequest {
  username: string
  fullname: string
  email: string
  phone?: string
  password: string
}

export interface RegisterResponse extends ApiResponse<{
  user_id: string
  username: string
  email: string
  fullname: string
  phone?: string
  created_at: string
}> {}

export interface ProfileResponse extends ApiResponse<any> {}

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse extends ApiResponse {}

export interface ResetPasswordRequest {
  new_password: string
}

export interface ResetPasswordQueryParams {
  client_id: string
  expires: string
  provider_id: string
  sig: string
  token: string
}

export interface ResetPasswordResponse extends ApiResponse {}

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

export interface CreateProfileResponse extends ApiResponse<{
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
}> {}
