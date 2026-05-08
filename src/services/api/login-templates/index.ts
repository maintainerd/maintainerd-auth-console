/**
 * Login Template API Service
 */

import { get, post, put, patch, deleteRequest } from '../client'
import { API_ENDPOINTS } from '../config'
import type { ApiResponse } from '../types'
import type {
  LoginTemplate,
  LoginTemplatePayload,
  LoginTemplateQueryParams,
  LoginTemplateListResponse,
  CreateLoginTemplateRequest,
  UpdateLoginTemplateRequest,
  UpdateLoginTemplateStatusRequest,
} from './types'

/**
 * Transform backend payload to frontend LoginTemplate
 */
function transformPayloadToLoginTemplate(payload: LoginTemplatePayload): LoginTemplate {
  return {
    loginTemplateId: payload.login_template_id,
    name: payload.name,
    description: payload.description,
    template: payload.template,
    status: payload.status,
    metadata: payload.metadata,
    isDefault: payload.is_default,
    isSystem: payload.is_system,
    createdAt: payload.created_at,
    updatedAt: payload.updated_at,
  }
}

/**
 * Fetch login templates with optional filters and pagination
 */
export async function fetchLoginTemplates(
  params?: LoginTemplateQueryParams
): Promise<LoginTemplateListResponse> {
  const queryParams = new URLSearchParams()

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value))
      }
    })
  }

  const endpoint = `${API_ENDPOINTS.LOGIN_TEMPLATE}${
    queryParams.toString() ? `?${queryParams.toString()}` : ''
  }`
  const response = await get<
    ApiResponse<{
      rows: LoginTemplatePayload[]
      total: number
      page: number
      limit: number
      total_pages: number
    }>
  >(endpoint)

  if (response.success && response.data) {
    return {
      rows: response.data.rows.map(transformPayloadToLoginTemplate),
      total: response.data.total,
      page: response.data.page,
      limit: response.data.limit,
      total_pages: response.data.total_pages,
    }
  }

  throw new Error(response.message || 'Failed to fetch login templates')
}

/**
 * Fetch a single login template by ID
 */
export async function fetchLoginTemplateById(id: string): Promise<LoginTemplate> {
  const endpoint = `${API_ENDPOINTS.LOGIN_TEMPLATE}/${id}`
  const response = await get<ApiResponse<LoginTemplatePayload>>(endpoint)

  if (response.success && response.data) {
    return transformPayloadToLoginTemplate(response.data)
  }

  throw new Error(response.message || 'Failed to fetch login template')
}

/**
 * Create a new login template
 */
export async function createLoginTemplate(data: CreateLoginTemplateRequest): Promise<LoginTemplate> {
  const endpoint = API_ENDPOINTS.LOGIN_TEMPLATE
  const response = await post<ApiResponse<LoginTemplatePayload>>(endpoint, data)

  if (response.success && response.data) {
    return transformPayloadToLoginTemplate(response.data)
  }

  throw new Error(response.message || 'Failed to create login template')
}

/**
 * Update an existing login template
 */
export async function updateLoginTemplate(
  id: string,
  data: UpdateLoginTemplateRequest
): Promise<LoginTemplate> {
  const endpoint = `${API_ENDPOINTS.LOGIN_TEMPLATE}/${id}`
  const response = await put<ApiResponse<LoginTemplatePayload>>(endpoint, data)

  if (response.success && response.data) {
    return transformPayloadToLoginTemplate(response.data)
  }

  throw new Error(response.message || 'Failed to update login template')
}

/**
 * Update login template status
 */
export async function updateLoginTemplateStatus(
  id: string,
  data: UpdateLoginTemplateStatusRequest
): Promise<LoginTemplate> {
  const endpoint = `${API_ENDPOINTS.LOGIN_TEMPLATE}/${id}/status`
  const response = await patch<ApiResponse<LoginTemplatePayload>>(endpoint, data)

  if (response.success && response.data) {
    return transformPayloadToLoginTemplate(response.data)
  }

  throw new Error(response.message || 'Failed to update login template status')
}

/**
 * Delete a login template
 */
export async function deleteLoginTemplate(id: string): Promise<void> {
  const endpoint = `${API_ENDPOINTS.LOGIN_TEMPLATE}/${id}`
  const response = await deleteRequest<ApiResponse<void>>(endpoint)

  if (!response.success) {
    throw new Error(response.message || 'Failed to delete login template')
  }
}
