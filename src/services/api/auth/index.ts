/**
 * Authentication Service
 * Handles authentication API calls and storage operations
 */

import { post, get } from '../client'
import { API_ENDPOINTS } from '../config'
import { authStorage } from '../../storage/auth'
import type { AuthUserType, ProfileResponseInterface } from '@/types'
import type { LoginRequest, LoginResponse, LogoutResponse } from './types'

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
      await fetchAndStoreProfile()
    }

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
 * @returns Promise<AuthUserType>
 */
export async function fetchAndStoreProfile(): Promise<AuthUserType> {
  try {
    const response = await get<ProfileResponseInterface>(API_ENDPOINTS.AUTH.PROFILE)

    if (response.success && response.data) {
      // Store profile in localStorage
      authStorage.setProfile(response.data)
      return response.data
    }

    throw new Error('Failed to fetch profile')
  } catch (error) {
    throw error
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
 * Check if user is authenticated (has profile stored)
 * @returns True if user has valid authentication
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
    // If no profile stored locally, definitely not authenticated
    if (!getUserProfile()) {
      return false
    }

    // Try to fetch profile from backend to validate cookie
    const response = await get<ProfileResponseInterface>(API_ENDPOINTS.AUTH.PROFILE)

    if (response.success && response.data) {
      // Update stored profile with fresh data
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
  logout,
  fetchAndStoreProfile,
  getUserProfile,
  clearProfile,
  isAuthenticated,
  validateAuthentication
}
