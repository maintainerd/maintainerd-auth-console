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
  name?: string
  displayName?: string
  description?: string
}

export function useServiceApis({
  serviceId,
  page = 1,
  limit = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  name,
  displayName,
  description
}: UseServiceApisParams) {
  const params: ApiQueryParamsInterface = {
    service_id: serviceId,
    page,
    limit,
    sort_by: sortBy,
    sort_order: sortOrder,
    name,
    display_name: displayName,
    description,
  }

  return useApis(params)
}

