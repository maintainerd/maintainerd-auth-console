export interface WorkloadIdentityFederation {
  uuid: string
  name: string
  description?: string | null
  issuer_url: string
  audience?: string | null
  subject_claim: string
  subject_pattern?: string | null
  allowed_scopes?: string[] | null
  attribute_mapping?: Record<string, unknown> | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface WorkloadIdentityQueryParams {
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface WorkloadIdentityListResponse {
  rows: WorkloadIdentityFederation[]
  total: number
  page: number
  limit: number
  total_pages: number
}

export interface CreateWorkloadIdentityRequest {
  name: string
  description?: string
  issuer_url: string
  audience?: string
  subject_claim?: string
  subject_pattern?: string
  allowed_scopes?: string[]
  attribute_mapping?: Record<string, unknown>
  is_active?: boolean
}

export type UpdateWorkloadIdentityRequest = Partial<CreateWorkloadIdentityRequest>
