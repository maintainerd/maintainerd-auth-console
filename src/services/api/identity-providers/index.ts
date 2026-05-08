/**
 * Identity Provider API
 * Handles identity provider-related API calls
 */

import { get, post, put, deleteRequest } from '../client'
import { API_ENDPOINTS } from '../config'
import type { ApiResponse } from '../types'
import type {
  IdentityProviderListResponse,
  IdentityProviderQueryParams,
  IdentityProviderResponse,
  IdentityProviderDetailResponse,
  CreateIdentityProviderRequest,
  UpdateIdentityProviderRequest,
  UpdateIdentityProviderStatusRequest
} from './types'

/**
 * Fetch identity providers with optional filters and pagination
 */
export async function fetchIdentityProviders(params?: IdentityProviderQueryParams): Promise<IdentityProviderListResponse> {
  const queryParams = new URLSearchParams()

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value))
      }
    })
  }

  const endpoint = `${API_ENDPOINTS.IDENTITY_PROVIDER}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await get<ApiResponse<IdentityProviderListResponse>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch identity providers')
}

/**
 * Fetch a single identity provider by ID
 */
export async function fetchIdentityProviderById(identityProviderId: string): Promise<IdentityProviderDetailResponse> {
  const endpoint = `${API_ENDPOINTS.IDENTITY_PROVIDER}/${identityProviderId}`
  const response = await get<ApiResponse<IdentityProviderDetailResponse>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch identity provider')
}

/**
 * Create a new identity provider
 */
export async function createIdentityProvider(data: CreateIdentityProviderRequest): Promise<IdentityProviderResponse> {
  const endpoint = API_ENDPOINTS.IDENTITY_PROVIDER
  const response = await post<ApiResponse<IdentityProviderResponse>>(endpoint, data)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to create identity provider')
}

/**
 * Update an existing identity provider
 */
export async function updateIdentityProvider(identityProviderId: string, data: UpdateIdentityProviderRequest): Promise<IdentityProviderResponse> {
  const endpoint = `${API_ENDPOINTS.IDENTITY_PROVIDER}/${identityProviderId}`
  const response = await put<ApiResponse<IdentityProviderResponse>>(endpoint, data)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to update identity provider')
}

/**
 * Delete an identity provider
 */
export async function deleteIdentityProvider(identityProviderId: string): Promise<void> {
  const endpoint = `${API_ENDPOINTS.IDENTITY_PROVIDER}/${identityProviderId}`
  const response = await deleteRequest<ApiResponse<void>>(endpoint)

  if (!response.success) {
    throw new Error(response.message || 'Failed to delete identity provider')
  }
}

/**
 * Update identity provider status
 */
export async function updateIdentityProviderStatus(identityProviderId: string, data: UpdateIdentityProviderStatusRequest): Promise<IdentityProviderResponse> {
  const endpoint = `${API_ENDPOINTS.IDENTITY_PROVIDER}/${identityProviderId}/status`
  const response = await put<ApiResponse<IdentityProviderResponse>>(endpoint, data)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to update identity provider status')
}

// Export as identity provider object
export const identityProviderService = {
  fetchIdentityProviders,
  fetchIdentityProviderById,
  createIdentityProvider,
  updateIdentityProvider,
  deleteIdentityProvider,
  updateIdentityProviderStatus,
}

