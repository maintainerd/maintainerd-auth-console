/**
 * Signup Flows Hook
 * Custom hook for fetching signup flows using TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchSignupFlows,
  fetchSignupFlowById,
  fetchSignupFlowRoles,
  createSignupFlow,
  updateSignupFlow,
  deleteSignupFlow,
  updateSignupFlowStatus,
  assignSignupFlowRoles,
  removeSignupFlowRole
} from '@/services/api/signup-flow'
import type {
  SignupFlowQueryParamsInterface,
  CreateSignupFlowRequestInterface,
  UpdateSignupFlowRequestInterface,
  UpdateSignupFlowStatusRequestInterface
} from '@/services/api/signup-flow/types'

/**
 * Query key factory for signup flows
 */
export const signupFlowKeys = {
  all: ['signupFlows'] as const,
  lists: () => [...signupFlowKeys.all, 'list'] as const,
  list: (params?: SignupFlowQueryParamsInterface) => [...signupFlowKeys.lists(), params] as const,
  details: () => [...signupFlowKeys.all, 'detail'] as const,
  detail: (id: string) => [...signupFlowKeys.details(), id] as const,
  rolesList: (id: string) => [...signupFlowKeys.detail(id), 'roles'] as const,
  roles: (id: string, params?: SignupFlowQueryParamsInterface) => [...signupFlowKeys.rolesList(id), params] as const,
}

/**
 * Hook to fetch signup flows with optional filters and pagination
 */
export function useSignupFlows(params?: SignupFlowQueryParamsInterface) {
  return useQuery({
    queryKey: signupFlowKeys.list(params),
    queryFn: () => fetchSignupFlows(params),
  })
}

/**
 * Hook to fetch a single signup flow by ID
 */
export function useSignupFlow(signupFlowId: string) {
  return useQuery({
    queryKey: signupFlowKeys.detail(signupFlowId),
    queryFn: () => fetchSignupFlowById(signupFlowId),
    enabled: !!signupFlowId,
  })
}

/**
 * Hook to create a new signup flow
 */
export function useCreateSignupFlow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSignupFlowRequestInterface) => createSignupFlow(data),
    onSuccess: () => {
      // Invalidate signup flows list to refetch
      queryClient.invalidateQueries({ queryKey: signupFlowKeys.lists() })
    },
  })
}

/**
 * Hook to update an existing signup flow
 */
export function useUpdateSignupFlow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ signupFlowId, data }: { signupFlowId: string; data: UpdateSignupFlowRequestInterface }) =>
      updateSignupFlow(signupFlowId, data),
    onSuccess: (_, variables) => {
      // Invalidate the specific signup flow and the list
      queryClient.invalidateQueries({ queryKey: signupFlowKeys.detail(variables.signupFlowId) })
      queryClient.invalidateQueries({ queryKey: signupFlowKeys.lists() })
    },
  })
}

/**
 * Hook to delete a signup flow
 */
export function useDeleteSignupFlow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (signupFlowId: string) => deleteSignupFlow(signupFlowId),
    onSuccess: () => {
      // Invalidate signup flows list to refetch
      queryClient.invalidateQueries({ queryKey: signupFlowKeys.lists() })
    },
  })
}

/**
 * Hook to update signup flow status
 */
export function useUpdateSignupFlowStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ signupFlowId, data }: { signupFlowId: string; data: UpdateSignupFlowStatusRequestInterface }) =>
      updateSignupFlowStatus(signupFlowId, data),
    onSuccess: (_, variables) => {
      // Invalidate the specific signup flow and the list
      queryClient.invalidateQueries({ queryKey: signupFlowKeys.detail(variables.signupFlowId) })
      queryClient.invalidateQueries({ queryKey: signupFlowKeys.lists() })
    },
  })
}

/**
 * Hook to fetch roles associated with a signup flow
 */
export function useSignupFlowRoles(signupFlowId: string, params?: SignupFlowQueryParamsInterface) {
  return useQuery({
    queryKey: signupFlowKeys.roles(signupFlowId, params),
    queryFn: () => fetchSignupFlowRoles(signupFlowId, params),
    enabled: !!signupFlowId,
  })
}

/**
 * Hook to assign roles to a signup flow
 */
export function useAssignSignupFlowRoles() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ signupFlowId, data }: { signupFlowId: string; data: { role_uuids: string[] } }) =>
      assignSignupFlowRoles(signupFlowId, data),
    onSuccess: (_, variables) => {
      // Invalidate the roles list for this signup flow
      queryClient.invalidateQueries({ queryKey: signupFlowKeys.rolesList(variables.signupFlowId) })
    },
  })
}

/**
 * Hook to remove a role from a signup flow
 */
export function useRemoveSignupFlowRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ signupFlowId, roleId }: { signupFlowId: string; roleId: string }) =>
      removeSignupFlowRole(signupFlowId, roleId),
    onSuccess: (_, variables) => {
      // Invalidate the roles list for this signup flow
      queryClient.invalidateQueries({ queryKey: signupFlowKeys.rolesList(variables.signupFlowId) })
    },
  })
}
