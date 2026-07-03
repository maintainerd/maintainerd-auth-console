/**
 * Account API Service — self-service profile, settings, sessions, and account actions
 * for the currently authenticated user.
 */

import { get, post, put, deleteRequest } from "./client"
import { unwrap, assertSuccess } from "./_lib/unwrap"
import type { ApiResponse } from "./types"

// Elevated step-up token (acr=2) returned by /mfa/step-up/verify. Step-up gated
// endpoints (delete account, revoke all sessions) read the Authorization header
// before the session cookie, so we pass it explicitly for those calls.
function bearer(accessToken?: string) {
  return accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined
}

// ── Profile ────────────────────────────────────────────────────────────────

export interface AccountProfile {
  profile_id: string
  first_name: string
  middle_name?: string
  last_name?: string
  suffix?: string
  display_name?: string
  bio?: string
  birthdate?: string | null
  gender?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  country?: string
  timezone?: string
  language?: string
  profile_url?: string
  is_default?: boolean
  created_at?: string
  updated_at?: string
}

export interface UpdateAccountProfileRequest {
  first_name: string
  middle_name?: string
  last_name?: string
  suffix?: string
  display_name?: string
  bio?: string
  birthdate?: string
  gender?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  country?: string
  timezone?: string
  language?: string
  profile_url?: string
}

export const fetchAccountProfile = (): Promise<AccountProfile> =>
  get<ApiResponse<AccountProfile>>("/profile").then((r) => unwrap(r, "fetch profile"))

export const updateAccountProfile = (data: UpdateAccountProfileRequest): Promise<AccountProfile> =>
  post<ApiResponse<AccountProfile>>("/profile", data).then((r) => unwrap(r, "update profile"))

// ── User settings (preferences) ──────────────────────────────────────────────

export interface UserSettings {
  user_setting_id?: string
  timezone?: string
  preferred_language?: string
  locale?: string
  preferred_contact_method?: string
  marketing_email_consent?: boolean
  sms_notifications_consent?: boolean
  push_notifications_consent?: boolean
  profile_visibility?: string
  data_processing_consent?: boolean
  created_at?: string
  updated_at?: string
}

export interface UpdateUserSettingsRequest {
  timezone?: string
  preferred_language?: string
  locale?: string
  preferred_contact_method?: string
  marketing_email_consent?: boolean
  sms_notifications_consent?: boolean
  push_notifications_consent?: boolean
  profile_visibility?: string
}

// Returns an empty object when the user has no settings row yet (first visit),
// so the preferences form renders defaults and POST creates the row on save.
export const fetchUserSettings = async (): Promise<UserSettings> => {
  try {
    const r = await get<ApiResponse<UserSettings>>("/user-settings")
    return r.success && r.data ? r.data : {}
  } catch (err: unknown) {
    // Only a 404 (no settings row yet) is a "return defaults" case. Any other
    // failure (401/403/5xx) must surface so callers don't silently show an empty
    // preferences form on a real error.
    const apiErr = err as { status?: number }
    if (apiErr?.status === 404) return {}
    throw err
  }
}

export const updateUserSettings = (data: UpdateUserSettingsRequest): Promise<UserSettings> =>
  post<ApiResponse<UserSettings>>("/user-settings", data).then((r) => unwrap(r, "update settings"))

// ── Sessions ───────────────────────────────────────────────────────────────

export interface AccountSession {
  session_id: string
  ip_address?: string
  user_agent?: string
  last_used_at?: string | null
  expires_at?: string | null
  absolute_expires_at?: string | null
  created_at: string
}

export const fetchAccountSessions = (): Promise<AccountSession[]> =>
  get<ApiResponse<AccountSession[]>>("/account/sessions").then((r) => unwrap(r, "fetch sessions"))

export const revokeAccountSession = (sessionId: string): Promise<void> =>
  deleteRequest<ApiResponse<void>>(`/account/sessions/${sessionId}`).then((r) => assertSuccess(r, "revoke session"))

// Requires step-up — pass an elevated access token from the step-up flow.
export const revokeAllAccountSessions = (accessToken?: string): Promise<void> =>
  deleteRequest<ApiResponse<void>>("/account/sessions", bearer(accessToken)).then((r) =>
    assertSuccess(r, "revoke all sessions"),
  )

// ── Account actions ──────────────────────────────────────────────────────────

export const changeEmail = (newEmail: string, currentPassword: string): Promise<void> =>
  post<ApiResponse<void>>("/account/email/change", { new_email: newEmail, current_password: currentPassword }).then(
    (r) => assertSuccess(r, "change email"),
  )

export const verifyEmailChange = (otp: string): Promise<void> =>
  post<ApiResponse<void>>("/account/email/verify", { otp }).then((r) => assertSuccess(r, "verify email change"))

export const changeUsername = (newUsername: string, currentPassword: string): Promise<void> =>
  put<ApiResponse<void>>("/account/username", { new_username: newUsername, current_password: currentPassword }).then(
    (r) => assertSuccess(r, "change username"),
  )

export interface AccountExport {
  user_uuid: string
  username: string
  email: string
  phone: string
  created_at: string
  profile: unknown
  roles: string[]
  settings: unknown
}

export const exportAccountData = (): Promise<AccountExport> =>
  get<ApiResponse<AccountExport>>("/account/export").then((r) => unwrap(r, "export account data"))

// Requires step-up — pass an elevated access token from the step-up flow.
export const deleteAccount = (currentPassword: string, accessToken?: string): Promise<void> =>
  deleteRequest<ApiResponse<void>>("/account", {
    ...bearer(accessToken),
    data: { current_password: currentPassword },
  }).then((r) => assertSuccess(r, "delete account"))
