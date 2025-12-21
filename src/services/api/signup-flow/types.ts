/**
 * Signup Flow Types
 * Type definitions for signup flow API responses and requests
 */

export type SignupFlowStatusType = 'active' | 'inactive' | 'draft'

export interface SignupFlowRoleType {
  role_id: string
  name: string
  description: string
  is_default: boolean
  is_system: boolean
  status: string
  created_at: string
  updated_at: string
}

export interface SignupFlowType {
  signup_flow_id: string
  name: string
  description: string
  identifier: string
  config: {
    auto_approved: boolean
    [key: string]: unknown
  }
  status: SignupFlowStatusType
  client_id: string
  created_at: string
  updated_at: string
}

export interface SignupFlowListResponseInterface {
  rows: SignupFlowType[]
  limit: number
  page: number
  total: number
  total_pages: number
}

export interface SignupFlowRolesResponseInterface {
  rows: SignupFlowRoleType[]
  limit: number
  page: number
  total: number
  total_pages: number
}

export interface SignupFlowQueryParamsInterface {
  name?: string
  identifier?: string
  status?: SignupFlowStatusType
  client_id?: string
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface CreateSignupFlowRequestInterface {
  name: string
  description?: string
  config?: {
    auto_approved?: boolean
    [key: string]: unknown
  }
  status?: SignupFlowStatusType
  client_id: string
}

export interface UpdateSignupFlowRequestInterface {
  name?: string
  description?: string
  config?: {
    auto_approved?: boolean
    [key: string]: unknown
  }
  status?: SignupFlowStatusType
  client_id?: string
}

export interface UpdateSignupFlowStatusRequestInterface {
  status: SignupFlowStatusType
}
