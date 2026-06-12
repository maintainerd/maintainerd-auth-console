/**
 * API Key API Types
 */

import type { Status } from '@/types/status'

/**
 * API Key status type - defines valid statuses for API keys
 */
export type ApiKeyStatus = Extract<Status, 'active' | 'inactive'> | 'expired'

/**
 * API Key type
 */
export type ApiKey = {
  api_key_id: string
  name: string
  description: string
  key_prefix: string
  expires_at: string | null
  rate_limit: number
  status: ApiKeyStatus
  created_at: string
  updated_at: string
}

/**
 * API Key list query parameters interface
 */
export interface ApiKeyQueryParams {
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
export interface ApiKeyListResponse {
  rows: ApiKey[]
  total: number
  page: number
  limit: number
  total_pages: number
}

/**
 * API Key response (single API key)
 */
export interface ApiKeyResponse {
  api_key: ApiKey
}

/**
 * Create API Key response - includes the full API key (only shown once)
 */
export interface CreateApiKeyResponse {
  api_key_id: string
  name: string
  description: string
  key_prefix: string
  key: string // Full API key - only returned on creation
  expires_at: string | null
  last_used_at: string | null
  usage_count: number
  rate_limit: number
  status: ApiKeyStatus
  created_at: string
  updated_at: string
}

/**
 * Create API Key request
 */
export interface CreateApiKeyRequest {
  name: string
  description: string
  config?: Record<string, unknown>
  expires_at?: string | null
  rate_limit?: number
  status?: ApiKeyStatus
}

/**
 * Update API Key request
 */
export interface UpdateApiKeyRequest {
  name?: string
  description?: string
  config?: Record<string, unknown>
  expires_at?: string | null
  rate_limit?: number
  status?: ApiKeyStatus
}

/**
 * Update API Key status request
 * Note: Only 'active' and 'inactive' can be set manually.
 * 'expired' status is set automatically by the backend based on expires_at date.
 */
export interface UpdateApiKeyStatusRequest {
  status: Extract<Status, 'active' | 'inactive'>
}

/**
 * API Key config type - can contain any key-value pairs
 * The API returns the config directly, not wrapped in a config property
 */
export type ApiKeyConfig = Record<string, unknown>

/**
 * API Key API permission type
 */
export type ApiKeyApiPermission = {
  permission_id: string
  name: string
  description: string
  status: string
  is_system: boolean
  created_at: string
  updated_at: string
}

/**
 * API key API entity
 */
export type ApiKeyApi = {
  api_id: string
  name: string
  display_name: string
  description: string
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
export type ApiKeyApiItem = {
  api_id: string
  name: string
  display_name: string
  description: string
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
export interface ApiKeyApisResponse {
  rows: ApiKeyApiItem[]
  total: number
  page: number
  limit: number
  total_pages: number
}

/**
 * API Key API permissions response interface
 */
export interface ApiKeyApiPermissionsResponse {
  permissions: ApiKeyApiPermission[]
}

/**
 * Add APIs to API key request interface
 */
export interface AddApiKeyApisRequest {
  api_uuids: string[]
}

/**
 * Add permissions to API key API request interface
 */
export interface AddApiKeyApiPermissionsRequest {
  permission_uuids: string[]
}
