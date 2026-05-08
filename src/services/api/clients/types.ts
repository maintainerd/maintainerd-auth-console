/**
 * Client API Types
 */

import type { Status } from '@/types/status'

/**
 * Client secret response type
 */
export type ClientSecret = {
  client_id: string
  client_secret: string
}

/**
 * Client config type (dynamic fields)
 */
export type ClientConfig = {
  config: Record<string, any>
}

/**
 * Client status type - defines valid statuses for clients only
 */
export type ClientStatus = Extract<Status, 'active' | 'inactive'>

/**
 * Client type enum
 */
export type ClientType = 'traditional' | 'spa' | 'mobile' | 'm2m'

/**
 * Client URI type enum
 */
export type ClientUriType = 'redirect-uri' | 'origin-uri' | 'logout-uri' | 'login-uri' | 'cors-origin-uri'

/**
 * URI type (used in client list response)
 */
export type Uri = {
  uri_id: string
  uri: string
  type: ClientUriType
  created_at: string
  updated_at: string
}

/**
 * Identity Provider type (nested in client response)
 */
export type ClientIdentityProvider = {
  identity_provider_id: string
  name: string
  display_name: string
  provider: string
  provider_type: string
  identifier: string
  status: string
  is_default: boolean
  is_system: boolean
  created_at: string
  updated_at: string
}

/**
 * Client type
 */
export type Client = {
  client_id: string
  name: string
  display_name: string
  client_type: ClientType
  domain: string
  uris?: Uri[]
  identity_provider: ClientIdentityProvider
  status: ClientStatus
  is_default: boolean
  is_system: boolean
  created_at: string
  updated_at: string
}

/**
 * Client list query parameters interface
 */
export interface ClientQueryParams {
  name?: string
  display_name?: string
  client_type?: string
  identity_provider_id?: string
  status?: string
  is_default?: boolean
  is_system?: boolean
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

/**
 * Paginated client list response interface
 */
export interface ClientListResponse {
  rows: Client[]
  total: number
  page: number
  limit: number
  total_pages: number
}

/**
 * Single client response interface
 */
export interface ClientResponse {
  client_id: string
  name: string
  display_name: string
  client_type: ClientType
  domain: string
  uris?: Uri[]
  identity_provider: ClientIdentityProvider
  status: ClientStatus
  is_default: boolean
  is_system: boolean
  created_at: string
  updated_at: string
}

/**
 * Create client request interface
 */
export interface CreateClientRequest {
  name: string
  display_name: string
  client_type: ClientType
  domain: string
  identity_provider_id: string
  status: ClientStatus
  config?: Record<string, any>
}

/**
 * Update client request interface
 */
export interface UpdateClientRequest {
  name: string
  display_name: string
  client_type: ClientType
  domain: string
  identity_provider_id?: string
  status: ClientStatus
  config?: Record<string, any>
}

/**
 * Update client status request interface
 */
export interface UpdateClientStatusRequest {
  status: ClientStatus
}

/**
 * Client URI type
 */
export type ClientUri = {
  client_uri_id: string
  client_id: string
  type: ClientUriType
  uri: string
  created_at: string
  updated_at: string
}

/**
 * Client URIs response interface
 */
export interface ClientUrisResponse {
  uris: ClientUri[]
}

/**
 * Create client URI request interface
 */
export interface CreateClientUriRequest {
  uri: string
  type: ClientUriType
}

/**
 * Update client URI request interface
 */
export interface UpdateClientUriRequest {
  uri: string
  type: ClientUriType
}

/**
 * Permission type (simplified for client API context)
 */
export type ClientApiPermission = {
  permission_id: string
  name: string
  description: string
  status: 'active' | 'inactive'
  is_default: boolean
  is_system: boolean
  created_at: string
  updated_at: string
}

/**
 * API type (simplified for client API context)
 */
export type ClientApi = {
  api_id: string
  name: string
  display_name: string
  description: string
  status: 'active' | 'inactive'
  is_default: boolean
  is_system: boolean
  created_at: string
  updated_at: string
}

/**
 * Client API type (association between client and API with permissions)
 */
export type ClientApiAssociation = {
  auth_client_api_id: string
  api: ClientApi
  permissions: ClientApiPermission[]
  created_at: string
}

/**
 * Client APIs response interface
 */
export interface ClientApisResponse {
  apis: ClientApiAssociation[]
}

/**
 * Add APIs to client request interface
 */
export interface AddClientApisRequest {
  api_uuids: string[]
}

/**
 * Add permissions to client API request interface
 */
export interface AddClientApiPermissionsRequest {
  permission_uuids: string[]
}
