/**
 * API Key API Service
 * Service for managing API key-related API calls
 */

import { get, post, put, deleteRequest } from '../client'
import { API_ENDPOINTS } from '../config'
import type { ApiResponse } from '../types'
import type {
  ApiKeyListResponse,
  ApiKeyQueryParams,
  ApiKey,
  CreateApiKeyRequest,
  CreateApiKeyResponse,
  UpdateApiKeyRequest,
  UpdateApiKeyStatusRequest,
  ApiKeyConfig,
  ApiKeyApisResponse,
  ApiKeyApiPermissionsResponse,
  AddApiKeyApisRequest,
  AddApiKeyApiPermissionsRequest
} from './types'

/**
 * Fetch API keys with optional filters and pagination
 */
export async function fetchApiKeys(params?: ApiKeyQueryParams): Promise<ApiKeyListResponse> {
  const queryParams = new URLSearchParams()

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value))
      }
    })
  }

  const endpoint = `${API_ENDPOINTS.API_KEY}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await get<ApiResponse<ApiKeyListResponse>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch API keys')
}

/**
 * Fetch a single API key by ID
 */
export async function fetchApiKeyById(apiKeyId: string): Promise<ApiKey> {
  const endpoint = `${API_ENDPOINTS.API_KEY}/${apiKeyId}`
  const response = await get<ApiResponse<ApiKey>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch API key')
}

/**
 * Create a new API key
 * Returns the full API key including the secret key (only shown once)
 */
export async function createApiKey(data: CreateApiKeyRequest): Promise<CreateApiKeyResponse> {
  const endpoint = API_ENDPOINTS.API_KEY
  const response = await post<ApiResponse<CreateApiKeyResponse>>(endpoint, data)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to create API key')
}

/**
 * Update an existing API key
 */
export async function updateApiKey(apiKeyId: string, data: UpdateApiKeyRequest): Promise<ApiKey> {
  const endpoint = `${API_ENDPOINTS.API_KEY}/${apiKeyId}`
  const response = await put<ApiResponse<ApiKey>>(endpoint, data)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to update API key')
}

/**
 * Delete an API key
 */
export async function deleteApiKey(apiKeyId: string): Promise<void> {
  const endpoint = `${API_ENDPOINTS.API_KEY}/${apiKeyId}`
  const response = await deleteRequest<ApiResponse<void>>(endpoint)

  if (!response.success) {
    throw new Error(response.message || 'Failed to delete API key')
  }
}

/**
 * Update API key status
 */
export async function updateApiKeyStatus(apiKeyId: string, data: UpdateApiKeyStatusRequest): Promise<ApiKey> {
  const endpoint = `${API_ENDPOINTS.API_KEY}/${apiKeyId}/status`
  const response = await put<ApiResponse<ApiKey>>(endpoint, data)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to update API key status')
}

/**
 * Fetch API key config
 */
export async function fetchApiKeyConfig(apiKeyId: string): Promise<ApiKeyConfig> {
  const endpoint = `${API_ENDPOINTS.API_KEY}/${apiKeyId}/config`
  const response = await get<ApiResponse<ApiKeyConfig>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch API key config')
}

/**
 * Fetch API key APIs
 */
export async function fetchApiKeyApis(apiKeyId: string): Promise<ApiKeyApisResponse> {
  const response = await get<ApiResponse<ApiKeyApisResponse>>(
    `${API_ENDPOINTS.API_KEY}/${apiKeyId}/apis`
  )

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch API key APIs')
}

/**
 * Add APIs to an API key
 */
export async function addApiKeyApis(apiKeyId: string, data: AddApiKeyApisRequest): Promise<void> {
  const response = await post<ApiResponse<void>>(
    `${API_ENDPOINTS.API_KEY}/${apiKeyId}/apis`,
    data
  )

  if (!response.success) {
    throw new Error(response.message || 'Failed to add APIs to API key')
  }
}

/**
 * Remove an API from an API key
 */
export async function removeApiKeyApi(apiKeyId: string, apiId: string): Promise<void> {
  const response = await deleteRequest<ApiResponse<void>>(
    `${API_ENDPOINTS.API_KEY}/${apiKeyId}/apis/${apiId}`
  )

  if (!response.success) {
    throw new Error(response.message || 'Failed to remove API from API key')
  }
}

/**
 * Fetch API key API permissions
 */
export async function fetchApiKeyApiPermissions(
  apiKeyId: string,
  apiId: string
): Promise<ApiKeyApiPermissionsResponse> {
  const response = await get<ApiResponse<ApiKeyApiPermissionsResponse>>(
    `${API_ENDPOINTS.API_KEY}/${apiKeyId}/apis/${apiId}/permissions`
  )

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch API key API permissions')
}

/**
 * Add permissions to an API key API
 */
export async function addApiKeyApiPermissions(
  apiKeyId: string,
  apiId: string,
  data: AddApiKeyApiPermissionsRequest
): Promise<void> {
  const response = await post<ApiResponse<void>>(
    `${API_ENDPOINTS.API_KEY}/${apiKeyId}/apis/${apiId}/permissions`,
    data
  )

  if (!response.success) {
    throw new Error(response.message || 'Failed to add permissions to API key API')
  }
}

/**
 * Remove a permission from an API key API
 */
export async function removeApiKeyApiPermission(
  apiKeyId: string,
  apiId: string,
  permissionId: string
): Promise<void> {
  const response = await deleteRequest<ApiResponse<void>>(
    `${API_ENDPOINTS.API_KEY}/${apiKeyId}/apis/${apiId}/permissions/${permissionId}`
  )

  if (!response.success) {
    throw new Error(response.message || 'Failed to remove permission from API key API')
  }
}

