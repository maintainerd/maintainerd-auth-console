import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useToast } from '@/hooks/useToast'
import type { ProfileEntity } from '@/services/api/auth/types'
import {
  loginAsync,
  completeMFALoginAsync,
  registerAsync,
  registerInviteAsync,
  logoutAsync,
  validateAuthAsync,
  initializeAuthAsync,
  fetchProfileAsync,
  refreshAccountAsync,
  forgotPasswordAsync,
  resetPasswordAsync,
  type ResetPasswordAsyncRequest
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
  const { profile, account, isAuthenticated, isLoading, isInitialized, error } = useAppSelector((state) => state.auth)

  const login = useCallback(async (email: string, password: string) => {
    const result = await dispatch(loginAsync({ username: email, password })).unwrap()

    // MFA enrolled: a second factor is required before the session is issued.
    if (result.mfaRequired) {
      return {
        requiresProfileSetup: false,
        mfaRequired: true,
        challengeToken: result.mfaChallengeToken ?? '',
        allowedMethods: result.mfaAllowedMethods ?? [],
      }
    }

    const account = result.data
    return { account, mfaRequired: false }
  }, [dispatch])

  // completeMFALogin finishes the login MFA second step (acr=2 session) and
  // returns whether the user still needs to set up a profile.
  const completeMFALogin = useCallback(async (
    challengeToken: string,
    method: string,
    proof: { code?: string; assertion?: unknown },
  ) => {
    const result = await dispatch(completeMFALoginAsync({
      mfa_challenge_token: challengeToken,
      method,
      code: proof.code,
      assertion: proof.assertion,
    })).unwrap()
    return { account: result.data }
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

  const registerInvite = useCallback(async (
    username: string,
    password: string,
  ) => {
    const inviteToken = searchParams.get('invite_token') || ''
    const expires = searchParams.get('expires') || ''
    const sig = searchParams.get('sig') || ''
    const authFlow = searchParams.get('auth_flow') || undefined

    const result = await dispatch(registerInviteAsync({
      username,
      password,
      queryParams: {
        invite_token: inviteToken,
        expires,
        sig,
        auth_flow: authFlow,
      }
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
    } catch {
      // Silent failure for auth check - don't show error toast
      return false
    }
  }, [dispatch])

  const initializeAuth = useCallback(async () => {
    try {
      await dispatch(initializeAuthAsync()).unwrap()
    } catch {
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
    } catch {
      // Silent failure - profile might not exist yet
      return null
    }
  }, [dispatch])

  // refreshAccount re-syncs auth state with the live cookie session and returns
  // the fresh account (or null). Use after register / verify email / create
  // profile so routing reflects the current email_verified + profiles state.
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

  const forgotPassword = useCallback(async (email: string) => {
    await dispatch(forgotPasswordAsync({ email })).unwrap()
  }, [dispatch])

  const resetPassword = useCallback(async (data: ResetPasswordAsyncRequest) => {
    await dispatch(resetPasswordAsync(data)).unwrap()
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
    login,
    completeMFALogin,
    register,
    registerInvite,
    logout,
    checkAuth,
    initializeAuth,
    clearAuthError,
    getProfile,
    fetchProfile,
    refreshAccount,
    updateProfile,
    forgotPassword,
    resetPassword
  }
}
