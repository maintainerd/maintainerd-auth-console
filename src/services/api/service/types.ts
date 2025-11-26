/**
 * Service API Types
 */

import type { StatusType } from '@/types/status'

/**
 * Service status type - defines valid statuses for services only
 */
export type ServiceStatusType = Extract<StatusType, 'active' | 'maintenance' | 'deprecated' | 'inactive'>

/**
 * Service type
 */
export type ServiceType = {
  service_id: string
  name: string
  display_name: string
  description: string
  version: string
  status: ServiceStatusType
  is_public: boolean
  is_default: boolean
  is_system: boolean
  api_count: number
  policy_count: number
  created_at: string
  updated_at: string
}

/**
 * Service list query parameters interface
 */
export interface ServiceQueryParamsInterface {
  name?: string
  display_name?: string
  description?: string
  version?: string
  status?: string
  is_default?: boolean
  is_system?: boolean
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

/**
 * Paginated service list response interface
 */
export interface ServiceListResponseInterface {
  rows: ServiceType[]
  total: number
  page: number
  limit: number
  total_pages: number
}

