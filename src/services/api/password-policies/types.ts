/**
 * Password Policies API Types
 */

/**
 * Password policies configuration
 */
export interface PasswordPoliciesType {
  // Basic Requirements
  minLength?: number
  maxLength?: number
  requireUppercase?: boolean
  requireLowercase?: boolean
  requireNumbers?: boolean
  requireSpecialChars?: boolean
  allowedSpecialChars?: string
  
  // Advanced Requirements
  preventCommonPasswords?: boolean
  preventUserInfoInPassword?: boolean
  preventSequentialChars?: boolean
  preventRepeatingChars?: boolean
  maxRepeatingChars?: number
  
  // Expiration & History
  passwordExpiration?: boolean
  expirationDays?: number
  expirationWarningDays?: number
  passwordHistory?: boolean
  historyCount?: number
  
  // Reset & Recovery
  allowSelfReset?: boolean
  resetTokenExpiry?: number
  maxResetAttempts?: number
  resetCooldown?: number
  
  // Strength Requirements
  minimumStrengthScore?: number
  showStrengthMeter?: boolean
  blockWeakPasswords?: boolean
}

/**
 * API payload with snake_case fields for backend
 */
export interface PasswordPoliciesPayload {
  min_length?: number
  max_length?: number
  require_uppercase?: boolean
  require_lowercase?: boolean
  require_numbers?: boolean
  require_special_chars?: boolean
  allowed_special_chars?: string
  prevent_common_passwords?: boolean
  prevent_user_info_in_password?: boolean
  prevent_sequential_chars?: boolean
  prevent_repeating_chars?: boolean
  max_repeating_chars?: number
  password_expiration?: boolean
  expiration_days?: number
  expiration_warning_days?: number
  password_history?: boolean
  history_count?: number
  allow_self_reset?: boolean
  reset_token_expiry?: number
  max_reset_attempts?: number
  reset_cooldown?: number
  minimum_strength_score?: number
  show_strength_meter?: boolean
  block_weak_passwords?: boolean
}

/**
 * API Response for password policies (backend returns snake_case)
 */
export interface PasswordPoliciesResponseInterface {
  success: boolean
  data: PasswordPoliciesPayload
  message: string
}

/**
 * Generic API Response
 */
export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}
