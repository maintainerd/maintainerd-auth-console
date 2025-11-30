/**
 * Permission Service
 * Service layer for permission-related API calls
 */

import { get, post, put, deleteRequest } from '../client'
import { API_ENDPOINTS } from '../config'
import type { ApiResponse } from '../types/common'
import type {
  PermissionQueryParamsInterface,
  PermissionListResponseInterface,
  PermissionEntity,
  CreatePermissionRequestInterface,
  UpdatePermissionRequestInterface,
  UpdatePermissionStatusRequestInterface,
} from './types'

/**
 * Fetch permissions with optional filters and pagination
 */
export async function fetchPermissions(params?: PermissionQueryParamsInterface): Promise<PermissionListResponseInterface> {
  const queryParams = new URLSearchParams()

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value))
      }
    })
  }

  const endpoint = `${API_ENDPOINTS.PERMISSION}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await get<ApiResponse<PermissionListResponseInterface>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch permissions')
}

/**
 * Fetch a single permission by ID
 */
export async function fetchPermissionById(permissionId: string): Promise<PermissionEntity> {
  const endpoint = `${API_ENDPOINTS.PERMISSION}/${permissionId}`
  const response = await get<ApiResponse<PermissionEntity>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch permission')
}

/**
 * Create a new permission
 */
export async function createPermission(data: CreatePermissionRequestInterface): Promise<PermissionEntity> {
  const endpoint = API_ENDPOINTS.PERMISSION
  const response = await post<ApiResponse<PermissionEntity>>(endpoint, data)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to create permission')
}

/**
 * Update an existing permission
 */
export async function updatePermission(permissionId: string, data: UpdatePermissionRequestInterface): Promise<PermissionEntity> {
  const endpoint = `${API_ENDPOINTS.PERMISSION}/${permissionId}`
  const response = await put<ApiResponse<PermissionEntity>>(endpoint, data)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to update permission')
}

/**
 * Delete a permission
 */
export async function deletePermission(permissionId: string): Promise<void> {
  const endpoint = `${API_ENDPOINTS.PERMISSION}/${permissionId}`
  const response = await deleteRequest<ApiResponse<void>>(endpoint)

  if (!response.success) {
    throw new Error(response.message || 'Failed to delete permission')
  }
}

/**
 * Update permission status
 */
export async function updatePermissionStatus(permissionId: string, data: UpdatePermissionStatusRequestInterface): Promise<PermissionEntity> {
  const endpoint = `${API_ENDPOINTS.PERMISSION}/${permissionId}/status`
  const response = await put<ApiResponse<PermissionEntity>>(endpoint, data)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to update permission status')
}

// Export as permission object
export const permissionService = {
  fetchPermissions,
  fetchPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
  updatePermissionStatus,
}

