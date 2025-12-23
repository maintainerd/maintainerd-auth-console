/**
 * Password Policies Hooks
 * Custom hooks for managing password policies using TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchPasswordPolicies,
  updatePasswordPolicies
} from '@/services/api/password-policies'
import type { PasswordPoliciesPayload } from '@/services/api/password-policies/types'

/**
 * Query key factory for password policies
 */
export const passwordPoliciesKeys = {
  all: ['passwordPolicies'] as const,
  detail: () => [...passwordPoliciesKeys.all, 'detail'] as const,
}

/**
 * Hook to fetch password policies
 */
export function usePasswordPolicies() {
  return useQuery({
    queryKey: passwordPoliciesKeys.detail(),
    queryFn: fetchPasswordPolicies,
  })
}

/**
 * Hook to update password policies
 */
export function useUpdatePasswordPolicies() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: PasswordPoliciesPayload) =>
      updatePasswordPolicies(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: passwordPoliciesKeys.detail() })
    },
  })
}
