/**
 * Registration Flow Types
 * Type definitions for registration flow API responses and requests
 */

export type RegistrationFlowStatus = 'active' | 'inactive' | 'draft'

export interface RegistrationFlowRole {
  role_id: string
  name: string
  description: string
  is_default: boolean
  is_system: boolean
  status: string
  created_at: string
  updated_at: string
}

export interface RegistrationFlow {
  registration_flow_id: string
  name: string
  description: string
  identifier: string
  status: RegistrationFlowStatus
  client_id: string
  verification_required: boolean
  required_fields: string
  created_at: string
  updated_at: string
}

export interface RegistrationFlowListResponse {
  rows: RegistrationFlow[]
  limit: number
  page: number
  total: number
  total_pages: number
}

export interface RegistrationFlowRolesResponse {
  rows: RegistrationFlowRole[]
  limit: number
  page: number
  total: number
  total_pages: number
}

export interface RegistrationFlowQueryParams {
  name?: string
  identifier?: string
  status?: RegistrationFlowStatus
  client_id?: string
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface CreateRegistrationFlowRequest {
  name: string
  description?: string
  identifier?: string
  status?: RegistrationFlowStatus
  client_id: string
  verification_required: boolean
  required_fields: string
  role_ids?: string[]
}

export interface UpdateRegistrationFlowRequest {
  name?: string
  description?: string
  status?: RegistrationFlowStatus
  client_id?: string
  verification_required: boolean
  required_fields: string
  role_ids?: string[]
}

export interface UpdateRegistrationFlowStatusRequest {
  status: RegistrationFlowStatus
}
