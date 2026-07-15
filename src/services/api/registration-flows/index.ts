/**
 * Registration Flow API Service (backend resource: /registration_flows)
 * Service for managing registration-flow-related API calls.
 */

import { get, post, put, patch, deleteRequest } from '../client'
import { API_ENDPOINTS } from '../config'
import type { ApiResponse } from '../types'
import type {
  RegistrationFlowListResponse,
  RegistrationFlowRolesResponse,
  RegistrationFlowQueryParams,
  RegistrationFlow,
  RegistrationFlowRole,
  CreateRegistrationFlowRequest,
  UpdateRegistrationFlowRequest,
  UpdateRegistrationFlowStatusRequest
} from './types'

type RawFlow = Record<string, unknown>

function mapFlow(raw: RawFlow): RegistrationFlow {
  return {
    registration_flow_id: raw.registration_flow_id as string,
    name: raw.name as string,
    description: raw.description as string,
    identifier: raw.identifier as string,
    status: raw.status as RegistrationFlow['status'],
    client_id: raw.client_id as string,
    verification_required: Boolean(raw.verification_required),
    required_fields: (raw.required_fields ?? []) as string[],
    is_system: Boolean(raw.is_system),
    created_at: raw.created_at as string,
    updated_at: raw.updated_at as string,
  }
}

function mapRole(raw: RawFlow): RegistrationFlowRole {
  return {
    role_id: raw.role_id as string,
    name: (raw.role_name ?? raw.name ?? '') as string,
    description: raw.description as string,
    is_default: Boolean(raw.is_default),
    is_system: Boolean(raw.is_system),
    status: raw.status as string,
    created_at: raw.created_at as string,
    updated_at: raw.updated_at as string,
  }
}

/**
 * Fetch paginated registration flows with optional filters
 */
export async function fetchRegistrationFlows(
  params?: RegistrationFlowQueryParams
): Promise<RegistrationFlowListResponse> {
  const queryParams = new URLSearchParams()
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value))
      }
    })
  }

  const endpoint = `${API_ENDPOINTS.REGISTRATION_FLOW}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await get<ApiResponse<RegistrationFlowListResponse>>(endpoint)

  if (response.success && response.data) {
    return {
      ...response.data,
      rows: (response.data.rows as unknown as RawFlow[]).map(mapFlow),
    }
  }

  throw new Error(response.message || 'Failed to fetch registration flows')
}

/**
 * Fetch a single registration flow by UUID
 */
export async function fetchRegistrationFlow(registrationFlowId: string): Promise<RegistrationFlow> {
  const endpoint = `${API_ENDPOINTS.REGISTRATION_FLOW}/${registrationFlowId}`
  const response = await get<ApiResponse<RegistrationFlow>>(endpoint)

  if (response.success && response.data) {
    return mapFlow(response.data as unknown as RawFlow)
  }

  throw new Error(response.message || 'Failed to fetch registration flow')
}

/**
 * Create a new registration flow
 */
export async function createRegistrationFlow(
  data: CreateRegistrationFlowRequest
): Promise<RegistrationFlow> {
  const endpoint = API_ENDPOINTS.REGISTRATION_FLOW
  const response = await post<ApiResponse<RegistrationFlow>>(endpoint, data)

  if (response.success && response.data) {
    return mapFlow(response.data as unknown as RawFlow)
  }

  throw new Error(response.message || 'Failed to create registration flow')
}

/**
 * Update an existing registration flow
 */
export async function updateRegistrationFlow(
  registrationFlowId: string,
  data: UpdateRegistrationFlowRequest
): Promise<RegistrationFlow> {
  const endpoint = `${API_ENDPOINTS.REGISTRATION_FLOW}/${registrationFlowId}`
  const response = await put<ApiResponse<RegistrationFlow>>(endpoint, data)

  if (response.success && response.data) {
    return mapFlow(response.data as unknown as RawFlow)
  }

  throw new Error(response.message || 'Failed to update registration flow')
}

/**
 * Delete a registration flow
 */
export async function deleteRegistrationFlow(registrationFlowId: string): Promise<void> {
  const endpoint = `${API_ENDPOINTS.REGISTRATION_FLOW}/${registrationFlowId}`
  const response = await deleteRequest<ApiResponse<void>>(endpoint)

  if (!response.success) {
    throw new Error(response.message || 'Failed to delete registration flow')
  }
}

/**
 * Update a registration flow's status
 */
export async function updateRegistrationFlowStatus(
  registrationFlowId: string,
  data: UpdateRegistrationFlowStatusRequest
): Promise<RegistrationFlow> {
  const endpoint = `${API_ENDPOINTS.REGISTRATION_FLOW}/${registrationFlowId}/status`
  const response = await patch<ApiResponse<RegistrationFlow>>(endpoint, data)

  if (response.success && response.data) {
    return mapFlow(response.data as unknown as RawFlow)
  }

  throw new Error(response.message || 'Failed to update registration flow status')
}

/**
 * List roles assigned to a registration flow
 */
export async function fetchRegistrationFlowRoles(
  registrationFlowId: string,
  params?: { page?: number; limit?: number }
): Promise<RegistrationFlowRolesResponse> {
  const queryParams = new URLSearchParams()
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value))
      }
    })
  }

  const endpoint = `${API_ENDPOINTS.REGISTRATION_FLOW}/${registrationFlowId}/roles${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await get<ApiResponse<RegistrationFlowRolesResponse>>(endpoint)

  if (response.success && response.data) {
    return {
      ...response.data,
      rows: (response.data.rows as unknown as RawFlow[]).map(mapRole),
    }
  }

  throw new Error(response.message || 'Failed to fetch registration flow roles')
}

/**
 * Assign roles to a registration flow (full replacement)
 */
export async function assignRegistrationFlowRoles(
  registrationFlowId: string,
  roleUuids: string[]
): Promise<RegistrationFlowRolesResponse> {
  const endpoint = `${API_ENDPOINTS.REGISTRATION_FLOW}/${registrationFlowId}/roles`
  const response = await post<ApiResponse<RegistrationFlowRolesResponse>>(endpoint, {
    role_uuids: roleUuids,
  })

  if (response.success && response.data) {
    return {
      ...response.data,
      rows: (response.data.rows as unknown as RawFlow[]).map(mapRole),
    }
  }

  throw new Error(response.message || 'Failed to assign roles to registration flow')
}

/**
 * Remove a single role from a registration flow
 */
export async function removeRegistrationFlowRole(
  registrationFlowId: string,
  roleUuid: string
): Promise<void> {
  const endpoint = `${API_ENDPOINTS.REGISTRATION_FLOW}/${registrationFlowId}/roles/${roleUuid}`
  const response = await deleteRequest<ApiResponse<void>>(endpoint)

  if (!response.success) {
    throw new Error(response.message || 'Failed to remove role from registration flow')
  }
}
