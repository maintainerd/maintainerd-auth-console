/**
 * API API Types
 */

import type { StatusType } from '@/types/status'
import type { ServiceType } from '../service/types'

/**
 * API status type - defines valid statuses for APIs only
 */
export type ApiStatusType = Extract<StatusType, 'active' | 'inactive'>

/**
 * API type enum
 */
export type ApiTypeEnum = 'rest' | 'grpc' | 'graphql' | 'soap' | 'webhook' | 'websocket' | 'rpc'

/**
 * API type
 */
export type ApiType = {
  api_id: string
  name: string
  display_name: string
  description: string
  api_type: ApiTypeEnum
  identifier: string
  service: ServiceType
  status: ApiStatusType
  is_default: boolean
  is_system: boolean
  created_at: string
  updated_at: string
}

/**
 * API list query parameters interface
 */
export interface ApiQueryParamsInterface {
  name?: string
  display_name?: string
  description?: string
  api_type?: string
  identifier?: string
  service_id?: string
  is_default?: boolean
  status?: string
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

/**
 * Paginated API list response interface
 */
export interface ApiListResponseInterface {
  rows: ApiType[]
  total: number
  page: number
  limit: number
  total_pages: number
}

/**
 * Single API response interface
 */
export interface ApiResponseInterface {
  api_id: string
  name: string
  display_name: string
  description: string
  api_type: ApiTypeEnum
  identifier: string
  service: ServiceType
  status: ApiStatusType
  is_default: boolean
  is_system: boolean
  created_at: string
  updated_at: string
}

/**
 * Create API request interface
 */
export interface CreateApiRequestInterface {
  name: string
  display_name: string
  description: string
  api_type: ApiTypeEnum
  service_id: string
  status: ApiStatusType
}

/**
 * Update API request interface
 */
export interface UpdateApiRequestInterface {
  name: string
  display_name: string
  description: string
  api_type: ApiTypeEnum
  status: ApiStatusType
  service_id: string
}

/**
 * Update API status request interface
 */
export interface UpdateApiStatusRequestInterface {
  status: ApiStatusType
}

