/**
 * Tenant Store Types
 * Redux-specific types for tenant state management
 */

import type { TenantType } from '@/types'

export interface TenantStateInterface {
  currentTenant: TenantType | null
  isLoading: boolean
  error: string | null
}
