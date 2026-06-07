/**
 * User Pools Hook
 * Custom hooks for User Pool operations using TanStack Query.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchUserPools,
  fetchUserPoolById,
  createUserPool,
  updateUserPool,
  deleteUserPool,
} from '@/services/api/user-pools'
import type {
  CreateUserPoolRequest,
  UpdateUserPoolRequest,
} from '@/services/api/user-pools/types'

/**
 * Query key factory for User Pools
 */
export const userPoolKeys = {
  all: ['user-pools'] as const,
  lists: () => [...userPoolKeys.all, 'list'] as const,
  details: () => [...userPoolKeys.all, 'detail'] as const,
  detail: (id: string) => [...userPoolKeys.details(), id] as const,
}

/**
 * Hook to fetch all user pools for the current tenant
 */
export function useUserPools() {
  return useQuery({
    queryKey: userPoolKeys.lists(),
    queryFn: fetchUserPools,
  })
}

/**
 * Hook to fetch a single user pool by UUID
 */
export function useUserPool(userPoolId: string) {
  return useQuery({
    queryKey: userPoolKeys.detail(userPoolId),
    queryFn: () => fetchUserPoolById(userPoolId),
    enabled: !!userPoolId,
  })
}

/**
 * Hook to create a new user pool
 */
export function useCreateUserPool() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserPoolRequest) => createUserPool(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userPoolKeys.lists() })
    },
  })
}

/**
 * Hook to update an existing user pool
 */
export function useUpdateUserPool() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userPoolId, data }: { userPoolId: string; data: UpdateUserPoolRequest }) =>
      updateUserPool(userPoolId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userPoolKeys.detail(variables.userPoolId) })
      queryClient.invalidateQueries({ queryKey: userPoolKeys.lists() })
    },
  })
}

/**
 * Hook to delete a user pool
 */
export function useDeleteUserPool() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userPoolId: string) => deleteUserPool(userPoolId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userPoolKeys.lists() })
    },
  })
}
