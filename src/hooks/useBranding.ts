/**
 * Branding hooks (TanStack Query)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchBrandings,
  createBranding,
  updateBranding,
  activateBranding,
  deleteBranding,
} from '@/services/api/branding'
import type { BrandingRequest } from '@/services/api/branding/types'

export const brandingKeys = {
  all: ['branding'] as const,
  list: () => [...brandingKeys.all, 'list'] as const,
}

export function useBrandings() {
  return useQuery({
    queryKey: brandingKeys.list(),
    queryFn: fetchBrandings,
  })
}

// Single branding, derived from the list (there is no GET-by-id endpoint).
export function useBranding(brandingId: string | undefined) {
  const query = useBrandings()
  const data = brandingId ? query.data?.find((b) => b.branding_id === brandingId) : undefined
  return { ...query, data }
}


export function useCreateBranding() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: BrandingRequest) => createBranding(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandingKeys.list() })
    },
  })
}

export function useUpdateBranding() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ brandingId, data }: { brandingId: string; data: BrandingRequest }) =>
      updateBranding(brandingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandingKeys.list() })
    },
  })
}

export function useActivateBranding() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (brandingId: string) => activateBranding(brandingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandingKeys.list() })
    },
  })
}

export function useDeleteBranding() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (brandingId: string) => deleteBranding(brandingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandingKeys.list() })
    },
  })
}
