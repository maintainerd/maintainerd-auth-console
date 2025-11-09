/**
 * Common API Types
 * Shared type definitions used across multiple APIs
 */

export interface ApiResponse<T = any> {
  data: T
  success: boolean
  message?: string
}

export interface ApiErrorResponse {
  success: false
  error: string
  details?: string
}
