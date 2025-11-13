/**
 * API Client
 * Base HTTP client with common functionality like error handling, timeouts, etc.
 */

import { API_CONFIG } from './config'
import './debug' // Import debug utilities in development

export interface ApiResponse<T = any> {
  data: T
  success: boolean
  message?: string
}

export interface ApiErrorData {
  message: string
  status: number
  code?: string
}

// Custom error class
export class ApiError extends Error {
  public status: number
  public code?: string

  constructor({ message, status, code }: { message: string; status: number; code?: string }) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

/**
 * Core request function that handles all HTTP requests
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`

  const config: RequestInit = {
    ...options,
    headers: {
      ...API_CONFIG.HEADERS,
      ...options.headers,
    },
    credentials: 'include', // Include cookies for authentication
  }

  // Add timeout using AbortController
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)
  config.signal = controller.signal

  try {
    const response = await fetch(url, config)
    clearTimeout(timeoutId)

    // Check if response has content and is JSON
    const contentType = response.headers.get('content-type')
    const hasJsonContent = contentType && contentType.includes('application/json')

    let data: any = null

    // Only try to parse JSON if we have content and it's JSON
    if (hasJsonContent) {
      const text = await response.text()
      if (text.trim()) {
        try {
          data = JSON.parse(text)
        } catch (parseError) {
          throw new ApiError({
            message: 'Invalid JSON response from server',
            status: response.status,
            code: 'INVALID_JSON',
          })
        }
      }
    }

    if (!response.ok) {
      // Handle API error response format: { success: false, error: "message", details?: string | object }
      const errorMessage = data?.error || `HTTP ${response.status}: ${response.statusText}`
      const errorDetails = data?.details || undefined

      // Create enhanced error with original response data
      const apiError = new ApiError({
        message: errorMessage,
        status: response.status,
      })

      // Attach the original response data for more detailed error handling
      ;(apiError as any).responseData = {
        error: errorMessage,
        details: errorDetails,
        success: data?.success
      }

      throw apiError
    }

    // Return data or a default success response if no JSON content
    return data || { success: true, message: 'Request completed successfully' }
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiError({
          message: 'Request timeout',
          status: 408,
          code: 'TIMEOUT',
        })
      }

      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError({
        message: error.message || 'Network error',
        status: 0,
        code: 'NETWORK_ERROR',
      })
    }

    throw new ApiError({
      message: 'Unknown error occurred',
      status: 0,
      code: 'UNKNOWN_ERROR',
    })
  }
}

/**
 * HTTP GET request
 */
export async function get<T>(endpoint: string, options?: RequestInit): Promise<T> {
  return request<T>(endpoint, { ...options, method: 'GET' })
}

/**
 * HTTP POST request
 */
export async function post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
  return request<T>(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * HTTP PUT request
 */
export async function put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
  return request<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * HTTP DELETE request
 */
export async function deleteRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  return request<T>(endpoint, { ...options, method: 'DELETE' })
}

/**
 * HTTP PATCH request
 */
export async function patch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
  return request<T>(endpoint, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  })
}



// Export API functions as a convenient object (for backward compatibility)
export const apiClient = {
  get,
  post,
  put,
  delete: deleteRequest,
  patch,
}


