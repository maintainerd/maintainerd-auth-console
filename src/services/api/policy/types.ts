/**
 * Policy API Types
 */

import type { StatusType } from '@/types/status'

/**
 * Policy status type - defines valid statuses for policies only
 */
export type PolicyStatusType = Extract<StatusType, 'active' | 'inactive'>

/**
 * Policy statement type
 */
export type PolicyStatementType = {
  effect: 'allow' | 'deny'
  action: string[]
  resource: string[]
}

/**
 * Policy document type
 */
export type PolicyDocumentType = {
  version: string
  statement: PolicyStatementType[]
}

/**
 * Policy type (for list view)
 */
export type PolicyType = {
  policy_id: string
  name: string
  description: string
  version: string
  status: PolicyStatusType
  is_default: boolean
  is_system: boolean
  created_at: string
  updated_at: string
}

/**
 * Policy detail type (includes document)
 */
export type PolicyDetailType = {
  policy_id: string
  name: string
  description: string
  document: PolicyDocumentType
  version: string
  status: PolicyStatusType
  is_default: boolean
  is_system: boolean
  created_at: string
  updated_at: string
}

/**
 * Policy query parameters interface
 */
export interface PolicyQueryParamsInterface {
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  name?: string
  description?: string
  version?: string
  status?: string
  is_default?: boolean
  is_system?: boolean
  service_id?: string
}

/**
 * Policy list response interface
 */
export interface PolicyListResponseInterface {
  rows: PolicyType[]
  total: number
  page: number
  limit: number
  total_pages: number
}

/**
 * Single policy response interface
 */
export interface PolicyResponseInterface {
  policy_id: string
  name: string
  description: string
  version: string
  status: PolicyStatusType
  is_default: boolean
  is_system: boolean
  created_at: string
  updated_at: string
}

/**
 * Create policy request interface
 */
export interface CreatePolicyRequestInterface {
  name: string
  description: string
  version: string
  status: PolicyStatusType
  document: PolicyDocumentType
}

/**
 * Update policy request interface
 */
export interface UpdatePolicyRequestInterface {
  name: string
  description: string
  version: string
  status: PolicyStatusType
  document: PolicyDocumentType
}

/**
 * Update policy status request interface
 */
export interface UpdatePolicyStatusRequestInterface {
  status: PolicyStatusType
}

