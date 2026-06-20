/**
 * Identity Provider API Types
 */

import type { Status } from '@/types/status'

/**
 * Identity provider status type
 */
export type IdentityProviderStatus = Extract<Status, 'active' | 'inactive'>

/**
 * Identity provider type
 */
export type ProviderType = 'identity' | 'social'

/**
 * Provider options
 */
export type ProviderOption =
  | 'maintainerd'
  | 'cognito'
  | 'auth0'
  | 'google'
  | 'facebook'
  | 'github'
  | 'gitlab'
  | 'microsoft'
  | 'apple'
  | 'linkedin'
  | 'twitter'

/**
 * Identity Provider type
 */
export type IdentityProvider = {
  identity_provider_id: string
  name: string
  display_name: string
  provider: ProviderOption
  provider_type: ProviderType
  identifier: string
  status: IdentityProviderStatus
  is_default: boolean
  is_system: boolean
  created_at: string
  updated_at: string
}

/**
 * Tenant type for identity provider details
 */
export type Tenant = {
  tenant_id: string
  name: string
  description: string
  identifier: string
  status: 'active' | 'inactive' | 'suspended'
  is_public: boolean
  is_default: boolean
  is_system: boolean
  created_at: string
  updated_at: string
}

/**
 * Identity Provider Detail type (includes config and tenant)
 */
export type IdentityProviderDetail = {
  identity_provider_id: string
  name: string
  display_name: string
  provider: ProviderOption
  provider_type: ProviderType
  identifier: string
  config: Record<string, unknown> | null
  tenant: Tenant | null
  status: IdentityProviderStatus
  is_default: boolean
  is_system: boolean
  created_at: string
  updated_at: string
}

/**
 * Identity provider list query parameters interface
 */
export interface IdentityProviderQueryParams {
  search?: string
  name?: string
  display_name?: string
  provider?: string
  provider_type?: ProviderType
  identifier?: string
  status?: string
  is_default?: boolean
  is_system?: boolean
  tenant_id?: string
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

/**
 * Paginated identity provider list response interface
 */
export interface IdentityProviderListResponse {
  rows: IdentityProvider[]
  total: number
  page: number
  limit: number
  total_pages: number
}

/**
 * Single identity provider response interface (for list items)
 */
export interface IdentityProviderResponse {
  identity_provider_id: string
  name: string
  display_name: string
  provider: ProviderOption
  provider_type: ProviderType
  identifier: string
  status: IdentityProviderStatus
  is_default: boolean
  is_system: boolean
  created_at: string
  updated_at: string
}

/**
 * Identity provider detail response interface (includes config and tenant)
 */
export interface IdentityProviderDetailResponse {
  identity_provider_id: string
  name: string
  display_name: string
  provider: ProviderOption
  provider_type: ProviderType
  identifier: string
  config: Record<string, unknown> | null
  tenant: Tenant | null
  status: IdentityProviderStatus
  is_default: boolean
  is_system: boolean
  created_at: string
  updated_at: string
}

/**
 * Create identity provider request interface
 */
export interface CreateIdentityProviderRequest {
  name: string
  display_name: string
  provider: ProviderOption
  provider_type: ProviderType
  config: Record<string, unknown>
  status: IdentityProviderStatus
}

/**
 * Update identity provider request interface
 */
export interface UpdateIdentityProviderRequest {
  name: string
  display_name: string
  provider: ProviderOption
  provider_type: ProviderType
  config: Record<string, unknown>
  status: IdentityProviderStatus
}

/**
 * Update identity provider status request interface
 */
export interface UpdateIdentityProviderStatusRequest {
  status: IdentityProviderStatus
}

