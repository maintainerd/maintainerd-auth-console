/**
 * Permissions Hook
 * Custom hook for fetching permissions using TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  fetchPermissions, 
  fetchPermissionById, 
  createPermission, 
  updatePermission, 
  deletePermission, 
  updatePermissionStatus 
} from '@/services/api/permissions'
import type {
  PermissionQueryParams,
  CreatePermissionRequest,
  UpdatePermissionRequest,
  UpdatePermissionStatusRequest
} from '@/services/api/permissions/types'

/**
 * Query key factory for permissions
 */
export const permissionKeys = {
  all: ['permissions'] as const,
  lists: () => [...permissionKeys.all, 'list'] as const,
  list: (params?: PermissionQueryParams) => [...permissionKeys.lists(), params] as const,
  details: () => [...permissionKeys.all, 'detail'] as const,
  detail: (id: string) => [...permissionKeys.details(), id] as const,
}

/**
 * Hook to fetch permissions with optional filters
 */
export function usePermissions(params?: PermissionQueryParams) {
  return useQuery({
    queryKey: permissionKeys.list(params),
    queryFn: () => fetchPermissions(params),
  })
}

/**
 * Hook to fetch a single permission by ID
 */
export function usePermission(permissionId: string) {
  return useQuery({
    queryKey: permissionKeys.detail(permissionId),
    queryFn: () => fetchPermissionById(permissionId),
    enabled: !!permissionId,
  })
}

/**
 * Hook to create a new permission
 */
export function useCreatePermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePermissionRequest) => createPermission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permissionKeys.lists() })
    },
  })
}

/**
 * Hook to update a permission
 */
export function useUpdatePermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ permissionId, data }: { permissionId: string; data: UpdatePermissionRequest }) =>
      updatePermission(permissionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: permissionKeys.detail(variables.permissionId) })
      queryClient.invalidateQueries({ queryKey: permissionKeys.lists() })
    },
  })
}

/**
 * Hook to delete a permission
 */
export function useDeletePermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (permissionId: string) => deletePermission(permissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permissionKeys.lists() })
    },
  })
}

/**
 * Hook to update permission status
 */
export function useUpdatePermissionStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ permissionId, data }: { permissionId: string; data: UpdatePermissionStatusRequest }) =>
      updatePermissionStatus(permissionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: permissionKeys.detail(variables.permissionId) })
      queryClient.invalidateQueries({ queryKey: permissionKeys.lists() })
    },
  })
}

