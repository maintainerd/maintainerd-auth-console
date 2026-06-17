import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchFeatureFlags, updateFeatureFlags } from '@/services/api/feature-flags'
import type { FeatureFlagsPayload } from '@/services/api/feature-flags/types'

export const featureFlagsKeys = {
  all: ['featureFlags'] as const,
  detail: () => [...featureFlagsKeys.all, 'detail'] as const,
}

export function useFeatureFlags() {
  return useQuery({
    queryKey: featureFlagsKeys.detail(),
    queryFn: fetchFeatureFlags,
  })
}

export function useUpdateFeatureFlags() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: FeatureFlagsPayload) => updateFeatureFlags(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: featureFlagsKeys.all }),
  })
}
