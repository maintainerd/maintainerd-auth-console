/**
 * Role API Types
 */

import type { StatusType } from '@/types/status'

/**
 * Role status type - defines valid statuses for Roles only
 */
export type RoleStatusType = Extract<StatusType, 'active' | 'inactive'>

/**
 * Role type
 */
export type RoleType = {
  role_id: string
  name: string
  description: string
  is_default: boolean
  is_system: boolean
  status: RoleStatusType
  created_at: string
  updated_at: string
}

/**
 * Role list query parameters interface
 */
export interface RoleQueryParamsInterface {
  name?: string
  description?: string
  is_default?: boolean
  is_system?: boolean
  status?: string
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

/**
 * Paginated Role list response interface
 */
export interface RoleListResponseInterface {
  rows: RoleType[]
  total: number
  page: number
  limit: number
  total_pages: number
}

/**
 * Single Role response interface
 */
export interface RoleResponseInterface {
  role_id: string
  name: string
  description: string
  is_default: boolean
  is_system: boolean
  status: RoleStatusType
  created_at: string
  updated_at: string
}

/**
 * Create Role request interface
 */
export interface CreateRoleRequestInterface {
  name: string
  description: string
  status: RoleStatusType
}

/**
 * Update Role request interface
 */
export interface UpdateRoleRequestInterface {
  name: string
  description: string
  status: RoleStatusType
}

/**
 * Update Role status request interface
 */
export interface UpdateRoleStatusRequestInterface {
  status: RoleStatusType
}

/**
 * Role permissions list response interface
 */
export interface RolePermissionsListResponseInterface {
  rows: RolePermissionEntity[]
  total: number
  page: number
  limit: number
  total_pages: number
}

/**
 * Role permission entity
 */
export interface RolePermissionEntity {
  permission_id: string
  name: string
  description: string
  api?: {
    api_id: string
    name: string
    display_name: string
    description: string
    api_type: string
    identifier: string
    status: string
    is_default: boolean
    is_system: boolean
    created_at: string
    updated_at: string
  }
  status: string
  is_default: boolean
  is_system: boolean
  created_at: string
  updated_at: string
}

/**
 * Add permissions to role request interface
 */
export interface AddRolePermissionsRequestInterface {
  permissions: string[]
}
