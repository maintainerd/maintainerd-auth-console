/**
 * Tenant API Types
 * Type definitions for tenant API operations
 */

import type { ApiResponse, PaginatedResponse } from '../types/common'

/**
 * Tenant status type
 */
export type TenantStatusType = 'active' | 'inactive' | 'suspended'

/**
 * Tenant entity from API
 */
export interface TenantEntity {
  tenant_id: string
  name: string
  display_name: string
  description: string
  identifier: string
  status: TenantStatusType
  is_public: boolean
  is_default: boolean
  is_system: boolean
  created_at: string
  updated_at: string
}

/**
 * Tenant list query parameters
 */
export interface TenantListParams {
  name?: string
  display_name?: string
  description?: string
  identifier?: string
  status?: TenantStatusType
  is_public?: boolean
  is_default?: boolean
  is_system?: boolean
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

/**
 * Create tenant request
 */
export interface CreateTenantRequest {
  name: string
  display_name: string
  description: string
  status: TenantStatusType
  is_public: boolean
}

/**
 * Update tenant request
 */
export interface UpdateTenantRequest {
  name: string
  display_name: string
  description: string
  status: TenantStatusType
  is_public: boolean
}

/**
 * Tenant API response
 */
export type TenantResponse = ApiResponse<TenantEntity>

/**
 * Tenant list API response
 */
export type TenantListResponse = ApiResponse<PaginatedResponse<TenantEntity>>
