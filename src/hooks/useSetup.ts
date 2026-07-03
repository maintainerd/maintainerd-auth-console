/**
 * Setup Hooks
 * Custom hooks for setup operations (tenant, admin, profile)
 */
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/useToast'
import {
  createTenantWithDefaults,
  createAdmin,
  completeSetup,
  getSetupStatus,
} from '@/services'
import type { CreateAdminRequest, SetupStatusData } from '@/services/api/setup/types'

export function useSetupStatus() {
  const [status, setStatus] = useState<SetupStatusData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const checkStatus = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await getSetupStatus()
      if (response.success && response.data) {
        setStatus(response.data)
        return response.data
      }
      return null
    } catch {
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { status, isLoading, checkStatus }
}

export function useSetupTenant() {
  const navigate = useNavigate()
  const { showError, showSuccess } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const createTenantWithDefaultsHook = useCallback(
    async (name: string, display_name: string, description?: string) => {
      setIsLoading(true)
      try {
        const response = await createTenantWithDefaults(name, display_name, description || '')
        showSuccess('Tenant created successfully!')
        navigate('/setup/admin')
        return { success: true, data: response }
      } catch (error: unknown) {
        if (error instanceof Error) {
          showError(error, 'Failed to create tenant')
          return { success: false, message: error.message }
        }
        showError('Unknown error', 'Failed to create tenant')
        return { success: false, message: 'Unknown error' }
      } finally {
        setIsLoading(false)
      }
    },
    [navigate, showError, showSuccess],
  )

  return { isLoading, createTenantWithDefaults: createTenantWithDefaultsHook }
}

export function useSetupAdmin() {
  const navigate = useNavigate()
  const { showError, showSuccess } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const createAdminAccount = useCallback(
    async (data: { email: string; password: string }) => {
      setIsLoading(true)
      try {
        const adminData: CreateAdminRequest = {
          username: data.email,
          fullname: data.email.split('@')[0],
          password: data.password,
          email: data.email,
        }
        await createAdmin(adminData)
        showSuccess('Admin account created successfully!')
        navigate('/')
        return { success: true }
      } catch (error: unknown) {
        if (error instanceof Error) {
          showError(error, 'Failed to create admin account')
          return { success: false, message: error.message }
        }
        showError('Unknown error', 'Failed to create admin account')
        return { success: false, message: 'Unknown error' }
      } finally {
        setIsLoading(false)
      }
    },
    [navigate, showError, showSuccess],
  )

  return { isLoading, createAdminAccount }
}

export function useCompleteSetup() {
  const { showError, showSuccess } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const finalizeSetup = useCallback(async () => {
    setIsLoading(true)
    try {
      await completeSetup()
      showSuccess('Setup completed successfully!')
      return { success: true }
    } catch (error: unknown) {
      if (error instanceof Error) {
        showError(error, 'Failed to complete setup')
        return { success: false, message: error.message }
      }
      showError('Unknown error', 'Failed to complete setup')
      return { success: false, message: 'Unknown error' }
    } finally {
      setIsLoading(false)
    }
  }, [showError, showSuccess])

  return { isLoading, finalizeSetup }
}
