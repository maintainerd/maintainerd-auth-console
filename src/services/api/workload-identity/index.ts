import { get, post, put, deleteRequest } from '../client'
import { API_ENDPOINTS } from '../config'
import { unwrap, assertSuccess } from '../_lib/unwrap'
import type { ApiResponse } from '../types'
import type {
  WorkloadIdentityFederation,
  WorkloadIdentityListResponse,
  WorkloadIdentityQueryParams,
  CreateWorkloadIdentityRequest,
  UpdateWorkloadIdentityRequest,
} from './types'

const BASE = API_ENDPOINTS.WORKLOAD_IDENTITY_FEDERATIONS

export async function fetchWorkloadIdentities(
  params?: WorkloadIdentityQueryParams,
): Promise<WorkloadIdentityListResponse> {
  const queryParams = new URLSearchParams()
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value))
      }
    })
  }
  const endpoint = `${BASE}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const r = await get<ApiResponse<WorkloadIdentityListResponse>>(endpoint)
  return unwrap(r, 'fetch workload identity federations')
}

export async function fetchWorkloadIdentityById(
  id: string,
): Promise<WorkloadIdentityFederation> {
  const r = await get<ApiResponse<WorkloadIdentityFederation>>(`${BASE}/${id}`)
  return unwrap(r, 'fetch workload identity federation')
}

export async function createWorkloadIdentity(
  data: CreateWorkloadIdentityRequest,
): Promise<WorkloadIdentityFederation> {
  const r = await post<ApiResponse<WorkloadIdentityFederation>>(BASE, data)
  return unwrap(r, 'create workload identity federation')
}

export async function updateWorkloadIdentity(
  id: string,
  data: UpdateWorkloadIdentityRequest,
): Promise<WorkloadIdentityFederation> {
  const r = await put<ApiResponse<WorkloadIdentityFederation>>(`${BASE}/${id}`, data)
  return unwrap(r, 'update workload identity federation')
}

export async function deleteWorkloadIdentity(id: string): Promise<void> {
  const r = await deleteRequest<ApiResponse<void>>(`${BASE}/${id}`)
  assertSuccess(r, 'delete workload identity federation')
}
