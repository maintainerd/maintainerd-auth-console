/**
 * Custom hook for fetching services that use a specific policy
 */

import { useQuery } from '@tanstack/react-query'
import { fetchServicesByPolicy } from '@/services'
import type { ServiceQueryParamsInterface } from '@/services/api/service/types'

interface UseServicesByPolicyParams extends ServiceQueryParamsInterface {
  policyId: string
}

export function useServicesByPolicy({
  policyId,
  page = 1,
  limit = 10,
  sort_by = 'name',
  sort_order = 'asc',
  name,
  display_name,
  description,
}: UseServicesByPolicyParams) {
  const params: ServiceQueryParamsInterface = {
    page,
    limit,
    sort_by,
    sort_order,
    name,
    display_name,
    description,
  }

  return useQuery({
    queryKey: ['policy', policyId, 'services', params],
    queryFn: () => fetchServicesByPolicy(policyId, params),
    enabled: !!policyId,
  })
}

