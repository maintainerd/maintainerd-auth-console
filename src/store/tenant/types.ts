/**
 * Tenant Store Types
 * Redux-specific types for tenant state management
 */

import type { TenantEntity } from '@/services/api/tenant/types'

export interface TenantStateInterface {
  currentTenant: TenantEntity | null
  isLoading: boolean
  error: string | null
}
