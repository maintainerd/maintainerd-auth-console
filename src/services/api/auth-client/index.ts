/**
 * Client API Service
 * Service for managing client-related API calls
 */

import { get, post, put, deleteRequest } from '../client'
import { API_ENDPOINTS } from '../config'
import type { ApiResponse } from '../types'
import type {
  ClientQueryParamsInterface,
  ClientListResponseInterface,
  ClientResponseInterface,
  CreateClientRequestInterface,
  UpdateClientRequestInterface,
  UpdateClientStatusRequestInterface,
  ClientSecretType,
  ClientConfigType,
  ClientUrisResponseInterface,
  ClientUriType,
  CreateClientUriRequestInterface,
  UpdateClientUriRequestInterface,
  ClientApisResponseInterface,
  AddClientApisRequestInterface,
  AddClientApiPermissionsRequestInterface,
} from './types'

/**
 * Fetch clients with optional filters and pagination
 */
export async function fetchClients(params?: ClientQueryParamsInterface): Promise<ClientListResponseInterface> {
  const queryParams = new URLSearchParams()

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value))
      }
    })
  }

  const endpoint = `${API_ENDPOINTS.CLIENT}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await get<ApiResponse<ClientListResponseInterface>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch clients')
}

/**
 * Fetch a single client by ID
 */
export async function fetchClientById(clientId: string): Promise<ClientResponseInterface> {
  const endpoint = `${API_ENDPOINTS.CLIENT}/${clientId}`
  const response = await get<ApiResponse<ClientResponseInterface>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch client')
}

/**
 * Create a new client
 */
export async function createClient(data: CreateClientRequestInterface): Promise<ClientResponseInterface> {
  const endpoint = API_ENDPOINTS.CLIENT
  const response = await post<ApiResponse<ClientResponseInterface>>(endpoint, data)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to create client')
}

/**
 * Update an existing client
 */
export async function updateClient(clientId: string, data: UpdateClientRequestInterface): Promise<ClientResponseInterface> {
  const endpoint = `${API_ENDPOINTS.CLIENT}/${clientId}`
  const response = await put<ApiResponse<ClientResponseInterface>>(endpoint, data)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to update client')
}

/**
 * Delete a client
 */
export async function deleteClient(clientId: string): Promise<void> {
  const endpoint = `${API_ENDPOINTS.CLIENT}/${clientId}`
  const response = await deleteRequest<ApiResponse<void>>(endpoint)

  if (!response.success) {
    throw new Error(response.message || 'Failed to delete client')
  }
}

/**
 * Update client status
 */
export async function updateClientStatus(clientId: string, data: UpdateClientStatusRequestInterface): Promise<ClientResponseInterface> {
  const endpoint = `${API_ENDPOINTS.CLIENT}/${clientId}/status`
  const response = await put<ApiResponse<ClientResponseInterface>>(endpoint, data)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to update client status')
}

/**
 * Fetch client secret by ID
 */
export async function fetchClientSecret(clientId: string): Promise<ClientSecretType> {
  const endpoint = `${API_ENDPOINTS.CLIENT}/${clientId}/secret`
  const response = await get<ApiResponse<ClientSecretType>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch client secret')
}

/**
 * Fetch client config by ID
 */
export async function fetchClientConfig(clientId: string): Promise<ClientConfigType> {
  const endpoint = `${API_ENDPOINTS.CLIENT}/${clientId}/config`
  const response = await get<ApiResponse<ClientConfigType>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch client config')
}

/**
 * Fetch client URIs by client ID
 */
export async function fetchClientUris(clientId: string): Promise<ClientUrisResponseInterface> {
  const endpoint = `${API_ENDPOINTS.CLIENT}/${clientId}/uris`
  const response = await get<ApiResponse<ClientUrisResponseInterface>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch client URIs')
}

/**
 * Create a new client URI
 */
export async function createClientUri(clientId: string, data: CreateClientUriRequestInterface): Promise<ClientUriType> {
  const endpoint = `${API_ENDPOINTS.CLIENT}/${clientId}/uris`
  const response = await post<ApiResponse<ClientUriType>>(endpoint, data)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to create client URI')
}

/**
 * Update an existing client URI
 */
export async function updateClientUri(clientId: string, clientUriId: string, data: UpdateClientUriRequestInterface): Promise<ClientUriType> {
  const endpoint = `${API_ENDPOINTS.CLIENT}/${clientId}/uris/${clientUriId}`
  const response = await put<ApiResponse<ClientUriType>>(endpoint, data)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to update client URI')
}

/**
 * Delete a client URI
 */
export async function deleteClientUri(clientId: string, clientUriId: string): Promise<void> {
  const endpoint = `${API_ENDPOINTS.CLIENT}/${clientId}/uris/${clientUriId}`
  const response = await deleteRequest<ApiResponse<void>>(endpoint)

  if (!response.success) {
    throw new Error(response.message || 'Failed to delete client URI')
  }
}

/**
 * Fetch client APIs by client ID
 */
export async function fetchClientApis(clientId: string): Promise<ClientApisResponseInterface> {
  const response = await get<ApiResponse<ClientApisResponseInterface>>(
    `${API_ENDPOINTS.CLIENT}/${clientId}/apis`
  )

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch client APIs')
}

/**
 * Add APIs to a client
 */
export async function addClientApis(clientId: string, data: AddClientApisRequestInterface): Promise<void> {
  const response = await post<ApiResponse<void>>(
    `${API_ENDPOINTS.CLIENT}/${clientId}/apis`,
    data
  )

  if (!response.success) {
    throw new Error(response.message || 'Failed to add APIs to client')
  }
}

/**
 * Remove an API from a client
 */
export async function removeClientApi(clientId: string, apiId: string): Promise<void> {
  const response = await deleteRequest<ApiResponse<void>>(
    `${API_ENDPOINTS.CLIENT}/${clientId}/apis/${apiId}`
  )

  if (!response.success) {
    throw new Error(response.message || 'Failed to remove API from client')
  }
}

/**
 * Add permissions to a client API
 */
export async function addClientApiPermissions(
  clientId: string,
  apiId: string,
  data: AddClientApiPermissionsRequestInterface
): Promise<void> {
  const response = await post<ApiResponse<void>>(
    `${API_ENDPOINTS.CLIENT}/${clientId}/apis/${apiId}/permissions`,
    data
  )

  if (!response.success) {
    throw new Error(response.message || 'Failed to add permissions to client API')
  }
}

/**
 * Remove a permission from a client API
 */
export async function removeClientApiPermission(
  clientId: string,
  apiId: string,
  permissionId: string
): Promise<void> {
  const response = await deleteRequest<ApiResponse<void>>(
    `${API_ENDPOINTS.CLIENT}/${clientId}/apis/${apiId}/permissions/${permissionId}`
  )

  if (!response.success) {
    throw new Error(response.message || 'Failed to remove permission from client API')
  }
}

// Export as client object
export const clientService = {
  fetchClients,
  fetchClientById,
  createClient,
  updateClient,
  deleteClient,
  updateClientStatus,
  fetchClientSecret,
  fetchClientConfig,
  fetchClientUris,
  createClientUri,
  updateClientUri,
  deleteClientUri,
  fetchClientApis,
  addClientApis,
  removeClientApi,
  addClientApiPermissions,
  removeClientApiPermission,
}

