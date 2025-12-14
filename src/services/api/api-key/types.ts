/**
 * API Key API Types
 */

import type { StatusType } from '@/types/status'

/**
 * API Key status type - defines valid statuses for API keys
 */
export type ApiKeyStatusType = Extract<StatusType, 'active' | 'inactive'> | 'expired'

/**
 * API Key type
 */
export type ApiKeyType = {
  api_key_id: string
  name: string
  description: string
  key_prefix: string
  expires_at: string | null
  rate_limit: number
  status: ApiKeyStatusType
  created_at: string
  updated_at: string
}

/**
 * API Key list query parameters interface
 */
export interface ApiKeyQueryParamsInterface {
  name?: string
  description?: string
  status?: string
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

/**
 * Paginated API Key list response interface
 */
export interface ApiKeyListResponseInterface {
  rows: ApiKeyType[]
  total: number
  page: number
  limit: number
  total_pages: number
}

/**
 * API Key response (single API key)
 */
export interface ApiKeyResponseInterface {
  api_key: ApiKeyType
}

/**
 * Create API Key response - includes the full API key (only shown once)
 */
export interface CreateApiKeyResponseInterface {
  api_key_id: string
  name: string
  description: string
  key_prefix: string
  key: string // Full API key - only returned on creation
  expires_at: string | null
  last_used_at: string | null
  usage_count: number
  rate_limit: number
  status: ApiKeyStatusType
  created_at: string
  updated_at: string
}

/**
 * Create API Key request
 */
export interface CreateApiKeyRequestInterface {
  name: string
  description: string
  config?: Record<string, unknown>
  expires_at?: string | null
  rate_limit?: number
  status?: ApiKeyStatusType
}

/**
 * Update API Key request
 */
export interface UpdateApiKeyRequestInterface {
  name?: string
  description?: string
  config?: Record<string, unknown>
  expires_at?: string | null
  rate_limit?: number
  status?: ApiKeyStatusType
}

/**
 * Update API Key status request
 * Note: Only 'active' and 'inactive' can be set manually.
 * 'expired' status is set automatically by the backend based on expires_at date.
 */
export interface UpdateApiKeyStatusRequestInterface {
  status: Extract<StatusType, 'active' | 'inactive'>
}

/**
 * API Key config type - can contain any key-value pairs
 * The API returns the config directly, not wrapped in a config property
 */
export type ApiKeyConfigType = Record<string, unknown>

/**
 * API Key API permission type
 */
export type ApiKeyApiPermissionType = {
  permission_id: string
  name: string
  description: string
  status: string
  is_default: boolean
  is_system: boolean
  created_at: string
  updated_at: string
}

/**
 * API Key API type
 */
export type ApiKeyApiType = {
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

/**
 * API Key API item type (API with its details directly in the response)
 */
export type ApiKeyApiItemType = {
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

/**
 * API Key APIs response interface
 */
export interface ApiKeyApisResponseInterface {
  rows: ApiKeyApiItemType[]
  total: number
  page: number
  limit: number
  total_pages: number
}

/**
 * API Key API permissions response interface
 */
export interface ApiKeyApiPermissionsResponseInterface {
  permissions: ApiKeyApiPermissionType[]
}

/**
 * Add APIs to API key request interface
 */
export interface AddApiKeyApisRequestInterface {
  api_uuids: string[]
}

/**
 * Add permissions to API key API request interface
 */
export interface AddApiKeyApiPermissionsRequestInterface {
  permission_uuids: string[]
}

