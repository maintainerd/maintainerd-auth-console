/**
 * Role API
 * Handles Role-related API calls
 */

import { get, post, put, deleteRequest } from '../client'
import { API_ENDPOINTS } from '../config'
import type { ApiResponse } from '../types'
import type {
  RoleListResponseInterface,
  RoleQueryParamsInterface,
  RoleResponseInterface,
  CreateRoleRequestInterface,
  UpdateRoleRequestInterface,
  UpdateRoleStatusRequestInterface,
  RolePermissionsListResponseInterface,
  AddRolePermissionsRequestInterface
} from './types'

/**
 * Fetch Roles with optional filters and pagination
 */
export async function fetchRoles(params?: RoleQueryParamsInterface): Promise<RoleListResponseInterface> {
  const queryParams = new URLSearchParams()

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value))
      }
    })
  }

  const endpoint = `${API_ENDPOINTS.ROLE}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await get<ApiResponse<RoleListResponseInterface>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch Roles')
}

/**
 * Fetch a single Role by ID
 */
export async function fetchRoleById(roleId: string): Promise<RoleResponseInterface> {
  const endpoint = `${API_ENDPOINTS.ROLE}/${roleId}`
  const response = await get<ApiResponse<RoleResponseInterface>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch Role')
}

/**
 * Create a new Role
 */
export async function createRole(data: CreateRoleRequestInterface): Promise<RoleResponseInterface> {
  const response = await post<ApiResponse<RoleResponseInterface>>(API_ENDPOINTS.ROLE, data)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to create Role')
}

/**
 * Update an existing Role
 */
export async function updateRole(
  roleId: string,
  data: UpdateRoleRequestInterface
): Promise<RoleResponseInterface> {
  const endpoint = `${API_ENDPOINTS.ROLE}/${roleId}`
  const response = await put<ApiResponse<RoleResponseInterface>>(endpoint, data)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to update Role')
}

/**
 * Delete a Role
 */
export async function deleteRole(roleId: string): Promise<void> {
  const endpoint = `${API_ENDPOINTS.ROLE}/${roleId}`
  const response = await deleteRequest<ApiResponse<void>>(endpoint)

  if (!response.success) {
    throw new Error(response.message || 'Failed to delete Role')
  }
}

/**
 * Update Role status
 */
export async function updateRoleStatus(
  roleId: string,
  data: UpdateRoleStatusRequestInterface
): Promise<RoleResponseInterface> {
  const endpoint = `${API_ENDPOINTS.ROLE}/${roleId}/status`
  const response = await put<ApiResponse<RoleResponseInterface>>(endpoint, data)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to update Role status')
}

/**
 * Fetch permissions for a specific role
 */
export async function fetchRolePermissions(
  roleId: string,
  params?: {
    status?: string
    page?: number
    limit?: number
    sort_by?: string
    sort_order?: 'asc' | 'desc'
  }
): Promise<RolePermissionsListResponseInterface> {
  const queryParams = new URLSearchParams()

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value))
      }
    })
  }

  const endpoint = `${API_ENDPOINTS.ROLE}/${roleId}/permissions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await get<ApiResponse<RolePermissionsListResponseInterface>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch role permissions')
}

/**
 * Add permissions to a role
 */
export async function addRolePermissions(
  roleId: string,
  data: AddRolePermissionsRequestInterface
): Promise<void> {
  const endpoint = `${API_ENDPOINTS.ROLE}/${roleId}/permissions`
  const response = await post<ApiResponse<void>>(endpoint, data)

  if (!response.success) {
    throw new Error(response.message || 'Failed to add permissions to role')
  }
}

/**
 * Remove a permission from a role
 */
export async function removeRolePermission(
  roleId: string,
  permissionId: string
): Promise<void> {
  const endpoint = `${API_ENDPOINTS.ROLE}/${roleId}/permissions/${permissionId}`
  const response = await deleteRequest<ApiResponse<void>>(endpoint)

  if (!response.success) {
    throw new Error(response.message || 'Failed to remove permission from role')
  }
}
