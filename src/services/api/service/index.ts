/**
 * Service API
 * Handles service-related API calls
 */

import { get } from '../client'
import { API_ENDPOINTS } from '../config'
import type { ApiResponse } from '../types'
import type { ServiceListResponseInterface, ServiceQueryParamsInterface } from './types'

/**
 * Fetch services with optional filters and pagination
 */
export async function fetchServices(params?: ServiceQueryParamsInterface): Promise<ServiceListResponseInterface> {
  const queryParams = new URLSearchParams()

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value))
      }
    })
  }

  const endpoint = `${API_ENDPOINTS.SERVICE}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await get<ApiResponse<ServiceListResponseInterface>>(endpoint)

  if (response.success && response.data) {
    return response.data
  }

  throw new Error(response.message || 'Failed to fetch services')
}

// Export as service object
export const serviceService = {
  fetchServices,
}

