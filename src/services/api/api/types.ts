/**
 * API API Types
 */

import type { Status } from '@/types/status'
import type { Service } from '../services/types'

/**
 * API status type - defines valid statuses for APIs only
 */
export type ApiStatus = Extract<Status, 'active' | 'inactive'>

/**
 * API type enum
 */
export type ApiType = 'rest' | 'grpc' | 'graphql' | 'soap' | 'webhook' | 'websocket' | 'rpc'

/**
 * API type
 */
export type Api = {
  api_id: string
  name: string
  display_name: string
  description: string
  api_type: ApiType
  identifier: string
  service: Service
  status: ApiStatus
  is_default: boolean
  is_system: boolean
  created_at: string
  updated_at: string
}

/**
 * API list query parameters interface
 */
export interface ApiQueryParams {
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
export interface ApiListResponse {
  rows: Api[]
  total: number
  page: number
  limit: number
  total_pages: number
}

/**
 * Create API request interface
 */
export interface CreateApiRequest {
  name: string
  display_name: string
  description: string
  api_type: ApiType
  service_id: string
  status: ApiStatus
}

/**
 * Update API request interface
 */
export interface UpdateApiRequest {
  name: string
  display_name: string
  description: string
  api_type: ApiType
  status: ApiStatus
  service_id: string
}

/**
 * Update API status request interface
 */
export interface UpdateApiStatusRequest {
  status: ApiStatus
}

