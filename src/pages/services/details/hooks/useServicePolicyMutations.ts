/**
 * Custom hook for managing service policy assignments
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { assignPolicyToService, removePolicyFromService } from '@/services'
import { policyKeys } from '@/hooks/usePolicies'
import { serviceKeys } from '@/hooks/useServices'

// Success/error feedback lives with the calling component (useToast), matching
// the shared mutation-hook convention: hooks only mutate and invalidate.
export function useServicePolicyMutations(serviceId: string) {
  const queryClient = useQueryClient()

  const invalidate = () => {
    // The assigned-policies tab lists policies filtered by service_id.
    queryClient.invalidateQueries({ queryKey: policyKeys.all })
    // Service detail + listing carry the policy_count.
    queryClient.invalidateQueries({ queryKey: serviceKeys.detail(serviceId) })
    queryClient.invalidateQueries({ queryKey: serviceKeys.lists() })
  }

  const assignPolicy = useMutation({
    mutationFn: (policyId: string) => assignPolicyToService(serviceId, policyId),
    onSuccess: invalidate,
  })

  const removePolicy = useMutation({
    mutationFn: (policyId: string) => removePolicyFromService(serviceId, policyId),
    onSuccess: invalidate,
  })

  return {
    assignPolicy,
    removePolicy,
  }
}
