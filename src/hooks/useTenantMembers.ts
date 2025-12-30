import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchTenantMembers,
  addTenantMember,
  updateTenantMemberRole,
  deleteTenantMember,
} from '@/services/api/tenant/members'
import type { TenantMembersListParams } from '@/services/api/tenant/members'

export function useTenantMembers(tenantId: string, params: TenantMembersListParams = {}) {
  return useQuery({
    queryKey: ['tenant-members', tenantId, params],
    queryFn: () => fetchTenantMembers(tenantId, params),
    enabled: !!tenantId,
  })
}

export function useAddTenantMember(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ user_id, role }: { user_id: string; role: 'owner' | 'member' }) => 
      addTenantMember(tenantId, user_id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-members', tenantId] })
    },
  })
}

export function useUpdateTenantMemberRole(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ tenant_user_id, role }: { tenant_user_id: string; role: 'owner' | 'member' }) =>
      updateTenantMemberRole(tenantId, tenant_user_id, role),
    onSuccess: () => {
      // Only invalidate tenant-members query, not tenant query
      queryClient.invalidateQueries({ queryKey: ['tenant-members', tenantId] })
    },
  })
}

export function useDeleteTenantMember(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (tenant_user_id: string) => deleteTenantMember(tenantId, tenant_user_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-members', tenantId] })
    },
  })
}
