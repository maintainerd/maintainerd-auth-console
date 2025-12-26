/**
 * Email Template API Types
 */

import type { StatusType } from '@/types/status'

/**
 * Email Template status type
 */
export type EmailTemplateStatusType = Extract<StatusType, 'active' | 'inactive'>

/**
 * Email Template type (camelCase for frontend)
 */
export type EmailTemplate = {
  emailTemplateId: string
  name: string
  subject: string
  bodyHtml: string
  bodyPlain: string
  status: EmailTemplateStatusType
  isDefault: boolean
  isSystem: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Email Template Payload type (snake_case from backend)
 */
export type EmailTemplatePayload = {
  email_template_id: string
  name: string
  subject: string
  body_html: string
  body_plain: string
  status: EmailTemplateStatusType
  is_default: boolean
  is_system: boolean
  created_at: string
  updated_at: string
}

/**
 * Email Template Query Params
 */
export interface EmailTemplateQueryParams {
  name?: string
  status?: EmailTemplateStatusType
  is_default?: boolean
  is_system?: boolean
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

/**
 * Email Template List Response
 */
export interface EmailTemplateListResponse {
  rows: EmailTemplate[]
  total: number
  page: number
  limit: number
  total_pages: number
}

/**
 * Create Email Template Request
 */
export interface CreateEmailTemplateRequest {
  name: string
  subject: string
  body_html: string
  body_plain: string
  status: EmailTemplateStatusType
}

/**
 * Update Email Template Request
 */
export interface UpdateEmailTemplateRequest {
  name: string
  subject: string
  body_html: string
  body_plain: string
  status: EmailTemplateStatusType
}

/**
 * Update Email Template Status Request
 */
export interface UpdateEmailTemplateStatusRequest {
  status: EmailTemplateStatusType
}
