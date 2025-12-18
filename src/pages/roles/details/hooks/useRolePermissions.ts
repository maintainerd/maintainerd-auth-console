/**
 * Custom hook for fetching permissions by Role ID
 */

import { useQuery } from '@tanstack/react-query'
import { fetchRolePermissions } from '@/services/api/role'

interface UseRolePermissionsParams {
  roleId: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  status?: string
}

export function useRolePermissions({
  roleId,
  page = 1,
  limit = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  status
}: UseRolePermissionsParams) {
  return useQuery({
    queryKey: ['role-permissions', roleId, page, limit, sortBy, sortOrder, status],
    queryFn: () => fetchRolePermissions(roleId, {
      page,
      limit,
      sort_by: sortBy,
      sort_order: sortOrder,
      status
    }),
    enabled: !!roleId,
  })
}
