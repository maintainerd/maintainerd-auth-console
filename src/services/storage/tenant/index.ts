/**
 * Tenant Storage
 * Handles localStorage operations for tenant data
 */

import { localStorageAdapter } from '../adapters'
import type { TenantType } from '@/types'

// Storage keys constants
export const TENANT_STORAGE_KEYS = {
  TENANT: 'm9d.auth.tenant',
} as const

/**
 * Tenant storage operations
 */
export const tenantStorage = {
  /**
   * Get stored tenant data
   * @returns TenantType or null if not found
   */
  getTenant(): TenantType | null {
    return localStorageAdapter.get<TenantType>(TENANT_STORAGE_KEYS.TENANT)
  },

  /**
   * Store tenant data
   * @param tenant - Tenant data to store
   */
  setTenant(tenant: TenantType): void {
    localStorageAdapter.set(TENANT_STORAGE_KEYS.TENANT, tenant)
  },

  /**
   * Clear stored tenant data
   */
  clearTenant(): void {
    localStorageAdapter.remove(TENANT_STORAGE_KEYS.TENANT)
  },

  /**
   * Check if tenant data exists in storage
   * @returns True if tenant exists
   */
  hasTenant(): boolean {
    return localStorageAdapter.has(TENANT_STORAGE_KEYS.TENANT)
  }
}
