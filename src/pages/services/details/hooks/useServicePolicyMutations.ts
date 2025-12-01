/**
 * Custom hook for managing service policy assignments
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { assignPolicyToService, removePolicyFromService } from '@/services'
import { toast } from 'react-toastify'

export function useServicePolicyMutations(serviceId: string) {
  const queryClient = useQueryClient()

  const assignPolicy = useMutation({
    mutationFn: (policyId: string) => assignPolicyToService(serviceId, policyId),
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['policies'] })
      queryClient.invalidateQueries({ queryKey: ['service', serviceId] })
      toast.success('Policy assigned successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to assign policy')
    },
  })

  const removePolicy = useMutation({
    mutationFn: (policyId: string) => removePolicyFromService(serviceId, policyId),
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['policies'] })
      queryClient.invalidateQueries({ queryKey: ['service', serviceId] })
      toast.success('Policy removed successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove policy')
    },
  })

  return {
    assignPolicy,
    removePolicy,
  }
}

