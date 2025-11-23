/**
 * Authentication API Types
 * Type definitions for authentication-related API requests and responses
 */

import type { ApiResponse } from '../types/common'

/**
 * Profile entity from API
 */
export interface ProfileEntity {
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

export interface LoginRequest {
  username: string
  password: string
}

export type LoginResponse = ApiResponse<{
  access_token: string
  id_token: string
  refresh_token: string
  expires_in: number
  token_type: string
  issued_at: number
}>

export interface RefreshTokenRequest {
  refresh_token: string
}

export type RefreshTokenResponse = ApiResponse<{
  access_token: string
  expires_in: number
  token_type: string
  issued_at: number
}>

export interface LogoutRequest {
  refresh_token?: string
}

export type LogoutResponse = ApiResponse

export interface RegisterRequest {
  username: string
  fullname: string
  email: string
  phone?: string
  password: string
}

export type RegisterResponse = ApiResponse<{
  user_id: string
  username: string
  email: string
  fullname: string
  phone?: string
  created_at: string
}>

export type ProfileResponse = ApiResponse<ProfileEntity>

export interface ForgotPasswordRequest {
  email: string
}

export type ForgotPasswordResponse = ApiResponse

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

export type ResetPasswordResponse = ApiResponse

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

export type CreateProfileResponse = ApiResponse<ProfileEntity>
