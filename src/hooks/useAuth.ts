/**
 * Authentication Hook
 * Custom hook that uses Redux for auth state management
 */

import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useToast } from '@/hooks/useToast'
import type { AuthUserType } from '@/types'
import {
  loginAsync,
  registerAsync,
  logoutAsync,
  validateAuthAsync,
  initializeAuthAsync,
  fetchProfileAsync
} from '@/store/auth/actions'
import {
  clearError,
  setProfile
} from '@/store/auth/reducers'
import { clearTenant } from '@/store/tenant/reducers'

export function useAuth() {
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const { showError, showSuccess } = useToast()
  const { profile, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth)

  const login = useCallback(async (email: string, password: string) => {
    try {
      const result = await dispatch(loginAsync({ email, password })).unwrap()

      // Check if profile exists and has required fields
      const userProfile = result.user
      if (!userProfile || !userProfile.first_name || !userProfile.last_name) {
        // Profile is incomplete or doesn't exist, redirect to profile setup
        return { success: true, profile: userProfile, requiresProfileSetup: true }
      }

      return { success: true, profile: userProfile, requiresProfileSetup: false }
    } catch (error: any) {
      return { success: false, message: error.message }
    }
  }, [dispatch])

  const register = useCallback(async (
    fullname: string,
    email: string,
    password: string,
    phone?: string
  ) => {
    try {
      // Get client_id and provider_id from URL query parameters
      const clientId = searchParams.get('client_id')
      const providerId = searchParams.get('provider_id')

      const result = await dispatch(registerAsync({
        fullname,
        email,
        password,
        phone,
        clientId: clientId || undefined,
        providerId: providerId || undefined
      })).unwrap()

      if (result.success) {
        showSuccess('Account created successfully! Please complete your profile.')
        return { success: true, data: result.data }
      } else {
        return { success: false, message: 'Registration failed' }
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'An unexpected error occurred'
      showError(errorMessage, 'Registration failed')
      return { success: false, message: errorMessage }
    }
  }, [dispatch, searchParams, showError, showSuccess])

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutAsync()).unwrap()
      dispatch(clearTenant())
    } catch (error) {
      showError('Logout failed')
      // Even if API fails, clear Redux state
      dispatch(clearTenant())
      throw error
    }
  }, [dispatch, showError])

  const checkAuth = useCallback(async () => {
    try {
      await dispatch(validateAuthAsync()).unwrap()
      return true
    } catch (error) {
      // Silent failure for auth check - don't show error toast
      return false
    }
  }, [dispatch])

  const initializeAuth = useCallback(async () => {
    try {
      await dispatch(initializeAuthAsync()).unwrap()
    } catch (error) {
      // Silent failure for auth initialization - don't show error toast
    }
  }, [dispatch])

  const clearAuthError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  const getProfile = useCallback(() => {
    return profile
  }, [profile])

  const fetchProfile = useCallback(async () => {
    try {
      const result = await dispatch(fetchProfileAsync()).unwrap()
      return result
    } catch (error) {
      // Silent failure - profile might not exist yet
      return null
    }
  }, [dispatch])

  const updateProfile = useCallback((profileData: AuthUserType | null) => {
    dispatch(setProfile(profileData))
  }, [dispatch])

  return {
    // State
    profile,
    isAuthenticated,
    isLoading,
    error,
    // Actions
    login,
    register,
    logout,
    checkAuth,
    initializeAuth,
    clearAuthError,
    getProfile,
    fetchProfile,
    updateProfile
  }
}
