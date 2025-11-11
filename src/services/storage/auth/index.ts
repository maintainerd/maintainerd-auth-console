/**
 * Authentication Storage
 * Handles localStorage operations for authentication data
 */

import { localStorageAdapter } from '../adapters'
import type { AuthUserType } from '@/types'

// Storage keys constants
export const AUTH_STORAGE_KEYS = {
  PROFILE: 'm9d.auth.profile',
} as const

/**
 * Authentication storage operations
 */
export const authStorage = {
  /**
   * Get stored user profile
   * @returns AuthUserType or null if not found
   */
  getProfile(): AuthUserType | null {
    return localStorageAdapter.get<AuthUserType>(AUTH_STORAGE_KEYS.PROFILE)
  },

  /**
   * Store user profile
   * @param profile - User profile to store
   */
  setProfile(profile: AuthUserType): void {
    localStorageAdapter.set(AUTH_STORAGE_KEYS.PROFILE, profile)
  },

  /**
   * Clear stored user profile
   */
  clearProfile(): void {
    localStorageAdapter.remove(AUTH_STORAGE_KEYS.PROFILE)
  },

  /**
   * Check if user profile exists in storage
   * @returns True if profile exists
   */
  hasProfile(): boolean {
    return localStorageAdapter.has(AUTH_STORAGE_KEYS.PROFILE)
  }
}
