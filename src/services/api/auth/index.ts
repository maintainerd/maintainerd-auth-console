/**
 * Authentication Service
 * Handles authentication API calls and storage operations
 */

import { post, get } from '../client'
import { API_ENDPOINTS } from '../config'
import { authStorage } from '../../storage/auth'
import type { AuthUserType, ProfileResponseInterface } from '@/types'
import type { LoginRequest, LoginResponse, LogoutResponse, RegisterRequest, RegisterResponse, CreateProfileRequest, CreateProfileResponse } from './types'

/**
 * Login user with credentials
 * @param username - User's email/username
 * @param password - User's password
 * @returns Promise<LoginResponse>
 */
export async function login(username: string, password: string): Promise<LoginResponse> {
  try {
    const loginData: LoginRequest = { username, password }
    const response = await post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      loginData,
      {
        headers: {
          'X-Token-Delivery': 'cookie'
        }
      }
    )

    if (response.success) {
      // Fetch and store profile after successful login
      // This may return null if profile doesn't exist (newly registered user)
      await fetchAndStoreProfile()
    }

    return response
  } catch (error) {
    throw error
  }
}

/**
 * Register a new user
 * @param fullname - User's full name
 * @param email - User's email address (used as username)
 * @param password - User's password
 * @param phone - User's phone number (optional)
 * @param clientId - Optional client ID for specific client registration
 * @param providerId - Optional provider ID for specific provider registration
 * @returns Promise<RegisterResponse>
 */
export async function register(
  fullname: string,
  email: string,
  password: string,
  phone?: string,
  clientId?: string,
  providerId?: string
): Promise<RegisterResponse> {
  try {
    const registerData: RegisterRequest = {
      username: email, // Use email as username
      fullname,
      email,
      phone: phone || '', // Keep blank if not provided
      password
    }

    // Build endpoint URL with query parameters if provided
    let endpoint = API_ENDPOINTS.AUTH.REGISTER
    const queryParams = new URLSearchParams()

    if (clientId) {
      queryParams.append('client_id', clientId)
    }

    if (providerId) {
      queryParams.append('provider_id', providerId)
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
  } catch (error) {
    throw error
  }
}

/**
 * Logout user
 * @returns Promise<LogoutResponse>
 */
export async function logout(): Promise<LogoutResponse> {
  try {
    const response = await post<LogoutResponse>(API_ENDPOINTS.AUTH.LOGOUT, {})
    
    // Clear stored profile regardless of API response
    authStorage.clearProfile()
    
    return response
  } catch (error) {
    // Clear profile even if logout API fails
    authStorage.clearProfile()
    throw error
  }
}

/**
 * Fetch user profile from API and store it
 * @returns Promise<AuthUserType | null> - Returns null if profile doesn't exist (e.g., newly registered user)
 */
export async function fetchAndStoreProfile(): Promise<AuthUserType | null> {
  try {
    const response = await get<ProfileResponseInterface>(API_ENDPOINTS.AUTH.PROFILE)

    if (response.success && response.data) {
      // Store profile in localStorage
      authStorage.setProfile(response.data)
      return response.data
    }

    // Profile doesn't exist or is incomplete - this is expected for newly registered users
    return null
  } catch (error) {
    // Network error or other issues - return null to indicate no profile
    return null
  }
}

/**
 * Get stored user profile
 * @returns AuthUserType or null if not found
 */
export function getUserProfile(): AuthUserType | null {
  return authStorage.getProfile()
}

/**
 * Clear stored user profile
 */
export function clearProfile(): void {
  authStorage.clearProfile()
}

/**
 * Create user profile for authenticated users (requires cookie token)
 * @param data - Profile creation data
 * @returns Promise<CreateProfileResponse>
 */
export async function createUserProfile(data: CreateProfileRequest): Promise<CreateProfileResponse> {
  try {
    const response = await post<CreateProfileResponse>(
      API_ENDPOINTS.AUTH.PROFILE,
      data
    )

    if (response.success && response.data) {
      // Store the new profile in localStorage
      authStorage.setProfile(response.data)
    }

    return response
  } catch (error) {
    throw error
  }
}

/**
 * Create profile for registered users (dedicated register flow)
 * @param data - Profile creation data
 * @returns Promise<CreateProfileResponse>
 */
export async function createRegisterProfile(data: CreateProfileRequest): Promise<CreateProfileResponse> {
  try {
    const response = await post<CreateProfileResponse>(
      API_ENDPOINTS.AUTH.PROFILE,
      data
    )

    if (response.success && response.data) {
      // Store the new profile in localStorage
      authStorage.setProfile(response.data)
    }

    return response
  } catch (error) {
    throw error
  }
}

/**
 * Check if user is authenticated (has profile stored)
 * Note: This only checks localStorage cache, not backend validity
 * Use validateAuthentication() for backend validation
 * @returns True if user has profile cached locally
 */
export function isAuthenticated(): boolean {
  return authStorage.hasProfile()
}

/**
 * Validate if the user is still authenticated with the backend
 * This checks if the backend cookie is still valid by calling the profile endpoint
 * @returns Promise<boolean> - True if still authenticated
 */
export async function validateAuthentication(): Promise<boolean> {
  try {
    // Always try to fetch profile from backend to validate cookie
    // Don't check localStorage first - the backend is the source of truth
    const response = await get<ProfileResponseInterface>(API_ENDPOINTS.AUTH.PROFILE)

    if (response.success && response.data) {
      // Update stored profile with fresh data from backend
      authStorage.setProfile(response.data)
      return true
    }

    // Backend says not authenticated, clear local profile
    clearProfile()
    return false
  } catch (error) {
    // Network error or backend rejection, clear local profile
    clearProfile()
    return false
  }
}

// Export functions as an object for backward compatibility
export const authService = {
  login,
  register,
  logout,
  fetchAndStoreProfile,
  getUserProfile,
  clearProfile,
  createUserProfile,
  createRegisterProfile,
  isAuthenticated,
  validateAuthentication
}
