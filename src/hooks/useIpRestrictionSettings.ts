/**
 * IP Restriction Settings Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchIpRestrictionSettings,
  updateIpRestrictionSettings,
} from '@/services/api/ip-restriction-settings'
import type { IpRestrictionSettingsPayload } from '@/services/api/ip-restriction-settings/types'

const ipRestrictionSettingsKeys = {
  all: ['ip-restriction-settings'] as const,
  settings: () => [...ipRestrictionSettingsKeys.all, 'settings'] as const,
}

export function useIpRestrictionSettings() {
  return useQuery({
    queryKey: ipRestrictionSettingsKeys.settings(),
    queryFn: fetchIpRestrictionSettings,
  })
}

export function useUpdateIpRestrictionSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: IpRestrictionSettingsPayload) =>
      updateIpRestrictionSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ipRestrictionSettingsKeys.all })
    },
  })
}
