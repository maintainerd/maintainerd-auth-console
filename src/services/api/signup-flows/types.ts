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
}

export interface UpdateSignupFlowStatusRequest {
  status: SignupFlowStatus
}
