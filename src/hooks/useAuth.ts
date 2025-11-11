/**
 * Authentication Hook
 * Custom hook that uses Redux for auth state management
 */

import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useToast } from '@/hooks/useToast'
import type { AuthUserType } from '@/types'
import {
  loginAsync,
  logoutAsync,
  validateAuthAsync,
  initializeAuthAsync,
  fetchProfileAsync,
  clearError,
  setProfile
} from '@/store/auth/reducers'
import { clearTenant } from '@/store/tenant/reducers'

export function useAuth() {
  const dispatch = useAppDispatch()
  const { showError } = useToast()
  const { profile, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth)

  const login = useCallback(async (email: string, password: string) => {
    try {
      const result = await dispatch(loginAsync({ email, password })).unwrap()
      return { success: true, profile: result.user }
    } catch (error: any) {
      return { success: false, message: error.message }
    }
  }, [dispatch])

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
    logout,
    checkAuth,
    initializeAuth,
    clearAuthError,
    getProfile,
    fetchProfile,
    updateProfile
  }
}
