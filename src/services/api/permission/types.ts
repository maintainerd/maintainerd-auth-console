/**
 * Permission API Types
 * Type definitions for permission-related API requests and responses
 */

import type { ApiType } from '../api/types'
import type { StatusType } from '../types/common'

/**
 * Permission status type
 */
export type PermissionStatusType = Extract<StatusType, 'active' | 'inactive'>

/**
 * Permission entity from API
 */
export interface PermissionEntity {
  permission_id: string
  name: string
  description: string
  api: ApiType
  status: PermissionStatusType
  is_default: boolean
  is_system: boolean
  created_at: string
  updated_at: string
}

/**
 * Permission query parameters
 */
export interface PermissionQueryParamsInterface {
  name?: string
  description?: string
  api_id?: string
  role_id?: string
  client_id?: string
  is_active?: boolean
  is_default?: boolean
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

/**
 * Permission list response
 */
export interface PermissionListResponseInterface {
  rows: PermissionEntity[]
  total: number
  page: number
  limit: number
  total_pages: number
}

/**
 * Permission response (single permission)
 */
export interface PermissionResponseInterface {
  permission: PermissionEntity
}

/**
 * Create permission request
 */
export interface CreatePermissionRequestInterface {
  name: string
  description: string
  api_id: string
  status?: PermissionStatusType
}

/**
 * Update permission request
 */
export interface UpdatePermissionRequestInterface {
  name?: string
  description?: string
  status?: PermissionStatusType
}

/**
 * Update permission status request
 */
export interface UpdatePermissionStatusRequestInterface {
  status: PermissionStatusType
}

