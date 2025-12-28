/**
 * Setup Hooks
 * Custom hooks for setup operations (tenant, admin, profile)
 * These don't use Redux since they're one-time operations
 */

import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/useToast'
import { useAppDispatch } from '@/store/hooks'
import { setProfile } from '@/store/auth/reducers'
import { createTenantWithDefaults, createAdmin, createProfile } from '@/services'
import type { CreateAdminRequest, CreateProfileRequest } from '@/services/api/setup/types'

/**
 * Hook for tenant setup operations
 */
export function useSetupTenant() {
  const navigate = useNavigate()
  const { showError, showSuccess } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const createTenantWithDefaultsHook = useCallback(async (name: string, display_name: string, description?: string) => {
    setIsLoading(true)
    try {
      const response = await createTenantWithDefaults(name, display_name, description || '')
      showSuccess("Tenant created successfully!")
      navigate('/setup/admin')
      return { success: true, data: response }
    } catch (error: unknown) {
      if (error instanceof Error) {
        showError(error, "Failed to create tenant")
        return { success: false, message: error.message }
      } else {
        showError('Unknown error', "Failed to create tenant")
        return { success: false, message: 'Unknown error' }
      }
    } finally {
      setIsLoading(false)
    }
  }, [navigate, showError, showSuccess])

  return {
    isLoading,
    createTenantWithDefaults: createTenantWithDefaultsHook
  }
}

/**
 * Hook for admin setup operations
 */
export function useSetupAdmin() {
  const navigate = useNavigate()
  const { showError, showSuccess } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const createAdminAccount = useCallback(async (data: {
    fullname: string
    email: string
    password: string
  }) => {
    setIsLoading(true)
    try {
      const adminData: CreateAdminRequest = {
        username: data.email, // Use email as username
        fullname: data.fullname,
        password: data.password,
        email: data.email
      }
      
      const response = await createAdmin(adminData)
      showSuccess("Admin account created successfully!")
      navigate('/setup/profile')
      return { success: true, data: response }
    } catch (error: unknown) {
      if (error instanceof Error) {
        showError(error, "Failed to create admin account")
        return { success: false, message: error.message }
      } else {
        showError('Unknown error', "Failed to create admin account")
        return { success: false, message: 'Unknown error' }
      }
    } finally {
      setIsLoading(false)
    }
  }, [navigate, showError, showSuccess])

  return {
    isLoading,
    createAdminAccount
  }
}

/**
 * Hook for profile setup operations
 */
export function useSetupProfile() {
  const { showError, parseError } = useToast()
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)

  const createUserProfile = useCallback(async (data: CreateProfileRequest) => {
    setIsLoading(true)
    try {
      const response = await createProfile(data)
      // Update Redux with the new profile
      if (response.success && response.data) {
        dispatch(setProfile(response.data))
      }
      // Don't navigate here - let the component handle success state
      // Don't show success toast here - let the success page handle it
      return { success: true, data: response }
    } catch (error: unknown) {
      // Parse the error to check if it's a validation error with field-specific details
      const parsedError = parseError(error)

      if (parsedError.isValidationError && parsedError.fieldErrors) {
        // Handle field-specific validation errors
        const fieldErrorMessages = Object.entries(parsedError.fieldErrors)
          .map(([field, message]) => `${field}: ${message}`)
          .join('\n')

        showError(`${parsedError.message}\n\nField errors:\n${fieldErrorMessages}`, "Validation Failed")
      } else if (error instanceof Error) {
        // Handle general errors
        showError(error, "Failed to create profile")
      } else {
        showError('Unknown error', "Failed to create profile")
      }

      return { success: false, message: (error instanceof Error ? error.message : 'Unknown error'), fieldErrors: parsedError.fieldErrors }
    } finally {
      setIsLoading(false)
    }
  }, [showError, parseError, dispatch])

  return {
    isLoading,
    createUserProfile
  }
}
