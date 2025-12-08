/**
 * Client API Types
 */

import type { StatusType } from '@/types/status'

/**
 * Client secret response type
 */
export type ClientSecretType = {
  client_id: string
  client_secret: string
}

/**
 * Client config type (dynamic fields)
 */
export type ClientConfigType = {
  config: Record<string, any>
}

/**
 * Client status type - defines valid statuses for clients only
 */
export type ClientStatusType = Extract<StatusType, 'active' | 'inactive'>

/**
 * Client type enum
 */
export type ClientTypeEnum = 'traditional' | 'spa' | 'mobile' | 'm2m'

/**
 * Client URI type enum
 */
export type ClientUriTypeEnum = 'redirect-uri' | 'origin-uri' | 'logout-uri' | 'login-uri' | 'cors-origin-uri'

/**
 * URI type (used in client list response)
 */
export type UriType = {
  uri_id: string
  uri: string
  type: ClientUriTypeEnum
  created_at: string
  updated_at: string
}

/**
 * Identity Provider type (nested in client response)
 */
export type ClientIdentityProviderType = {
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
export type ClientType = {
  client_id: string
  name: string
  display_name: string
  client_type: ClientTypeEnum
  domain: string
  uris?: UriType[]
  identity_provider: ClientIdentityProviderType
  status: ClientStatusType
  is_default: boolean
  is_system: boolean
  created_at: string
  updated_at: string
}

/**
 * Client list query parameters interface
 */
export interface ClientQueryParamsInterface {
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
export interface ClientListResponseInterface {
  rows: ClientType[]
  total: number
  page: number
  limit: number
  total_pages: number
}

/**
 * Single client response interface
 */
export interface ClientResponseInterface {
  client_id: string
  name: string
  display_name: string
  client_type: ClientTypeEnum
  domain: string
  uris?: UriType[]
  identity_provider: ClientIdentityProviderType
  status: ClientStatusType
  is_default: boolean
  is_system: boolean
  created_at: string
  updated_at: string
}

/**
 * Create client request interface
 */
export interface CreateClientRequestInterface {
  name: string
  display_name: string
  client_type: ClientTypeEnum
  domain: string
  identity_provider_id: string
  status: ClientStatusType
  config?: Record<string, any>
}

/**
 * Update client request interface
 */
export interface UpdateClientRequestInterface {
  name: string
  display_name: string
  client_type: ClientTypeEnum
  domain: string
  identity_provider_id?: string
  status: ClientStatusType
  config?: Record<string, any>
}

/**
 * Update client status request interface
 */
export interface UpdateClientStatusRequestInterface {
  status: ClientStatusType
}

/**
 * Client URI type
 */
export type ClientUriType = {
  client_uri_id: string
  client_id: string
  type: ClientUriTypeEnum
  uri: string
  created_at: string
  updated_at: string
}

/**
 * Client URIs response interface
 */
export interface ClientUrisResponseInterface {
  uris: ClientUriType[]
}

/**
 * Create client URI request interface
 */
export interface CreateClientUriRequestInterface {
  uri: string
  type: ClientUriTypeEnum
}

/**
 * Update client URI request interface
 */
export interface UpdateClientUriRequestInterface {
  uri: string
  type: ClientUriTypeEnum
}

/**
 * Permission type (simplified for client API context)
 */
export type ClientApiPermissionType = {
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
export type ClientApiType = {
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
export type ClientApiAssociationType = {
  auth_client_api_id: string
  api: ClientApiType
  permissions: ClientApiPermissionType[]
  created_at: string
}

/**
 * Client APIs response interface
 */
export interface ClientApisResponseInterface {
  apis: ClientApiAssociationType[]
}

/**
 * Add APIs to client request interface
 */
export interface AddClientApisRequestInterface {
  api_uuids: string[]
}

/**
 * Add permissions to client API request interface
 */
export interface AddClientApiPermissionsRequestInterface {
  permission_uuids: string[]
}
