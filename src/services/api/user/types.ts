/**
 * User API Types
 */


import type { StatusType } from '@/types/status'

/**
 * User metadata type - define the structure of metadata here
 */
export type UserMetadata = {
  // Add specific fields as needed, or use string | number | boolean for values
  [key: string]: string | number | boolean | null;
};

/**
 * User status type - defines valid statuses for users
 */
export type UserStatusType = Extract<StatusType, 'active' | 'inactive' | 'pending' | 'suspended'>

/**
 * User Profile type
 */
export type UserProfileType = {
  profile_id: string
  first_name: string
  last_name: string
  display_name: string
  bio: string
  birthdate: string
  gender: string
  phone: string
  email: string
  address: string
  city: string
  country: string
  timezone: string
  language: string
  is_default: boolean
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

/**
 * User type
 */
export type UserType = {
  user_id: string
  username: string
  fullname: string
  email: string
  phone: string
  is_email_verified: boolean
  is_phone_verified: boolean
  is_profile_completed: boolean
  is_account_completed: boolean
  status: UserStatusType
  metadata: UserMetadata
  tenant?: {
    tenant_id: string
    name: string
    description: string
    identifier: string
    status: string
    is_public: boolean
    is_default: boolean
    is_system: boolean
    created_at: string
    updated_at: string
  }
  created_at: string
  updated_at: string
}

/**
 * User Role type
 */
export type UserRoleType = {
  role_id: string
  name: string
  description: string
  is_default: boolean
  is_system: boolean
  status: string
  created_at: string
  updated_at: string
}

/**
 * User Identity type
 */
export type UserIdentityType = {
  user_identity_id: string
  provider: string
  sub: string
  metadata: Record<string, unknown> | null
  client: {
    client_id: string
    name: string
    display_name: string
    client_type: string
    domain: string
    status: string
    is_default: boolean
    is_system: boolean
    created_at: string
    updated_at: string
  }
  created_at: string
  updated_at: string
}

/**
 * User list query parameters interface
 */
export interface UserQueryParamsInterface {
  username?: string
  email?: string
  phone?: string
  status?: string
  tenant_id?: string
  role_id?: string
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

/**
 * Paginated User list response interface
 */
export interface UserListResponseInterface {
  rows: UserType[]
  total: number
  page: number
  limit: number
  total_pages: number
}

/**
 * Create User request interface
 */
export interface CreateUserRequestInterface {
  username: string
  fullname: string
  email: string
  phone?: string
  password: string
  status: UserStatusType
  metadata?: UserMetadata
  tenant_id?: string
}

/**
 * Update User request interface
 */
export interface UpdateUserRequestInterface {
  username?: string
  fullname?: string
  email?: string
  phone?: string
  status?: UserStatusType
  metadata?: UserMetadata
}

/**
 * Update User status request interface
 */
export interface UpdateUserStatusRequestInterface {
  status: UserStatusType
}

/**
 * User Roles query parameters interface
 */
export interface UserRolesQueryParamsInterface {
  name?: string
  description?: string
  status?: string
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

/**
 * Paginated User Roles response interface
 */
export interface UserRolesResponseInterface {
  rows: UserRoleType[]
  total: number
  page: number
  limit: number
  total_pages: number
}

/**
 * User Identities query parameters interface
 */
export interface UserIdentitiesQueryParamsInterface {
  provider?: string
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

/**
 * Paginated User Identities response interface
 */
export interface UserIdentitiesResponseInterface {
  rows: UserIdentityType[]
  total: number
  page: number
  limit: number
  total_pages: number
}

/**
 * User Profiles query parameters interface
 */
export interface UserProfilesQueryParamsInterface {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  city?: string
  country?: string
  is_default?: boolean
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

/**
 * Paginated User Profiles response interface
 */
export interface UserProfilesResponseInterface {
  rows: UserProfileType[]
  total: number
  page: number
  limit: number
  total_pages: number
}

/**
 * Create User Profile request interface
 */
export interface CreateUserProfileRequestInterface {
  first_name: string
  middle_name?: string
  last_name: string
  suffix?: string
  display_name?: string
  birthdate?: string
  gender?: string
  bio?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  country?: string
  timezone?: string
  language?: string
  profile_url?: string
  metadata?: Record<string, any>
}

/**
 * Update User Profile request interface
 */
export interface UpdateUserProfileRequestInterface {
  first_name?: string
  middle_name?: string
  last_name?: string
  suffix?: string
  display_name?: string
  birthdate?: string
  gender?: string
  bio?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  country?: string
  timezone?: string
  language?: string
  profile_url?: string
  metadata?: Record<string, any>
}
