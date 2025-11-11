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

export interface ProfileResponse {
  success: boolean
  data?: any
  message?: string
}
