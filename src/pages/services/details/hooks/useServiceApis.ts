/**
 * Custom hook for fetching APIs by service ID
 */

import { useApis } from '@/hooks/useApis'
import type { ApiQueryParamsInterface } from '@/services'

interface UseServiceApisParams {
  serviceId: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export function useServiceApis({ serviceId, page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc' }: UseServiceApisParams) {
  const params: ApiQueryParamsInterface = {
    service_id: serviceId,
    page,
    limit,
    sort_by: sortBy,
    sort_order: sortOrder,
  }

  return useApis(params)
}

