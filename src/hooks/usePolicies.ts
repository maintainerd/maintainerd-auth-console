/**
 * Policies Hook
 * Custom hook for fetching policies using TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchPolicies, fetchPolicyById, createPolicy, updatePolicy, deletePolicy, updatePolicyStatus } from '@/services/api/policy'
import type {
  PolicyQueryParamsInterface,
  CreatePolicyRequestInterface,
  UpdatePolicyRequestInterface,
  UpdatePolicyStatusRequestInterface
} from '@/services/api/policy/types'

/**
 * Query key factory for policies
 */
export const policyKeys = {
  all: ['policies'] as const,
  lists: () => [...policyKeys.all, 'list'] as const,
  list: (params?: PolicyQueryParamsInterface) => [...policyKeys.lists(), params] as const,
  details: () => [...policyKeys.all, 'detail'] as const,
  detail: (id: string) => [...policyKeys.details(), id] as const,
}

/**
 * Hook to fetch policies with optional filters and pagination
 */
export function usePolicies(params?: PolicyQueryParamsInterface) {
  return useQuery({
    queryKey: policyKeys.list(params),
    queryFn: () => fetchPolicies(params),
  })
}

/**
 * Hook to fetch a single policy by ID
 */
export function usePolicy(policyId: string) {
  return useQuery({
    queryKey: policyKeys.detail(policyId),
    queryFn: () => fetchPolicyById(policyId),
    enabled: !!policyId,
  })
}

/**
 * Hook to create a new policy
 */
export function useCreatePolicy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePolicyRequestInterface) => createPolicy(data),
    onSuccess: () => {
      // Invalidate policies list to refetch
      queryClient.invalidateQueries({ queryKey: policyKeys.lists() })
    },
  })
}

/**
 * Hook to update an existing policy
 */
export function useUpdatePolicy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ policyId, data }: { policyId: string; data: UpdatePolicyRequestInterface }) =>
      updatePolicy(policyId, data),
    onSuccess: (_, variables) => {
      // Invalidate both the specific policy and the policies list
      queryClient.invalidateQueries({ queryKey: policyKeys.detail(variables.policyId) })
      queryClient.invalidateQueries({ queryKey: policyKeys.lists() })
    },
  })
}

/**
 * Hook to delete a policy
 */
export function useDeletePolicy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (policyId: string) => deletePolicy(policyId),
    onSuccess: () => {
      // Invalidate policies list to refetch
      queryClient.invalidateQueries({ queryKey: policyKeys.lists() })
    },
  })
}

/**
 * Hook to update policy status
 */
export function useUpdatePolicyStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ policyId, data }: { policyId: string; data: UpdatePolicyStatusRequestInterface }) =>
      updatePolicyStatus(policyId, data),
    onSuccess: (_, variables) => {
      // Invalidate both the specific policy and the policies list
      queryClient.invalidateQueries({ queryKey: policyKeys.detail(variables.policyId) })
      queryClient.invalidateQueries({ queryKey: policyKeys.lists() })
    },
  })
}

