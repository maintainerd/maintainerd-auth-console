/**
 * Auth Store Types
 * Redux-specific types for auth state management
 */

import type { ProfileEntity } from '@/services/api/auth/types'

export interface AuthStateInterface {
  profile: ProfileEntity | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitialized: boolean
  error: string | null
}

export interface LoginAsyncResponseType {
  success: boolean
  user: ProfileEntity
}
