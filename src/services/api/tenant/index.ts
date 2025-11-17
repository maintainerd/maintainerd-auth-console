/**
 * Tenant Service
 * Handles tenant API calls and storage operations
 */

import { get } from '../client'
import { API_ENDPOINTS } from '../config'
import type { TenantType, TenantResponseInterface } from '@/types'

/**
 * Fetch default tenant
 * @returns Promise<TenantType>
 */
export async function fetchDefaultTenant(): Promise<TenantType> {
  const response = await get<TenantResponseInterface>(API_ENDPOINTS.TENANT)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error('Failed to fetch default tenant')
}

/**
 * Fetch tenant by identifier
 * @param identifier - Tenant identifier
 * @returns Promise<TenantType>
 */
export async function fetchTenantByIdentifier(identifier: string): Promise<TenantType> {
  const response = await get<TenantResponseInterface>(`${API_ENDPOINTS.TENANT}/${identifier}`)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(`Failed to fetch tenant with identifier: ${identifier}`)
}

/**
 * Fetch tenant based on identifier (or default if no identifier)
 * @param identifier - Optional tenant identifier
 * @returns Promise<TenantType>
 */
export async function fetchTenant(identifier?: string): Promise<TenantType> {
  if (identifier) {
    return await fetchTenantByIdentifier(identifier)
  } else {
    return await fetchDefaultTenant()
  }
}

// Export functions as an object
export const tenantService = {
  fetchDefaultTenant,
  fetchTenantByIdentifier,
  fetchTenant
}
