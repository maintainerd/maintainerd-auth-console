/**
 * Policy API
 * Handles policy-related API calls
 */

import { get, post, put, deleteRequest } from '../client'
import { API_ENDPOINTS } from '../config'
import type { ApiResponse } from '../types'
import type {
  PolicyListResponseInterface,
  PolicyQueryParamsInterface,
  PolicyResponseInterface,
  PolicyDetailType,
  CreatePolicyRequestInterface,
  UpdatePolicyRequestInterface,
  UpdatePolicyStatusRequestInterface
} from './types'
import type { ServiceListResponseInterface, ServiceQueryParamsInterface } from '../service/types'

/**
 * Fetch policies with optional filters and pagination
 */
export async function fetchPolicies(params?: PolicyQueryParamsInterface): Promise<PolicyListResponseInterface> {
  const queryParams = new URLSearchParams()

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value))
      }
    })
  }

  const endpoint = `${API_ENDPOINTS.POLICY}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await get<ApiResponse<PolicyListResponseInterface>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch policies')
}

/**
 * Fetch a single policy by ID
 */
export async function fetchPolicyById(policyId: string): Promise<PolicyDetailType> {
  const endpoint = `${API_ENDPOINTS.POLICY}/${policyId}`
  const response = await get<ApiResponse<PolicyDetailType>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch policy')
}

/**
 * Create a new policy
 */
export async function createPolicy(data: CreatePolicyRequestInterface): Promise<PolicyResponseInterface> {
  const endpoint = API_ENDPOINTS.POLICY
  const response = await post<ApiResponse<PolicyResponseInterface>>(endpoint, data)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to create policy')
}

/**
 * Update an existing policy
 */
export async function updatePolicy(policyId: string, data: UpdatePolicyRequestInterface): Promise<PolicyResponseInterface> {
  const endpoint = `${API_ENDPOINTS.POLICY}/${policyId}`
  const response = await put<ApiResponse<PolicyResponseInterface>>(endpoint, data)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to update policy')
}

/**
 * Delete a policy
 */
export async function deletePolicy(policyId: string): Promise<void> {
  const endpoint = `${API_ENDPOINTS.POLICY}/${policyId}`
  const response = await deleteRequest<ApiResponse>(endpoint)

  if (!response.success) {
    throw new Error(response.message || 'Failed to delete policy')
  }
}

/**
 * Update policy status
 */
export async function updatePolicyStatus(policyId: string, data: UpdatePolicyStatusRequestInterface): Promise<PolicyResponseInterface> {
  const endpoint = `${API_ENDPOINTS.POLICY}/${policyId}/status`
  const response = await put<ApiResponse<PolicyResponseInterface>>(endpoint, data)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to update policy status')
}

/**
 * Fetch services that use a specific policy
 */
export async function fetchServicesByPolicy(policyId: string, params?: ServiceQueryParamsInterface): Promise<ServiceListResponseInterface> {
  const queryParams = new URLSearchParams()

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value))
      }
    })
  }

  const endpoint = `${API_ENDPOINTS.POLICY}/${policyId}/services${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await get<ApiResponse<ServiceListResponseInterface>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch services')
}

// Export as policy object
export const policyService = {
  fetchPolicies,
  fetchPolicyById,
  createPolicy,
  updatePolicy,
  deletePolicy,
  updatePolicyStatus,
  fetchServicesByPolicy,
}

