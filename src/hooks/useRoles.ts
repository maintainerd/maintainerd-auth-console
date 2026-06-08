/**
 * Roles Hook
 * Custom hook for fetching Roles using TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  fetchRoles, 
  fetchRoleById, 
  createRole, 
  updateRole, 
  deleteRole, 
  updateRoleStatus,
  addRolePermissions,
  removeRolePermission
} from '@/services/api/roles'
import type {
  RoleQueryParams,
  CreateRoleRequest,
  UpdateRoleRequest,
  UpdateRoleStatusRequest,
  AddRolePermissionsRequest
} from '@/services/api/roles/types'

/**
 * Query key factory for Roles
 */
export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  list: (params?: RoleQueryParams) => [...roleKeys.lists(), params] as const,
  details: () => [...roleKeys.all, 'detail'] as const,
  detail: (id: string) => [...roleKeys.details(), id] as const,
}

/**
 * Hook to fetch Roles with optional filters and pagination
 */
export function useRoles(params?: RoleQueryParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: roleKeys.list(params),
    queryFn: () => fetchRoles(params),
    enabled: options?.enabled,
  })
}

/**
 * Hook to fetch a single Role by ID
 */
export function useRole(roleId: string) {
  return useQuery({
    queryKey: roleKeys.detail(roleId),
    queryFn: () => fetchRoleById(roleId),
    enabled: !!roleId,
  })
}

/**
 * Hook to create a new Role
 */
export function useCreateRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateRoleRequest) => createRole(data),
    onSuccess: () => {
      // Invalidate Roles list to refetch
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() })
    },
  })
}

/**
 * Hook to update an existing Role
 */
export function useUpdateRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ roleId, data }: { roleId: string; data: UpdateRoleRequest }) =>
      updateRole(roleId, data),
    onSuccess: (_, variables) => {
      // Invalidate both the specific Role and the Roles list
      queryClient.invalidateQueries({ queryKey: roleKeys.detail(variables.roleId) })
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() })
    },
  })
}

/**
 * Hook to delete a Role
 */
export function useDeleteRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (roleId: string) => deleteRole(roleId),
    onSuccess: () => {
      // Invalidate Roles list to refetch
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() })
    },
  })
}

/**
 * Hook to update Role status
 */
export function useUpdateRoleStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ roleId, data }: { roleId: string; data: UpdateRoleStatusRequest }) =>
      updateRoleStatus(roleId, data),
    onSuccess: (_, variables) => {
      // Invalidate both the specific Role and the Roles list
      queryClient.invalidateQueries({ queryKey: roleKeys.detail(variables.roleId) })
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() })
    },
  })
}

/**
 * Hook to add permissions to a role
 */
export function useAddRolePermissions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ roleId, data }: { roleId: string; data: AddRolePermissionsRequest }) =>
      addRolePermissions(roleId, data),
    onSuccess: (_, variables) => {
      // Invalidate role permissions queries to refetch
      queryClient.invalidateQueries({ queryKey: ['role-permissions', variables.roleId] })
    },
  })
}

/**
 * Hook to remove a permission from a role
 */
export function useRemoveRolePermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ roleId, permissionId }: { roleId: string; permissionId: string }) =>
      removeRolePermission(roleId, permissionId),
    onSuccess: (_, variables) => {
      // Invalidate role permissions queries to refetch
      queryClient.invalidateQueries({ queryKey: ['role-permissions', variables.roleId] })
    },
  })
}
