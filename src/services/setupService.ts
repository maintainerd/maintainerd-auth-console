/**
 * Setup Service
 * Service layer for setup-related API calls
 */

import { post } from './api/client'
import { API_ENDPOINTS } from './api/config'
import type { CreateTenantRequest, CreateTenantResponse } from './api/types/setup'

/**
 * Create a new tenant
 * @param data - Tenant creation data
 * @returns Promise<CreateTenantResponse>
 */
export async function createTenant(data: CreateTenantRequest): Promise<CreateTenantResponse> {
  try {
    const response = await post<CreateTenantResponse>(
      API_ENDPOINTS.SETUP.CREATE_TENANT,
      data
    )
    return response
  } catch (error) {
    throw error
  }
}

/**
 * Get default tenant metadata
 * @returns Default metadata object
 */
export function getDefaultTenantMetadata() {
  return {
    application_logo_url: "https://example.com/logo.png",
    favicon_url: "https://example.com/favicon.ico",
    language: "en-US",
    timezone: "Manila",
    date_format: "YYYY/MM/DD",
    time_format: "12h",
    privacy_policy_url: "https://example.com/privacy",
    term_of_service_url: "https://example.com/terms"
  }
}

/**
 * Check if setup is already completed
 * @returns Promise<boolean>
 */
export async function isSetupCompleted(): Promise<boolean> {
  try {
    // Try to create a test tenant to see if setup is already done
    // This will fail if tenant already exists
    await post('/setup/status')
    return false // Setup not completed
  } catch (error) {
    // If we get an error about tenant already existing, setup is completed
    if (error instanceof Error && error.message.includes('tenant already exists')) {
      return true
    }
    // For other errors, assume setup is not completed
    return false
  }
}

/**
 * Create tenant with default metadata
 * @param name - Tenant name
 * @param description - Tenant description
 * @returns Promise<CreateTenantResponse>
 */
export async function createTenantWithDefaults(name: string, description: string): Promise<CreateTenantResponse> {
  const payload: CreateTenantRequest = {
    name,
    description,
    metadata: getDefaultTenantMetadata()
  }

  return createTenant(payload)
}

// Export functions as an object for backward compatibility
export const setupService = {
  createTenant,
  getDefaultTenantMetadata,
  createTenantWithDefaults,
  isSetupCompleted,
}
