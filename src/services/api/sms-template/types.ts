/**
 * SMS Template API Types
 */

import type { StatusType } from '@/types/status'

/**
 * SMS Template status type
 */
export type SmsTemplateStatusType = Extract<StatusType, 'active' | 'inactive'>

/**
 * SMS Template type (camelCase for frontend)
 */
export type SmsTemplate = {
  smsTemplateId: string
  name: string
  description: string
  message: string
  senderId: string
  status: SmsTemplateStatusType
  isDefault: boolean
  isSystem: boolean
  createdAt: string
  updatedAt: string
}

/**
 * SMS Template Payload type (snake_case from backend)
 */
export type SmsTemplatePayload = {
  sms_template_id: string
  name: string
  description: string
  message: string
  sender_id: string
  status: SmsTemplateStatusType
  is_default: boolean
  is_system: boolean
  created_at: string
  updated_at: string
}

/**
 * SMS Template Query Params
 */
export interface SmsTemplateQueryParams {
  name?: string
  status?: SmsTemplateStatusType
  is_default?: boolean
  is_system?: boolean
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

/**
 * SMS Template List Response
 */
export interface SmsTemplateListResponse {
  rows: SmsTemplate[]
  total: number
  page: number
  limit: number
  total_pages: number
}

/**
 * Create SMS Template Request
 */
export interface CreateSmsTemplateRequest {
  name: string
  description: string
  message: string
  sender_id: string
  status: SmsTemplateStatusType
}

/**
 * Update SMS Template Request
 */
export interface UpdateSmsTemplateRequest {
  name: string
  description: string
  message: string
  sender_id: string
  status: SmsTemplateStatusType
}

/**
 * Update SMS Template Status Request
 */
export interface UpdateSmsTemplateStatusRequest {
  status: SmsTemplateStatusType
}
