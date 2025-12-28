/**
 * Tenants Hook
 * Custom hook for tenant CRUD operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/useToast'
import { 
  fetchTenantList, 
  fetchTenantById, 
  createTenant, 
  updateTenant, 
  deleteTenant 
} from '@/services/api/tenant'
import type { TenantListParams, CreateTenantRequest, UpdateTenantRequest } from '@/services/api/tenant/types'

/**
 * Hook to fetch tenants list
 */
export function useTenantsList(params?: TenantListParams) {
  return useQuery({
    queryKey: ['tenants', params],
    queryFn: () => fetchTenantList(params)
  })
}

/**
 * Hook to fetch single tenant by ID
 */
export function useTenantById(tenantId: string | undefined) {
  return useQuery({
    queryKey: ['tenant', tenantId],
    queryFn: () => fetchTenantById(tenantId!),
    enabled: !!tenantId
  })
}

/**
 * Hook to create a new tenant
 */
export function useCreateTenant() {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useToast()

  return useMutation({
    mutationFn: (data: CreateTenantRequest) => createTenant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
      showSuccess('Tenant created successfully')
    },
    onError: (error: Error) => {
      showError(error, 'Failed to create tenant')
    }
  })
}

/**
 * Hook to update tenant
 */
export function useUpdateTenant() {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useToast()

  return useMutation({
    mutationFn: ({ tenantId, data }: { tenantId: string; data: UpdateTenantRequest }) => 
      updateTenant(tenantId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
      queryClient.invalidateQueries({ queryKey: ['tenant', variables.tenantId] })
      showSuccess('Tenant updated successfully')
    },
    onError: (error: Error) => {
      showError(error, 'Failed to update tenant')
    }
  })
}

/**
 * Hook to delete tenant
 */
export function useDeleteTenant() {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useToast()

  return useMutation({
    mutationFn: (tenantId: string) => deleteTenant(tenantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
      showSuccess('Tenant deleted successfully')
    },
    onError: (error: Error) => {
      showError(error, 'Failed to delete tenant')
    }
  })
}
