/**
 * Session Settings Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchSessionSettings, updateSessionSettings } from '@/services/api/session-settings'
import type { SessionSettingsPayload } from '@/services/api/session-settings/types'

/**
 * Query keys for session settings
 */
export const sessionSettingsKeys = {
  all: ['session-settings'] as const,
  detail: () => [...sessionSettingsKeys.all, 'detail'] as const,
}

/**
 * Fetch session settings
 */
export function useSessionSettings() {
  return useQuery({
    queryKey: sessionSettingsKeys.detail(),
    queryFn: fetchSessionSettings,
  })
}

/**
 * Update session settings
 */
export function useUpdateSessionSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SessionSettingsPayload) => updateSessionSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionSettingsKeys.all })
    },
  })
}
