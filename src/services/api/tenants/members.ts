import { get, post, patch, deleteRequest } from '../client'
import { API_ENDPOINTS } from '../config'

export interface TenantMemberUser {
  user_id: string
  username: string
  fullname: string
  email: string
  phone: string
  is_email_verified: boolean
  is_phone_verified: boolean
  is_profile_completed: boolean
  is_account_completed: boolean
  status: string
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface TenantMember {
  tenant_user_id: string
  role: 'owner' | 'member'
  user: TenantMemberUser
  created_at: string
  updated_at: string
}

export interface TenantMembersListParams {
  role?: string
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface TenantMembersListResponse {
  success: boolean
  data: TenantMember[]
  message?: string
}

export async function fetchTenantMembers(tenantId: string, params: TenantMembersListParams = {}): Promise<TenantMembersListResponse> {
  const qp: Record<string, string> = {
    role: params.role ?? '',
    page: params.page !== undefined ? String(params.page) : '1',
    limit: params.limit !== undefined ? String(params.limit) : '10',
    sort_by: params.sort_by ?? 'created_at',
    sort_order: params.sort_order ?? 'desc',
  }
  const queryParams = new URLSearchParams(qp)
  const url = `${API_ENDPOINTS.TENANT}s/${tenantId}/members?${queryParams.toString()}`
  return get<TenantMembersListResponse>(url)
}

export async function addTenantMember(tenantId: string, user_id: string, role: 'owner' | 'member') {
  return post(`${API_ENDPOINTS.TENANT}s/${tenantId}/members`, { user_id, role })
}

export async function updateTenantMemberRole(tenantId: string, tenant_user_id: string, role: 'owner' | 'member') {
  return patch(`${API_ENDPOINTS.TENANT}s/${tenantId}/members/${tenant_user_id}/role`, { role })
}

export async function deleteTenantMember(tenantId: string, tenant_user_id: string) {
  return deleteRequest(`${API_ENDPOINTS.TENANT}s/${tenantId}/members/${tenant_user_id}`)
}
