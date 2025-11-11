/**
 * Setup Service
 * Service layer for setup-related API calls
 */

import { post } from '../client'
import { API_ENDPOINTS } from '../config'
import type { CreateTenantRequest, CreateTenantResponse, CreateAdminRequest, CreateAdminResponse, CreateProfileRequest, CreateProfileResponse } from './types'

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
 * Create a new admin user
 * @param data - Admin creation data
 * @returns Promise<CreateAdminResponse>
 */
export async function createAdmin(data: CreateAdminRequest): Promise<CreateAdminResponse> {
  try {
    const response = await post<CreateAdminResponse>(
      API_ENDPOINTS.SETUP.CREATE_ADMIN,
      data
    )
    return response
  } catch (error) {
    throw error
  }
}

/**
 * Create a new profile
 * @param data - Profile creation data
 * @returns Promise<CreateProfileResponse>
 */
export async function createProfile(data: CreateProfileRequest): Promise<CreateProfileResponse> {
  try {
    const response = await post<CreateProfileResponse>(
      API_ENDPOINTS.SETUP.CREATE_PROFILE,
      data
    )
    return response
  } catch (error) {
    throw error
  }
}

/**
 * Get default tenant metadata for setup
 * @returns Promise with default tenant metadata
 */
export async function getDefaultTenantMetadata() {
  // This would typically fetch from an API endpoint
  // For now, return default values
  return {
    application_logo_url: '',
    favicon_url: '',
    language: 'en',
    timezone: 'UTC',
    date_format: 'YYYY-MM-DD',
    time_format: '24h',
    privacy_policy_url: '',
    term_of_service_url: ''
  }
}

/**
 * Create tenant with default metadata
 * @param name - Tenant name
 * @param description - Tenant description
 * @returns Promise<CreateTenantResponse>
 */
export async function createTenantWithDefaults(name: string, description: string): Promise<CreateTenantResponse> {
  const defaultMetadata = await getDefaultTenantMetadata()
  
  const tenantData: CreateTenantRequest = {
    name,
    description,
    metadata: defaultMetadata
  }
  
  return createTenant(tenantData)
}

/**
 * Check if setup is completed
 * This would typically check if required setup steps are done
 * @returns Promise<boolean>
 */
export async function isSetupCompleted(): Promise<boolean> {
  // This would typically make an API call to check setup status
  // For now, return false to indicate setup is needed
  return false
}

// Export functions as an object for backward compatibility
export const setupService = {
  createTenant,
  createAdmin,
  createProfile,
  getDefaultTenantMetadata,
  createTenantWithDefaults,
  isSetupCompleted
}
