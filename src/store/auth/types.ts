/**
 * Auth Store Types
 * Redux-specific types for auth state management
 */

import type { AuthUserType } from '@/types'

export interface AuthStateInterface {
  profile: AuthUserType | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitialized: boolean
  error: string | null
}

export interface LoginAsyncResponseType {
  success: boolean
  user: AuthUserType
}
