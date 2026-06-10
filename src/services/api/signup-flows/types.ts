/**
 * Signup Flow Types
 * Type definitions for signup flow API responses and requests
 */

export type SignupFlowStatus = 'active' | 'inactive' | 'draft'

export interface SignupFlowRole {
  role_id: string
  name: string
  description: string
  is_default: boolean
  is_system: boolean
  status: string
  created_at: string
  updated_at: string
}

export interface SignupFlow {
  signup_flow_id: string
  name: string
  description: string
  identifier: string
  config: {
    auto_approved: boolean
    [key: string]: unknown
  }
  status: SignupFlowStatus
  client_id: string
  // Optional branding template (UUID) applied to this flow's auth experience.
  branding_id?: string
  created_at: string
  updated_at: string
}

export interface SignupFlowListResponse {
  rows: SignupFlow[]
  limit: number
  page: number
  total: number
  total_pages: number
}

export interface SignupFlowRolesResponse {
  rows: SignupFlowRole[]
  limit: number
  page: number
  total: number
  total_pages: number
}

/** A callback URI attached to an auth flow. `client_uri_id` is the client_uris UUID. */
export interface SignupFlowCallbackURI {
  auth_flow_callback_uri_id: string
  auth_flow_id: string
  client_uri_id: string
  uri: string
  created_at: string
}

export interface SignupFlowCallbackURIsResponse {
  rows: SignupFlowCallbackURI[]
  limit: number
  page: number
  total: number
  total_pages: number
}

export interface SignupFlowQueryParams {
  name?: string
  identifier?: string
  status?: SignupFlowStatus
  client_id?: string
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface CreateSignupFlowRequest {
  name: string
  description?: string
  config?: {
    auto_approved?: boolean
    [key: string]: unknown
  }
  status?: SignupFlowStatus
  client_id: string
  // Optional branding template UUID; omit for the tenant's active branding.
  branding_id?: string
  // Role UUIDs auto-assigned on completion, and client-URI UUIDs to attach as callbacks.
  role_ids?: string[]
  client_uri_ids?: string[]
}

export interface UpdateSignupFlowRequest {
  name?: string
  description?: string
  config?: {
    auto_approved?: boolean
    [key: string]: unknown
  }
  status?: SignupFlowStatus
  client_id?: string
  // Optional branding template UUID; omit for the tenant's active branding.
  branding_id?: string
  // When present, replaces the flow's role / callback-URI membership to exactly
  // these sets (empty array clears; omit to leave untouched).
  role_ids?: string[]
  client_uri_ids?: string[]
}

export interface UpdateSignupFlowStatusRequest {
  status: SignupFlowStatus
}
