import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useToast } from '@/hooks/useToast'
import type { ProfileEntity } from '@/services/api/auth/types'
import {
  logoutAsync,
  validateAuthAsync,
  initializeAuthAsync,
  fetchProfileAsync,
  refreshAccountAsync,
} from '@/store/auth/actions'
import {
  clearError,
  setProfile
} from '@/store/auth/reducers'
import { clearTenant } from '@/store/tenant/reducers'

export function useAuth() {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { showError } = useToast()
  const { profile, account, isAuthenticated, isLoading, isInitialized, error } = useAppSelector((state) => state.auth)

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutAsync()).unwrap()
      dispatch(clearTenant())
      queryClient.clear()
    } catch (error) {
      showError('Logout failed')
      dispatch(clearTenant())
      queryClient.clear()
      throw error
    }
  }, [dispatch, queryClient, showError])

  const checkAuth = useCallback(async () => {
    try {
      await dispatch(validateAuthAsync()).unwrap()
      return true
    } catch {
      // Silent failure for auth check - don't show error toast
      return false
    }
  }, [dispatch])

  const initializeAuth = useCallback(async () => {
    try {
      queryClient.clear()
      await dispatch(initializeAuthAsync()).unwrap()
    } catch {
      // Silent failure for auth initialization
    }
  }, [dispatch, queryClient])

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
    } catch {
      // Silent failure - profile might not exist yet
      return null
    }
  }, [dispatch])

  // refreshAccount re-syncs auth state with the live cookie session and returns
  // the fresh account (or null). Use after events that change the account but
  // happen outside login (e.g. profile creation) so routing reflects the current
  // email_verified + profiles state.
  const refreshAccount = useCallback(async () => {
    try {
      return await dispatch(refreshAccountAsync()).unwrap()
    } catch {
      return null
    }
  }, [dispatch])

  const updateProfile = useCallback((profileData: ProfileEntity | null) => {
    dispatch(setProfile(profileData))
  }, [dispatch])

  return {
    // State
    profile,
    account,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    // Actions
    logout,
    checkAuth,
    initializeAuth,
    clearAuthError,
    getProfile,
    fetchProfile,
    refreshAccount,
    updateProfile,
  }
}
