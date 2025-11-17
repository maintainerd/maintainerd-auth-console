/**
 * API Client
 * Base HTTP client with common functionality like error handling, timeouts, etc.
 */

import axios, { type AxiosError, type AxiosRequestConfig } from 'axios'
import { API_CONFIG } from './config'
import './debug' // Import debug utilities in development

// Custom error class
export class ApiError extends Error {
  public status: number
  public code?: string
  public responseData?: {
    error: string | object
    details?: string | object
    success?: boolean
  }

  constructor({ message, status, code }: { message: string; status: number; code?: string }) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

// Create axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
  withCredentials: true, // Include cookies for authentication
})

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      const data = error.response.data as any
      const errorMessage = data?.error || `HTTP ${error.response.status}: ${error.response.statusText}`
      const errorDetails = data?.details || undefined

      const apiError = new ApiError({
        message: errorMessage,
        status: error.response.status,
      })

      // Attach the original response data for more detailed error handling
      apiError.responseData = {
        error: errorMessage,
        details: errorDetails,
        success: data?.success
      }

      throw apiError
    } else if (error.code === 'ECONNABORTED') {
      // Request timeout
      throw new ApiError({
        message: 'Request timeout',
        status: 408,
        code: 'TIMEOUT',
      })
    } else if (error.request) {
      // Request was made but no response received
      throw new ApiError({
        message: error.message || 'Network error',
        status: 0,
        code: 'NETWORK_ERROR',
      })
    } else {
      // Something else happened
      throw new ApiError({
        message: error.message || 'Unknown error occurred',
        status: 0,
        code: 'UNKNOWN_ERROR',
      })
    }
  }
)

/**
 * HTTP GET request
 */
export async function get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await axiosInstance.get<T>(endpoint, config)
  return response.data || ({ success: true, message: 'Request completed successfully' } as T)
}

/**
 * HTTP POST request
 */
export async function post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  const response = await axiosInstance.post<T>(endpoint, data, config)
  return response.data || ({ success: true, message: 'Request completed successfully' } as T)
}

/**
 * HTTP PUT request
 */
export async function put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  const response = await axiosInstance.put<T>(endpoint, data, config)
  return response.data || ({ success: true, message: 'Request completed successfully' } as T)
}

/**
 * HTTP DELETE request
 */
export async function deleteRequest<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await axiosInstance.delete<T>(endpoint, config)
  return response.data || ({ success: true, message: 'Request completed successfully' } as T)
}

/**
 * HTTP PATCH request
 */
export async function patch<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  const response = await axiosInstance.patch<T>(endpoint, data, config)
  return response.data || ({ success: true, message: 'Request completed successfully' } as T)
}



// Export API functions as a convenient object (for backward compatibility)
export const apiClient = {
  get,
  post,
  put,
  delete: deleteRequest,
  patch,
}


