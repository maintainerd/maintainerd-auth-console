/**
 * Tenant API Types
 * Type definitions for tenant API operations
 */

import type { ApiResponse } from '../types/common'

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
 * Tenant API response
 */
export type TenantResponse = ApiResponse<TenantEntity>
