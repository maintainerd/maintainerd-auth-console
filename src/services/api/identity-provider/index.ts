/**
 * Identity Provider API
 * Handles identity provider-related API calls
 */

import { get, post, put, deleteRequest } from '../client'
import { API_ENDPOINTS } from '../config'
import type { ApiResponse } from '../types'
import type {
  IdentityProviderListResponseInterface,
  IdentityProviderQueryParamsInterface,
  IdentityProviderResponseInterface,
  IdentityProviderDetailResponseInterface,
  CreateIdentityProviderRequestInterface,
  UpdateIdentityProviderRequestInterface,
  UpdateIdentityProviderStatusRequestInterface
} from './types'

/**
 * Fetch identity providers with optional filters and pagination
 */
export async function fetchIdentityProviders(params?: IdentityProviderQueryParamsInterface): Promise<IdentityProviderListResponseInterface> {
  const queryParams = new URLSearchParams()

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value))
      }
    })
  }

  const endpoint = `${API_ENDPOINTS.IDENTITY_PROVIDER}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await get<ApiResponse<IdentityProviderListResponseInterface>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch identity providers')
}

/**
 * Fetch a single identity provider by ID
 */
export async function fetchIdentityProviderById(identityProviderId: string): Promise<IdentityProviderDetailResponseInterface> {
  const endpoint = `${API_ENDPOINTS.IDENTITY_PROVIDER}/${identityProviderId}`
  const response = await get<ApiResponse<IdentityProviderDetailResponseInterface>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch identity provider')
}

/**
 * Create a new identity provider
 */
export async function createIdentityProvider(data: CreateIdentityProviderRequestInterface): Promise<IdentityProviderResponseInterface> {
  const endpoint = API_ENDPOINTS.IDENTITY_PROVIDER
  const response = await post<ApiResponse<IdentityProviderResponseInterface>>(endpoint, data)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to create identity provider')
}

/**
 * Update an existing identity provider
 */
export async function updateIdentityProvider(identityProviderId: string, data: UpdateIdentityProviderRequestInterface): Promise<IdentityProviderResponseInterface> {
  const endpoint = `${API_ENDPOINTS.IDENTITY_PROVIDER}/${identityProviderId}`
  const response = await put<ApiResponse<IdentityProviderResponseInterface>>(endpoint, data)

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
export async function updateIdentityProviderStatus(identityProviderId: string, data: UpdateIdentityProviderStatusRequestInterface): Promise<IdentityProviderResponseInterface> {
  const endpoint = `${API_ENDPOINTS.IDENTITY_PROVIDER}/${identityProviderId}/status`
  const response = await put<ApiResponse<IdentityProviderResponseInterface>>(endpoint, data)

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

