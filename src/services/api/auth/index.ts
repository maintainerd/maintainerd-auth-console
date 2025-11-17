/**
 * Authentication Service
 * Handles authentication API calls and storage operations
 */

import { post, get } from '../client'
import { API_ENDPOINTS } from '../config'
import type { AuthUserType, ProfileResponseInterface } from '@/types'
import type { LoginRequest, LoginResponse, LogoutResponse, RegisterRequest, RegisterResponse, CreateProfileRequest, CreateProfileResponse } from './types'

/**
 * Login user with credentials
 * @param username - User's email/username
 * @param password - User's password
 * @returns Promise<LoginResponse>
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
	const response = await post<LoginResponse>(
		API_ENDPOINTS.AUTH.LOGIN,
		data,
		{
			headers: {
				'X-Token-Delivery': 'cookie'
			}
		}
	)
	return response
}

// Extended register request with optional query parameters
export interface RegisterServiceRequest extends Omit<RegisterRequest, 'username'> {
  clientId?: string
  providerId?: string
}

/**
 * Register a new user
 * @param data - Registration data including fullname, email, password, and optional fields
 * @returns Promise<RegisterResponse>
 */
export async function register(data: RegisterServiceRequest): Promise<RegisterResponse> {
  const registerData: RegisterRequest = {
    username: data.email,
    fullname: data.fullname,
    email: data.email,
    phone: data.phone || '',
    password: data.password
  }

  // Build endpoint URL with query parameters if provided
  let endpoint = API_ENDPOINTS.AUTH.REGISTER
  const queryParams = new URLSearchParams()

  if (data.clientId) {
    queryParams.append('client_id', data.clientId)
  }

  if (data.providerId) {
    queryParams.append('provider_id', data.providerId)
  }

  if (queryParams.toString()) {
    endpoint += `?${queryParams.toString()}`
  }

  const response = await post<RegisterResponse>(
    endpoint,
    registerData,
    {
      headers: {
        'X-Token-Delivery': 'cookie'
      }
    }
  )
  return response
}

/**
 * Logout user
 * @returns Promise<LogoutResponse>
 */
export async function logout(): Promise<LogoutResponse> {
  const response = await post<LogoutResponse>(API_ENDPOINTS.AUTH.LOGOUT, {})
  return response
}

/**
 * Fetch user profile from API
 * @returns Promise<AuthUserType | null> - Returns null if profile doesn't exist (e.g., newly registered user)
 */
export async function fetchProfile(): Promise<AuthUserType | null> {
  try {
    const response = await get<ProfileResponseInterface>(API_ENDPOINTS.AUTH.PROFILE)

    if (response.success && response.data) {
      return response.data
    }

    return null
  } catch (error) {
    return null
  }
}

/**
 * Create user profile for authenticated users (requires cookie token)
 * @param data - Profile creation data
 * @returns Promise<CreateProfileResponse>
 */
export async function createUserProfile(data: CreateProfileRequest): Promise<CreateProfileResponse> {
  const response = await post<CreateProfileResponse>(
    API_ENDPOINTS.AUTH.PROFILE,
    data
  )
  return response
}

/**
 * Create profile for registered users (dedicated register flow)
 * @param data - Profile creation data
 * @returns Promise<CreateProfileResponse>
 */
export async function createRegisterProfile(data: CreateProfileRequest): Promise<CreateProfileResponse> {
  const response = await post<CreateProfileResponse>(
    API_ENDPOINTS.AUTH.PROFILE,
    data
  )
  return response
}

/**
 * Validate if the user is still authenticated with the backend
 * This checks if the backend cookie is still valid by calling the profile endpoint
 * @returns Promise<AuthUserType | null> - Returns profile if authenticated, null otherwise
 */
export async function validateAuthentication(): Promise<AuthUserType | null> {
  try {
    const response = await get<ProfileResponseInterface>(API_ENDPOINTS.AUTH.PROFILE)

    if (response.success && response.data) {
      return response.data
    }

    return null
  } catch (error) {
    return null
  }
}

// Export functions as an object for backward compatibility
export const authService = {
  login,
  register,
  logout,
  fetchProfile,
  createUserProfile,
  createRegisterProfile,
  validateAuthentication
}
