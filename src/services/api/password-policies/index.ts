/**
 * Password Policies API Service
 */

import { get, put } from '@/services'
import type {
  PasswordPoliciesType,
  PasswordPoliciesPayload,
  PasswordPoliciesResponseInterface,
  ApiResponse
} from './types'

const API_ENDPOINTS = {
  PASSWORD_POLICIES: '/security-settings/password',
}

/**
 * Fetch password policies
 */
export async function fetchPasswordPolicies(): Promise<PasswordPoliciesType> {
  const response = await get<PasswordPoliciesResponseInterface>(API_ENDPOINTS.PASSWORD_POLICIES)

  if (!response.success) {
    throw new Error(response.message || 'Failed to fetch password policies')
  }

  // Transform snake_case response to camelCase
  const data = response.data
  
  const transformed: PasswordPoliciesType = {
    minLength: data.min_length,
    maxLength: data.max_length,
    requireUppercase: data.require_uppercase,
    requireLowercase: data.require_lowercase,
    requireNumbers: data.require_numbers,
    requireSpecialChars: data.require_special_chars,
    allowedSpecialChars: data.allowed_special_chars,
    preventCommonPasswords: data.prevent_common_passwords,
    preventUserInfoInPassword: data.prevent_user_info_in_password,
    preventSequentialChars: data.prevent_sequential_chars,
    preventRepeatingChars: data.prevent_repeating_chars,
    maxRepeatingChars: data.max_repeating_chars,
    passwordExpiration: data.password_expiration,
    expirationDays: data.expiration_days,
    expirationWarningDays: data.expiration_warning_days,
    passwordHistory: data.password_history,
    historyCount: data.history_count,
    allowSelfReset: data.allow_self_reset,
    resetTokenExpiry: data.reset_token_expiry,
    maxResetAttempts: data.max_reset_attempts,
    resetCooldown: data.reset_cooldown,
    minimumStrengthScore: data.minimum_strength_score,
    showStrengthMeter: data.show_strength_meter,
    blockWeakPasswords: data.block_weak_passwords
  }
  
  return transformed
}

/**
 * Update password policies
 */
export async function updatePasswordPolicies(
  data: PasswordPoliciesPayload
): Promise<PasswordPoliciesType> {
  const response = await put<ApiResponse<PasswordPoliciesType>>(
    API_ENDPOINTS.PASSWORD_POLICIES,
    data
  )

  if (!response.success) {
    throw new Error(response.message || 'Failed to update password policies')
  }

  return response.data
}
