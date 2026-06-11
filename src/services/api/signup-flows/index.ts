/**
 * Auth Flow API Service (backend resource: /auth_flows, formerly signup_flows)
 * Service for managing auth-flow-related API calls.
 */

import { get, post, put, patch, deleteRequest } from '../client'
import { API_ENDPOINTS } from '../config'
import type { ApiResponse } from '../types'
import type {
  SignupFlowListResponse,
  SignupFlowRolesResponse,
  SignupFlowCallbackURIsResponse,
  SignupFlowQueryParams,
  SignupFlow,
  SignupFlowRole,
  CreateSignupFlowRequest,
  UpdateSignupFlowRequest,
  UpdateSignupFlowStatusRequest
} from './types'

// The backend renamed signup_flows → auth_flows and the record id field to
// `auth_flow_id`. These mappers normalise the response back to the shape the
// console components consume (signup_flow_id, config) so the UI keeps working.
type RawFlow = Record<string, unknown>

function mapFlow(raw: RawFlow): SignupFlow {
  return {
    ...(raw as object),
    signup_flow_id: (raw.auth_flow_id ?? raw.signup_flow_id) as string,
    config: (raw.config as SignupFlow['config']) ?? { auto_approved: false },
  } as SignupFlow
}

function mapRole(raw: RawFlow): SignupFlowRole {
  return {
    ...(raw as object),
    role_id: raw.role_id as string,
    name: (raw.role_name ?? raw.name ?? '') as string,
  } as SignupFlowRole
}

/**
 * Fetch auth flows with optional filters and pagination
 */
export async function fetchSignupFlows(params?: SignupFlowQueryParams): Promise<SignupFlowListResponse> {
  const queryParams = new URLSearchParams()

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value))
      }
    })
  }

  const endpoint = `${API_ENDPOINTS.AUTH_FLOW}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await get<ApiResponse<{ rows: RawFlow[]; limit: number; page: number; total: number; total_pages: number }>>(endpoint)

  if (response.success && response.data) {
    return { ...response.data, rows: response.data.rows.map(mapFlow) }
  }

  throw new Error(response.message || 'Failed to fetch auth flows')
}

/**
 * Fetch a single auth flow by ID
 */
export async function fetchSignupFlowById(signupFlowId: string): Promise<SignupFlow> {
  const endpoint = `${API_ENDPOINTS.AUTH_FLOW}/${signupFlowId}`
  const response = await get<ApiResponse<RawFlow>>(endpoint)

  if (response.success && response.data) {
    return mapFlow(response.data)
  }

  throw new Error(response.message || 'Failed to fetch auth flow')
}

/**
 * Create a new auth flow
 */
export async function createSignupFlow(data: CreateSignupFlowRequest): Promise<SignupFlow> {
  const endpoint = API_ENDPOINTS.AUTH_FLOW
  const response = await post<ApiResponse<RawFlow>>(endpoint, data)

  if (response.success && response.data) {
    return mapFlow(response.data)
  }

  throw new Error(response.message || 'Failed to create auth flow')
}

/**
 * Update an existing auth flow
 */
export async function updateSignupFlow(signupFlowId: string, data: UpdateSignupFlowRequest): Promise<SignupFlow> {
  const endpoint = `${API_ENDPOINTS.AUTH_FLOW}/${signupFlowId}`
  const response = await put<ApiResponse<RawFlow>>(endpoint, data)

  if (response.success && response.data) {
    return mapFlow(response.data)
  }

  throw new Error(response.message || 'Failed to update auth flow')
}

/**
 * Delete an auth flow
 */
export async function deleteSignupFlow(signupFlowId: string): Promise<void> {
  const endpoint = `${API_ENDPOINTS.AUTH_FLOW}/${signupFlowId}`
  const response = await deleteRequest<ApiResponse<void>>(endpoint)

  if (!response.success) {
    throw new Error(response.message || 'Failed to delete auth flow')
  }
}

/**
 * Update auth flow status (activate, deactivate, etc.)
 */
export async function updateSignupFlowStatus(signupFlowId: string, data: UpdateSignupFlowStatusRequest): Promise<SignupFlow> {
  const endpoint = `${API_ENDPOINTS.AUTH_FLOW}/${signupFlowId}/status`
  const response = await patch<ApiResponse<RawFlow>>(endpoint, data)

  if (response.success && response.data) {
    return mapFlow(response.data)
  }

  throw new Error(response.message || 'Failed to update auth flow status')
}

/**
 * Fetch roles associated with an auth flow
 */
export async function fetchSignupFlowRoles(
  signupFlowId: string,
  params?: SignupFlowQueryParams
): Promise<SignupFlowRolesResponse> {
  const queryParams = new URLSearchParams()

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value))
      }
    })
  }

  const endpoint = `${API_ENDPOINTS.AUTH_FLOW}/${signupFlowId}/roles${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await get<ApiResponse<{ rows: RawFlow[]; limit: number; page: number; total: number; total_pages: number }>>(endpoint)

  if (response.success && response.data) {
    return { ...response.data, rows: response.data.rows.map(mapRole) }
  }

  throw new Error(response.message || 'Failed to fetch auth flow roles')
}

/**
 * Assign roles to an auth flow
 */
export async function assignSignupFlowRoles(
  signupFlowId: string,
  data: { role_uuids: string[] }
): Promise<void> {
  const endpoint = `${API_ENDPOINTS.AUTH_FLOW}/${signupFlowId}/roles`
  const response = await post<ApiResponse<void>>(endpoint, data)

  if (!response.success) {
    throw new Error(response.message || 'Failed to assign roles to auth flow')
  }
}

/**
 * Remove a role from an auth flow
 */
export async function removeSignupFlowRole(
  signupFlowId: string,
  roleId: string
): Promise<void> {
  const endpoint = `${API_ENDPOINTS.AUTH_FLOW}/${signupFlowId}/roles/${roleId}`
  const response = await deleteRequest<ApiResponse<void>>(endpoint)

  if (!response.success) {
    throw new Error(response.message || 'Failed to remove role from auth flow')
  }
}

/**
 * Fetch callback URIs attached to an auth flow
 */
export async function fetchSignupFlowCallbackURIs(
  signupFlowId: string,
  params?: SignupFlowQueryParams
): Promise<SignupFlowCallbackURIsResponse> {
  const queryParams = new URLSearchParams()

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value))
      }
    })
  }

  const endpoint = `${API_ENDPOINTS.AUTH_FLOW}/${signupFlowId}/callback_uris${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await get<ApiResponse<SignupFlowCallbackURIsResponse>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch auth flow callback URIs')
}

/**
 * Attach callback URIs (client_uris UUIDs) to an auth flow
 */
export async function assignSignupFlowCallbackURIs(
  signupFlowId: string,
  data: { client_uri_uuids: string[] }
): Promise<void> {
  const endpoint = `${API_ENDPOINTS.AUTH_FLOW}/${signupFlowId}/callback_uris`
  const response = await post<ApiResponse<void>>(endpoint, data)

  if (!response.success) {
    throw new Error(response.message || 'Failed to assign callback URIs to auth flow')
  }
}

/**
 * Detach a callback URI (client_uris UUID) from an auth flow
 */
export async function removeSignupFlowCallbackURI(
  signupFlowId: string,
  clientUriId: string
): Promise<void> {
  const endpoint = `${API_ENDPOINTS.AUTH_FLOW}/${signupFlowId}/callback_uris/${clientUriId}`
  const response = await deleteRequest<ApiResponse<void>>(endpoint)

  if (!response.success) {
    throw new Error(response.message || 'Failed to remove callback URI from auth flow')
  }
}
