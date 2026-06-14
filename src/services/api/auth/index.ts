/**
 * Authentication Service
 * Handles authentication API calls and storage operations
 */

import { post, get } from '../client'
import { API_ENDPOINTS, TOKEN_DELIVERY_HEADER } from '../config'
import type { ApiResponse } from '../types'
import type { WebAuthnAssertionOptions } from '@/lib/webauthn'
import type { ProfileEntity, AccountEntity, LoginRequest, LoginResponse, MFALoginVerifyRequest, LogoutResponse, RegisterRequest, RegisterResponse, CreateProfileRequest, CreateProfileResponse, ForgotPasswordRequest, ForgotPasswordResponse, ResetPasswordRequest, ResetPasswordResponse, ResetPasswordQueryParams, ProfileResponse } from './types'

type AccountResponse = ApiResponse<AccountEntity>

/**
 * Login user with credentials
 * @param username - User's email/username
 * @param password - User's password
 * @returns Promise<LoginResponse>
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
	const response = await post<LoginResponse>(
		API_ENDPOINTS.AUTH.LOGIN,
		data,
		{
			headers: { ...TOKEN_DELIVERY_HEADER }
		}
	)
	return response
}

/**
 * Complete the login MFA second step. On success the backend Set-Cookies an
 * acr=2 session (with X-Token-Delivery: cookie), so no token handling is needed
 * client-side — callers just refresh the auth state afterwards.
 */
export async function verifyMFALogin(data: MFALoginVerifyRequest): Promise<LoginResponse> {
  return post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN_MFA_VERIFY, data, {
    headers: { ...TOKEN_DELIVERY_HEADER },
  })
}

/** Send an SMS OTP for the in-flight login MFA challenge. */
export async function sendMFALoginSMS(challengeToken: string): Promise<void> {
  await post<ApiResponse<void>>(API_ENDPOINTS.AUTH.LOGIN_MFA_SEND_SMS, {
    mfa_challenge_token: challengeToken,
  })
}

/** Begin a passkey assertion ceremony for the in-flight login MFA challenge. */
export async function beginMFALoginWebAuthn(challengeToken: string): Promise<WebAuthnAssertionOptions> {
  const r = await post<ApiResponse<WebAuthnAssertionOptions>>(API_ENDPOINTS.AUTH.LOGIN_MFA_WEBAUTHN_BEGIN, {
    mfa_challenge_token: challengeToken,
  })
  if (!r.success || !r.data) {
    throw new Error(typeof r.error === 'string' ? r.error : 'Failed to begin WebAuthn authentication')
  }
  return r.data
}

// Extended register request with optional query parameters
export interface RegisterServiceRequest extends Omit<RegisterRequest, 'username'> {
  clientId?: string
  providerId?: string
}

/**
 * Register a new user
 * @param data - Registration data including fullname, email, password, and optional fields
 * @returns Promise<RegisterResponse>
 */
export async function register(data: RegisterServiceRequest): Promise<RegisterResponse> {
  const registerData: RegisterRequest = {
    username: data.email,
    fullname: data.fullname,
    email: data.email,
    phone: data.phone || '',
    password: data.password
  }

  // Build endpoint URL with query parameters if provided
  let endpoint = API_ENDPOINTS.AUTH.REGISTER
  const queryParams = new URLSearchParams()

  if (data.clientId) {
    queryParams.append('client_id', data.clientId)
  }

  if (data.providerId) {
    queryParams.append('provider_id', data.providerId)
  }

  if (queryParams.toString()) {
    endpoint += `?${queryParams.toString()}`
  }

  const response = await post<RegisterResponse>(
    endpoint,
    registerData,
    {
      headers: { ...TOKEN_DELIVERY_HEADER }
    }
  )
  return response
}

/**
 * Logout user
 * @returns Promise<LogoutResponse>
 */
export async function logout(): Promise<LogoutResponse> {
  const response = await post<LogoutResponse>(API_ENDPOINTS.AUTH.LOGOUT, {})
  return response
}

/**
 * Fetch user profile from API
 * @returns Promise<ProfileEntity | null> - Returns null if profile doesn't exist (e.g., newly registered user)
 */
export async function fetchProfile(): Promise<ProfileEntity | null> {
  try {
    const response = await get<ProfileResponse>(API_ENDPOINTS.AUTH.PROFILE)

    if (response.success && response.data) {
      return response.data
    }

    return null
  } catch {
    return null
  }
}

/**
 * Create user profile for authenticated users (requires cookie token)
 * @param data - Profile creation data
 * @returns Promise<CreateProfileResponse>
 */
export async function createUserProfile(data: CreateProfileRequest): Promise<CreateProfileResponse> {
  const response = await post<CreateProfileResponse>(
    API_ENDPOINTS.AUTH.PROFILE,
    data
  )
  return response
}

/**
 * Create profile for registered users (dedicated register flow)
 * @param data - Profile creation data
 * @returns Promise<CreateProfileResponse>
 */
export async function createRegisterProfile(data: CreateProfileRequest): Promise<CreateProfileResponse> {
  const response = await post<CreateProfileResponse>(
    API_ENDPOINTS.AUTH.PROFILE,
    data
  )
  return response
}

/**
 * Validate if the user is still authenticated with the backend
 * This checks if the backend cookie is still valid by calling the profile endpoint
 * @returns Promise<ProfileEntity | null> - Returns profile if authenticated, null otherwise
 */
export async function validateAuthentication(): Promise<AccountEntity | null> {
  try {
    const response = await get<AccountResponse>(API_ENDPOINTS.AUTH.ACCOUNT)
    if (response.success && response.data) return response.data
    return null
  } catch (err: unknown) {
    const apiErr = err as { status?: number }
    if (apiErr?.status === 401 || apiErr?.status === 403) throw err
    return null
  }
}

export async function fetchAccount(): Promise<AccountEntity | null> {
  try {
    const response = await get<AccountResponse>(API_ENDPOINTS.AUTH.ACCOUNT)
    if (response.success && response.data) return response.data
    return null
  } catch { return null }
}

/**
 * Request password reset
 * @param data - Email address for password reset
 * @returns Promise<ForgotPasswordResponse>
 */
export async function forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
  const response = await post<ForgotPasswordResponse>(
    API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
    data
  )
  return response
}

/**
 * Reset password with token from query params
 * @param data - New password
 * @param queryParams - Query parameters from the reset link (client_id, expires, provider_id, sig, token)
 * @returns Promise<ResetPasswordResponse>
 */
export async function resetPassword(
  data: ResetPasswordRequest,
  queryParams: ResetPasswordQueryParams
): Promise<ResetPasswordResponse> {
  // Build URL with query parameters
  const params = new URLSearchParams({
    client_id: queryParams.client_id,
    expires: queryParams.expires,
    provider_id: queryParams.provider_id,
    sig: queryParams.sig,
    token: queryParams.token
  })

  const url = `${API_ENDPOINTS.AUTH.RESET_PASSWORD}?${params.toString()}`

  const response = await post<ResetPasswordResponse>(url, data)
  return response
}

// Export functions as an object for backward compatibility
export const authService = {
  login,
  verifyMFALogin,
  sendMFALoginSMS,
  beginMFALoginWebAuthn,
  register,
  logout,
  fetchProfile,
  fetchAccount,
  createUserProfile,
  createRegisterProfile,
  validateAuthentication,
  forgotPassword,
  resetPassword
}
