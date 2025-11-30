/**
 * Custom hook for fetching permissions by API ID
 */

import { usePermissions } from '@/hooks/usePermissions'
import type { PermissionQueryParamsInterface } from '@/services/api/permission/types'

interface UseApiPermissionsParams {
  apiId: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  name?: string
  description?: string
}

export function useApiPermissions({
  apiId,
  page = 1,
  limit = 10,
  sortBy = 'created_at',
  sortOrder = 'desc',
  name,
  description
}: UseApiPermissionsParams) {
  const params: PermissionQueryParamsInterface = {
    api_id: apiId,
    page,
    limit,
    sort_by: sortBy,
    sort_order: sortOrder,
    name,
    description,
  }

  return usePermissions(params)
}

