import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchWorkloadIdentities,
  createWorkloadIdentity,
  updateWorkloadIdentity,
  deleteWorkloadIdentity,
} from '@/services/api/workload-identity'
import type {
  WorkloadIdentityQueryParams,
  CreateWorkloadIdentityRequest,
  UpdateWorkloadIdentityRequest,
} from '@/services/api/workload-identity/types'

export const workloadIdentityKeys = {
  all: ['workload-identity'] as const,
  lists: () => [...workloadIdentityKeys.all, 'list'] as const,
  list: (params?: WorkloadIdentityQueryParams) =>
    [...workloadIdentityKeys.lists(), params] as const,
}

export function useWorkloadIdentities(params?: WorkloadIdentityQueryParams) {
  return useQuery({
    queryKey: workloadIdentityKeys.list(params),
    queryFn: () => fetchWorkloadIdentities(params),
  })
}

export function useWorkloadIdentitiesList(params: Record<string, unknown>) {
  return useWorkloadIdentities(params as WorkloadIdentityQueryParams)
}

export function useCreateWorkloadIdentity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateWorkloadIdentityRequest) => createWorkloadIdentity(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: workloadIdentityKeys.lists() }),
  })
}

export function useUpdateWorkloadIdentity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWorkloadIdentityRequest }) =>
      updateWorkloadIdentity(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: workloadIdentityKeys.lists() }),
  })
}

export function useDeleteWorkloadIdentity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteWorkloadIdentity(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: workloadIdentityKeys.lists() }),
  })
}
