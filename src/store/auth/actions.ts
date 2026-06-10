import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  login as authLogin,
  verifyMFALogin,
  register as authRegister,
  logout as authLogout,
  fetchProfile,
  validateAuthentication,
  forgotPassword as authForgotPassword,
  resetPassword as authResetPassword,
	type LoginRequest,
	type MFALoginVerifyRequest,
	type RegisterRequest,
	type ForgotPasswordRequest,
	type ResetPasswordRequest,
	type ResetPasswordQueryParams
} from '@/services'
import type { ProfileEntity } from '@/services/api/auth/types'

// Extended register request with optional query parameters
export interface RegisterAsyncRequest extends Omit<RegisterRequest, 'username'> {
  clientId?: string
  providerId?: string
}

// LoginThunkResult is the shared fulfilled payload for the password and MFA
// login thunks. When mfaRequired is set, the session is NOT yet established —
// the UI must complete the second step.
export interface LoginThunkResult {
  data: ProfileEntity | null
  message?: string
  mfaRequired?: boolean
  mfaChallengeToken?: string
  mfaAllowedMethods?: string[]
}

export const loginAsync = createAsyncThunk<LoginThunkResult, LoginRequest>(
  'auth/login',
  async (data: LoginRequest, thunkAPI) => {
		try {
			const response = await authLogin(data)
			// MFA enrolled: password step passed but a second factor is required.
			// Surface the challenge to the UI instead of fetching a (nonexistent) session.
			if (response.data?.mfa_required) {
				return {
					data: null,
					message: response.message,
					mfaRequired: true,
					mfaChallengeToken: response.data.mfa_challenge_token,
					mfaAllowedMethods: response.data.mfa_allowed_methods ?? [],
				}
			}
			const userProfile = await fetchProfile()
			return { data: userProfile, message: response.message }
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : 'Login failed'
			return thunkAPI.rejectWithValue({ message: errorMessage })
		}
  }
)

// completeMFALoginAsync finishes the login MFA second step. The verify call
// Set-Cookies an acr=2 session, after which we load the profile and mark the
// user authenticated — mirroring a normal login.
export const completeMFALoginAsync = createAsyncThunk<LoginThunkResult, MFALoginVerifyRequest>(
  'auth/completeMFALogin',
  async (data: MFALoginVerifyRequest, thunkAPI) => {
    try {
      const response = await verifyMFALogin(data)
      const userProfile = await fetchProfile()
      return { data: userProfile, message: response.message }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'MFA verification failed'
      return thunkAPI.rejectWithValue({ message: errorMessage })
    }
  }
)

export const registerAsync = createAsyncThunk(
  'auth/register',
  async (data: RegisterAsyncRequest, thunkAPI) => {
    try {
      const response = await authRegister(data)
      return { data: response.data }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      return thunkAPI.rejectWithValue({ message: errorMessage })
    }
  }
)

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async () => {
    await authLogout()
  }
)

export const validateAuthAsync = createAsyncThunk(
  'auth/validate',
  async (_, thunkAPI) => {
    const userProfile = await validateAuthentication()
    if (userProfile) {
      return userProfile
    }
    return thunkAPI.rejectWithValue({ message: 'Authentication validation failed' })
  }
)

export const initializeAuthAsync = createAsyncThunk(
  'auth/initialize',
  async () => {
    const userProfile = await validateAuthentication()
    return userProfile
  }
)

export const fetchProfileAsync = createAsyncThunk(
  'auth/fetchProfile',
  async () => {
    const userProfile = await fetchProfile()
    if (userProfile) {
      return userProfile
    }
    throw new Error('No profile found')
  }
)

export const forgotPasswordAsync = createAsyncThunk(
  'auth/forgotPassword',
  async (data: ForgotPasswordRequest, thunkAPI) => {
    try {
      await authForgotPassword(data)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email'
      return thunkAPI.rejectWithValue({ message: errorMessage })
    }
  }
)

export interface ResetPasswordAsyncRequest {
  password: ResetPasswordRequest
  queryParams: ResetPasswordQueryParams
}

export const resetPasswordAsync = createAsyncThunk(
  'auth/resetPassword',
  async (data: ResetPasswordAsyncRequest, thunkAPI) => {
    try {
      await authResetPassword(data.password, data.queryParams)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset password'
      return thunkAPI.rejectWithValue({ message: errorMessage })
    }
  }
)
