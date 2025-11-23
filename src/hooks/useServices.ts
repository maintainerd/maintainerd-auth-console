/**
 * Services Hook
 * Custom hook for fetching services using TanStack Query
 */

import { useQuery } from '@tanstack/react-query'
import { fetchServices } from '@/services/api/service'
import type { ServiceQueryParamsInterface } from '@/services/api/service/types'

/**
 * Query key factory for services
 */
export const serviceKeys = {
  all: ['services'] as const,
  lists: () => [...serviceKeys.all, 'list'] as const,
  list: (params?: ServiceQueryParamsInterface) => [...serviceKeys.lists(), params] as const,
}

/**
 * Hook to fetch services with optional filters and pagination
 */
export function useServices(params?: ServiceQueryParamsInterface) {
  return useQuery({
    queryKey: serviceKeys.list(params),
    queryFn: () => fetchServices(params),
  })
}

