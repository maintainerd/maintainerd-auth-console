/**
 * Service Types
 * Types specific to service layer operations
 */

// Service-specific response types that don't need to be global
export interface ServiceResponseType<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Service operation result types
export interface ServiceOperationResultType {
  success: boolean
  message?: string
  error?: string
}

// Service validation result types
export interface ServiceValidationResultType {
  isValid: boolean
  message?: string
}
