/**
 * Custom hook for toast notifications
 * Provides consistent toast messaging across the application
 */

import { toast } from "sonner"

export interface UseToastOptions {
  defaultErrorTitle?: string
  defaultErrorDescription?: string
}

export interface ParsedError {
  message: string
  fieldErrors?: Record<string, string>
  isValidationError: boolean
}

export function useToast(options: UseToastOptions = {}) {
  const {
    defaultErrorTitle = "Error",
    defaultErrorDescription = "An unexpected error occurred"
  } = options

  const showError = (
    error: unknown,
    title?: string,
    description?: string
  ) => {
    let errorMessage = description || defaultErrorDescription

    // Extract error message from different error types
    if (error instanceof Error) {
      errorMessage = error.message

      // Check if this is an API error with responseData
      const apiError = error as any
      if (apiError.responseData) {
        const { error: apiErrorMessage, details } = apiError.responseData

        if (details) {
          if (typeof details === 'string') {
            // Simple string details
            errorMessage = `${apiErrorMessage}: ${details}`
          } else if (typeof details === 'object' && details !== null) {
            // Object with field-specific errors
            const fieldErrors = Object.entries(details)
              .map(([field, message]) => `${field}: ${message}`)
              .join(', ')
            errorMessage = `${apiErrorMessage} - ${fieldErrors}`
          }
        } else {
          errorMessage = apiErrorMessage
        }
      }
    } else if (typeof error === 'string') {
      errorMessage = error
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message)
    }

    toast.error(title || defaultErrorTitle, {
      description: errorMessage
    })
  }

  const showSuccess = (
    title: string,
    description?: string
  ) => {
    toast.success(title, {
      description
    })
  }

  const showInfo = (
    title: string,
    description?: string
  ) => {
    toast.info(title, {
      description
    })
  }

  const showWarning = (
    title: string,
    description?: string
  ) => {
    toast.warning(title, {
      description
    })
  }

  const parseError = (error: unknown): ParsedError => {
    let message = defaultErrorDescription
    let fieldErrors: Record<string, string> | undefined
    let isValidationError = false

    if (error instanceof Error) {
      message = error.message

      // Check if this is an API error with responseData
      const apiError = error as any
      if (apiError.responseData) {
        const { error: apiErrorMessage, details } = apiError.responseData

        if (details) {
          if (typeof details === 'string') {
            // Simple string details
            message = `${apiErrorMessage}: ${details}`
          } else if (typeof details === 'object' && details !== null) {
            // Object with field-specific errors - this is a validation error
            fieldErrors = details as Record<string, string>
            message = apiErrorMessage
            isValidationError = true
          }
        } else {
          message = apiErrorMessage
        }
      }
    } else if (typeof error === 'string') {
      message = error
    } else if (error && typeof error === 'object' && 'message' in error) {
      message = String(error.message)
    }

    return {
      message,
      fieldErrors,
      isValidationError
    }
  }

  return {
    showError,
    showSuccess,
    showInfo,
    showWarning,
    parseError
  }
}
