/**
 * Identity Provider API Types
 */

import type { StatusType } from '@/types/status'

/**
 * Identity provider status type
 */
export type IdentityProviderStatusType = Extract<StatusType, 'active' | 'inactive'>

/**
 * Identity provider type
 */
export type ProviderType = 'identity' | 'social'

/**
 * Provider options
 */
export type ProviderOption = 'internal' | 'cognito' | 'auth0' | 'google' | 'facebook' | 'github'

/**
 * Identity Provider type
 */
export type IdentityProviderType = {
  identity_provider_id: string
  name: string
  display_name: string
  provider: ProviderOption
  provider_type: ProviderType
  identifier: string
  status: IdentityProviderStatusType
  is_default: boolean
  is_system: boolean
  created_at: string
  updated_at: string
}

/**
 * Tenant type for identity provider details
 */
export type TenantType = {
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
export type IdentityProviderDetailType = {
  identity_provider_id: string
  name: string
  display_name: string
  provider: ProviderOption
  provider_type: ProviderType
  identifier: string
  config: Record<string, any> // Dynamic config based on provider
  tenant: TenantType
  status: IdentityProviderStatusType
  is_default: boolean
  is_system: boolean
  created_at: string
  updated_at: string
}

/**
 * Identity provider list query parameters interface
 */
export interface IdentityProviderQueryParamsInterface {
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
export interface IdentityProviderListResponseInterface {
  rows: IdentityProviderType[]
  total: number
  page: number
  limit: number
  total_pages: number
}

/**
 * Single identity provider response interface (for list items)
 */
export interface IdentityProviderResponseInterface {
  identity_provider_id: string
  name: string
  display_name: string
  provider: ProviderOption
  provider_type: ProviderType
  identifier: string
  status: IdentityProviderStatusType
  is_default: boolean
  is_system: boolean
  created_at: string
  updated_at: string
}

/**
 * Identity provider detail response interface (includes config and tenant)
 */
export interface IdentityProviderDetailResponseInterface {
  identity_provider_id: string
  name: string
  display_name: string
  provider: ProviderOption
  provider_type: ProviderType
  identifier: string
  config: Record<string, any>
  tenant: TenantType
  status: IdentityProviderStatusType
  is_default: boolean
  is_system: boolean
  created_at: string
  updated_at: string
}

/**
 * Create identity provider request interface
 */
export interface CreateIdentityProviderRequestInterface {
  name: string
  display_name: string
  provider: ProviderOption
  provider_type: ProviderType
  config: Record<string, any>
  status: IdentityProviderStatusType
  tenant_id: string
}

/**
 * Update identity provider request interface
 */
export interface UpdateIdentityProviderRequestInterface {
  name: string
  display_name: string
  provider: ProviderOption
  provider_type: ProviderType
  config: Record<string, any>
  status: IdentityProviderStatusType
}

/**
 * Update identity provider status request interface
 */
export interface UpdateIdentityProviderStatusRequestInterface {
  status: IdentityProviderStatusType
}

