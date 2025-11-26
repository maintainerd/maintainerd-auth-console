/**
 * Services Hook
 * Custom hook for fetching services using TanStack Query
 */

import { useQuery } from '@tanstack/react-query'
import { fetchServices, fetchServiceById } from '@/services/api/service'
import type { ServiceQueryParamsInterface } from '@/services/api/service/types'

/**
 * Query key factory for services
 */
export const serviceKeys = {
  all: ['services'] as const,
  lists: () => [...serviceKeys.all, 'list'] as const,
  list: (params?: ServiceQueryParamsInterface) => [...serviceKeys.lists(), params] as const,
  details: () => [...serviceKeys.all, 'detail'] as const,
  detail: (id: string) => [...serviceKeys.details(), id] as const,
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

/**
 * Hook to fetch a single service by ID
 */
export function useService(serviceId: string) {
  return useQuery({
    queryKey: serviceKeys.detail(serviceId),
    queryFn: () => fetchServiceById(serviceId),
    enabled: !!serviceId,
  })
}

