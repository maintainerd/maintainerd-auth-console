import { get } from '../client'
import { API_ENDPOINTS } from '../config'
import type { ApiResponse } from '../types'
import type { AuthEventQueryParams, AuthEventListResponse, AuthEvent } from './types'

export async function fetchAuthEvents(params?: AuthEventQueryParams): Promise<AuthEventListResponse> {
  const queryParams = new URLSearchParams()

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value))
      }
    })
  }

  const endpoint = `${API_ENDPOINTS.AUTH_EVENTS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await get<ApiResponse<AuthEventListResponse>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch auth events')
}

export async function fetchAuthEventById(eventId: string): Promise<AuthEvent> {
  const endpoint = `${API_ENDPOINTS.AUTH_EVENTS}/${eventId}`
  const response = await get<ApiResponse<AuthEvent>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch auth event')
}
