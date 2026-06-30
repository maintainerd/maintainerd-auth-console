/**
 * Registration Flows Hook
 * Custom hook for fetching registration flows using TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchRegistrationFlows,
  fetchRegistrationFlow,
  fetchRegistrationFlowRoles,
  createRegistrationFlow,
  updateRegistrationFlow,
  deleteRegistrationFlow,
  updateRegistrationFlowStatus,
  assignRegistrationFlowRoles,
  removeRegistrationFlowRole,
} from '@/services/api/registration-flows'
import type {
  RegistrationFlowQueryParams,
  CreateRegistrationFlowRequest,
  UpdateRegistrationFlowRequest,
  UpdateRegistrationFlowStatusRequest
} from '@/services/api/registration-flows/types'

/**
 * Query key factory for registration flows
 */
export const registrationFlowKeys = {
  all: ['registrationFlows'] as const,
  lists: () => [...registrationFlowKeys.all, 'list'] as const,
  list: (params?: RegistrationFlowQueryParams) => [...registrationFlowKeys.lists(), params] as const,
  details: () => [...registrationFlowKeys.all, 'detail'] as const,
  detail: (id: string) => [...registrationFlowKeys.details(), id] as const,
  rolesList: (id: string) => [...registrationFlowKeys.detail(id), 'roles'] as const,
  roles: (id: string, params?: RegistrationFlowQueryParams) => [...registrationFlowKeys.rolesList(id), params] as const,
}

/**
 * Hook to fetch registration flows with optional filters and pagination
 */
export function useRegistrationFlows(params?: RegistrationFlowQueryParams) {
  return useQuery({
    queryKey: registrationFlowKeys.list(params),
    queryFn: () => fetchRegistrationFlows(params),
  })
}

/**
 * Hook to fetch a single registration flow by ID
 */
export function useRegistrationFlow(registrationFlowId: string) {
  return useQuery({
    queryKey: registrationFlowKeys.detail(registrationFlowId),
    queryFn: () => fetchRegistrationFlow(registrationFlowId),
    enabled: !!registrationFlowId,
  })
}

/**
 * Hook to create a new registration flow
 */
export function useCreateRegistrationFlow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateRegistrationFlowRequest) => createRegistrationFlow(data),
    onSuccess: () => {
      // Invalidate registration flows list to refetch
      queryClient.invalidateQueries({ queryKey: registrationFlowKeys.lists() })
    },
  })
}

/**
 * Hook to update an existing registration flow
 */
export function useUpdateRegistrationFlow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ registrationFlowId, data }: { registrationFlowId: string; data: UpdateRegistrationFlowRequest }) =>
      updateRegistrationFlow(registrationFlowId, data),
    onSuccess: (_, variables) => {
      // Invalidate the specific registration flow and the list
      queryClient.invalidateQueries({ queryKey: registrationFlowKeys.detail(variables.registrationFlowId) })
      queryClient.invalidateQueries({ queryKey: registrationFlowKeys.lists() })
    },
  })
}

/**
 * Hook to delete a registration flow
 */
export function useDeleteRegistrationFlow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (registrationFlowId: string) => deleteRegistrationFlow(registrationFlowId),
    onSuccess: () => {
      // Invalidate registration flows list to refetch
      queryClient.invalidateQueries({ queryKey: registrationFlowKeys.lists() })
    },
  })
}

/**
 * Hook to update registration flow status
 */
export function useUpdateRegistrationFlowStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ registrationFlowId, data }: { registrationFlowId: string; data: UpdateRegistrationFlowStatusRequest }) =>
      updateRegistrationFlowStatus(registrationFlowId, data),
    onSuccess: (_, variables) => {
      // Invalidate the specific registration flow and the list
      queryClient.invalidateQueries({ queryKey: registrationFlowKeys.detail(variables.registrationFlowId) })
      queryClient.invalidateQueries({ queryKey: registrationFlowKeys.lists() })
    },
  })
}

/**
 * Hook to fetch roles associated with a registration flow
 */
export function useRegistrationFlowRoles(registrationFlowId: string, params?: RegistrationFlowQueryParams) {
  return useQuery({
    queryKey: registrationFlowKeys.roles(registrationFlowId, params),
    queryFn: () => fetchRegistrationFlowRoles(registrationFlowId, params),
    enabled: !!registrationFlowId,
  })
}

/**
 * Hook to assign roles to a registration flow
 */
export function useAssignRegistrationFlowRoles() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ registrationFlowId, data }: { registrationFlowId: string; data: { role_uuids: string[] } }) =>
      assignRegistrationFlowRoles(registrationFlowId, data),
    onSuccess: (_, variables) => {
      // Invalidate the roles list for this registration flow
      queryClient.invalidateQueries({ queryKey: registrationFlowKeys.rolesList(variables.registrationFlowId) })
    },
  })
}

/**
 * Hook to detach a single role from a registration flow
 */
export function useRemoveRegistrationFlowRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ registrationFlowId, roleId }: { registrationFlowId: string; roleId: string }) =>
      removeRegistrationFlowRole(registrationFlowId, roleId),
    onSuccess: (_, variables) => {
      // Invalidate the roles list for this registration flow
      queryClient.invalidateQueries({ queryKey: registrationFlowKeys.rolesList(variables.registrationFlowId) })
    },
  })
}

