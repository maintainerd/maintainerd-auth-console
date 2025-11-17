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
  const { showError } = useToast()
  const { profile, isAuthenticated, isLoading, isInitialized, error } = useAppSelector((state) => state.auth)

  const login = useCallback(async (email: string, password: string) => {
    const result = await dispatch(loginAsync({ username: email, password })).unwrap()

    // Check if profile exists
    const userProfile = result.data
    if (!userProfile) {
      return { requiresProfileSetup: true }
    }

    return { requiresProfileSetup: false }
  }, [dispatch])

  const register = useCallback(async (
    fullname: string,
    email: string,
    password: string,
    phone?: string
  ) => {
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

    return { data: result.data }
  }, [dispatch, searchParams])

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
    isInitialized,
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
