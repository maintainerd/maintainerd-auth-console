/**
 * Tenant Service
 * Handles tenant API calls and storage operations
 */

import { get } from '../client'
import { API_ENDPOINTS } from '../config'
import { tenantStorage } from '../../storage/tenant'
import type { TenantType, TenantResponseInterface } from '@/types'

/**
 * Fetch default tenant and store it
 * @returns Promise<TenantType>
 */
export async function fetchAndStoreDefaultTenant(): Promise<TenantType> {
  try {
    const response = await get<TenantResponseInterface>(API_ENDPOINTS.TENANT)

    if (response.success && response.data) {
      // Store tenant in localStorage
      tenantStorage.setTenant(response.data)
      return response.data
    }

    throw new Error('Failed to fetch default tenant')
  } catch (error) {
    throw error
  }
}

/**
 * Fetch tenant by identifier and store it
 * @param identifier - Tenant identifier
 * @returns Promise<TenantType>
 */
export async function fetchAndStoreTenantByIdentifier(identifier: string): Promise<TenantType> {
  try {
    const response = await get<TenantResponseInterface>(`${API_ENDPOINTS.TENANT}/${identifier}`)

    if (response.success && response.data) {
      // Store tenant in localStorage
      tenantStorage.setTenant(response.data)
      return response.data
    }

    throw new Error(`Failed to fetch tenant with identifier: ${identifier}`)
  } catch (error) {
    throw error
  }
}

/**
 * Fetch and store tenant based on identifier (or default if no identifier)
 * @param identifier - Optional tenant identifier
 * @returns Promise<TenantType>
 */
export async function fetchAndStoreTenant(identifier?: string): Promise<TenantType> {
  if (identifier) {
    return await fetchAndStoreTenantByIdentifier(identifier)
  } else {
    return await fetchAndStoreDefaultTenant()
  }
}

/**
 * Get stored tenant
 * @returns TenantType or null if not found
 */
export function getCurrentTenant(): TenantType | null {
  return tenantStorage.getTenant()
}

/**
 * Clear stored tenant
 */
export function clearTenant(): void {
  tenantStorage.clearTenant()
}

/**
 * Check if tenant is stored
 * @returns True if tenant exists in storage
 */
export function hasTenant(): boolean {
  return tenantStorage.hasTenant()
}

// Export functions as an object
export const tenantService = {
  fetchAndStoreDefaultTenant,
  fetchAndStoreTenantByIdentifier,
  fetchAndStoreTenant,
  getCurrentTenant,
  clearTenant,
  hasTenant
}
