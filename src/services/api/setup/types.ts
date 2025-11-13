/**
 * Setup API Types
 * Type definitions for setup-related API requests and responses
 */

export interface CreateTenantRequest {
  name: string
  description: string
  metadata: {
    application_logo_url: string
    favicon_url: string
    language: string
    timezone: string
    date_format: string
    time_format: string
    privacy_policy_url: string
    term_of_service_url: string
  }
}

export interface TenantData {
  tenant_uuid: string
  name: string
  description: string
  identifier: string
  is_active: boolean
  is_public: boolean
  is_default: boolean
  metadata: {
    application_logo_url: string
    favicon_url: string
    date_format: string
    time_format: string
    timezone: string
    language: string
    term_of_service_url: string
    privacy_policy_url: string
  }
  created_at: string
  updated_at: string
}

export interface CreateTenantResponse {
  success: true
  data: TenantData
  message: string
}

export interface CreateAdminRequest {
  username: string
  fullname: string
  password: string
  email: string
}

export interface AdminData {
  admin_uuid: string
  username: string
  fullname: string
  email: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateAdminResponse {
  success: true
  data: AdminData
  message: string
}

export interface CreateProfileRequest {
  first_name: string
  last_name: string
  display_name: string
  bio?: string
  birthdate?: string
  gender?: string
  phone?: string
  email: string
  address?: string
  city?: string
  country?: string
  timezone?: string
  language?: string
}

export interface ProfileData {
  profile_id: string
  first_name: string
  last_name: string
  display_name: string
  bio?: string
  birthdate?: string
  gender?: string
  phone?: string
  email: string
  address?: string
  city?: string
  country?: string
  timezone?: string
  language?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateProfileResponse {
  success: true
  data: ProfileData
  message: string
}
