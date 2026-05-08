/**
 * Signup Flow API Service
 * Service for managing signup flow-related API calls
 */

import { get, post, put, patch, deleteRequest } from '../client'
import { API_ENDPOINTS } from '../config'
import type { ApiResponse } from '../types'
import type {
  SignupFlowListResponse,
  SignupFlowRolesResponse,
  SignupFlowQueryParams,
  SignupFlow,
  CreateSignupFlowRequest,
  UpdateSignupFlowRequest,
  UpdateSignupFlowStatusRequest
} from './types'

/**
 * Fetch signup flows with optional filters and pagination
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

  const endpoint = `${API_ENDPOINTS.SIGNUP_FLOW}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await get<ApiResponse<SignupFlowListResponse>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch signup flows')
}

/**
 * Fetch a single signup flow by ID
 */
export async function fetchSignupFlowById(signupFlowId: string): Promise<SignupFlow> {
  const endpoint = `${API_ENDPOINTS.SIGNUP_FLOW}/${signupFlowId}`
  const response = await get<ApiResponse<SignupFlow>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch signup flow')
}

/**
 * Create a new signup flow
 */
export async function createSignupFlow(data: CreateSignupFlowRequest): Promise<SignupFlow> {
  const endpoint = API_ENDPOINTS.SIGNUP_FLOW
  const response = await post<ApiResponse<SignupFlow>>(endpoint, data)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to create signup flow')
}

/**
 * Update an existing signup flow
 */
export async function updateSignupFlow(signupFlowId: string, data: UpdateSignupFlowRequest): Promise<SignupFlow> {
  const endpoint = `${API_ENDPOINTS.SIGNUP_FLOW}/${signupFlowId}`
  const response = await put<ApiResponse<SignupFlow>>(endpoint, data)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to update signup flow')
}

/**
 * Delete a signup flow
 */
export async function deleteSignupFlow(signupFlowId: string): Promise<void> {
  const endpoint = `${API_ENDPOINTS.SIGNUP_FLOW}/${signupFlowId}`
  const response = await deleteRequest<ApiResponse<void>>(endpoint)

  if (!response.success) {
    throw new Error(response.message || 'Failed to delete signup flow')
  }
}

/**
 * Update signup flow status (activate, deactivate, etc.)
 */
export async function updateSignupFlowStatus(signupFlowId: string, data: UpdateSignupFlowStatusRequest): Promise<SignupFlow> {
  const endpoint = `${API_ENDPOINTS.SIGNUP_FLOW}/${signupFlowId}/status`
  const response = await patch<ApiResponse<SignupFlow>>(endpoint, data)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to update signup flow status')
}

/**
 * Fetch roles associated with a signup flow
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

  const endpoint = `${API_ENDPOINTS.SIGNUP_FLOW}/${signupFlowId}/roles${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await get<ApiResponse<SignupFlowRolesResponse>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch signup flow roles')
}

/**
 * Assign roles to a signup flow
 */
export async function assignSignupFlowRoles(
  signupFlowId: string,
  data: { role_uuids: string[] }
): Promise<void> {
  const endpoint = `${API_ENDPOINTS.SIGNUP_FLOW}/${signupFlowId}/roles`
  const response = await post<ApiResponse<void>>(endpoint, data)

  if (!response.success) {
    throw new Error(response.message || 'Failed to assign roles to signup flow')
  }
}

/**
 * Remove a role from a signup flow
 */
export async function removeSignupFlowRole(
  signupFlowId: string,
  roleId: string
): Promise<void> {
  const endpoint = `${API_ENDPOINTS.SIGNUP_FLOW}/${signupFlowId}/roles/${roleId}`
  const response = await deleteRequest<ApiResponse<void>>(endpoint)

  if (!response.success) {
    throw new Error(response.message || 'Failed to remove role from signup flow')
  }
}
