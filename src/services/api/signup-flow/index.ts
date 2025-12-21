/**
 * Signup Flow API Service
 * Service for managing signup flow-related API calls
 */

import { get, post, put, patch, deleteRequest } from '../client'
import { API_ENDPOINTS } from '../config'
import type { ApiResponse } from '../types'
import type {
  SignupFlowListResponseInterface,
  SignupFlowRolesResponseInterface,
  SignupFlowQueryParamsInterface,
  SignupFlowType,
  CreateSignupFlowRequestInterface,
  UpdateSignupFlowRequestInterface,
  UpdateSignupFlowStatusRequestInterface
} from './types'

/**
 * Fetch signup flows with optional filters and pagination
 */
export async function fetchSignupFlows(params?: SignupFlowQueryParamsInterface): Promise<SignupFlowListResponseInterface> {
  const queryParams = new URLSearchParams()

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value))
      }
    })
  }

  const endpoint = `${API_ENDPOINTS.SIGNUP_FLOW}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await get<ApiResponse<SignupFlowListResponseInterface>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch signup flows')
}

/**
 * Fetch a single signup flow by ID
 */
export async function fetchSignupFlowById(signupFlowId: string): Promise<SignupFlowType> {
  const endpoint = `${API_ENDPOINTS.SIGNUP_FLOW}/${signupFlowId}`
  const response = await get<ApiResponse<SignupFlowType>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch signup flow')
}

/**
 * Create a new signup flow
 */
export async function createSignupFlow(data: CreateSignupFlowRequestInterface): Promise<SignupFlowType> {
  const endpoint = API_ENDPOINTS.SIGNUP_FLOW
  const response = await post<ApiResponse<SignupFlowType>>(endpoint, data)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to create signup flow')
}

/**
 * Update an existing signup flow
 */
export async function updateSignupFlow(signupFlowId: string, data: UpdateSignupFlowRequestInterface): Promise<SignupFlowType> {
  const endpoint = `${API_ENDPOINTS.SIGNUP_FLOW}/${signupFlowId}`
  const response = await put<ApiResponse<SignupFlowType>>(endpoint, data)

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
export async function updateSignupFlowStatus(signupFlowId: string, data: UpdateSignupFlowStatusRequestInterface): Promise<SignupFlowType> {
  const endpoint = `${API_ENDPOINTS.SIGNUP_FLOW}/${signupFlowId}/status`
  const response = await patch<ApiResponse<SignupFlowType>>(endpoint, data)

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
  params?: SignupFlowQueryParamsInterface
): Promise<SignupFlowRolesResponseInterface> {
  const queryParams = new URLSearchParams()

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value))
      }
    })
  }

  const endpoint = `${API_ENDPOINTS.SIGNUP_FLOW}/${signupFlowId}/roles${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await get<ApiResponse<SignupFlowRolesResponseInterface>>(endpoint)

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
