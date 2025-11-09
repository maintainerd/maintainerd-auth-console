/**
 * Custom hook for toast notifications
 * Provides consistent toast messaging across the application
 */

import { toast } from "sonner"

export interface UseToastOptions {
  defaultErrorTitle?: string
  defaultErrorDescription?: string
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

  return {
    showError,
    showSuccess,
    showInfo,
    showWarning
  }
}
