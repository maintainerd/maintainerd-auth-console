/**
 * Security Settings Hooks
 * Custom hooks for managing security settings using TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchGeneralSecuritySettings,
  updateGeneralSecuritySettings
} from '@/services/api/security-settings'
import type { GeneralSecuritySettingsPayload } from '@/services/api/security-settings/types'

/**
 * Query key factory for security settings
 */
export const securitySettingsKeys = {
  all: ['securitySettings'] as const,
  general: () => [...securitySettingsKeys.all, 'general'] as const,
}

/**
 * Hook to fetch general security settings
 */
export function useGeneralSecuritySettings() {
  return useQuery({
    queryKey: securitySettingsKeys.general(),
    queryFn: fetchGeneralSecuritySettings,
  })
}

/**
 * Hook to update general security settings
 */
export function useUpdateGeneralSecuritySettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: GeneralSecuritySettingsPayload) =>
      updateGeneralSecuritySettings(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: securitySettingsKeys.general() })
    },
  })
}
