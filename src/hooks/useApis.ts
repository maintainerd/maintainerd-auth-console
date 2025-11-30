/**
 * APIs Hook
 * Custom hook for fetching APIs using TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchApis, fetchApiById, createApi, updateApi, deleteApi, updateApiStatus } from '@/services/api/api'
import type {
  ApiQueryParamsInterface,
  CreateApiRequestInterface,
  UpdateApiRequestInterface,
  UpdateApiStatusRequestInterface
} from '@/services/api/api/types'

/**
 * Query key factory for APIs
 */
export const apiKeys = {
  all: ['apis'] as const,
  lists: () => [...apiKeys.all, 'list'] as const,
  list: (params?: ApiQueryParamsInterface) => [...apiKeys.lists(), params] as const,
  details: () => [...apiKeys.all, 'detail'] as const,
  detail: (id: string) => [...apiKeys.details(), id] as const,
}

/**
 * Hook to fetch APIs with optional filters and pagination
 */
export function useApis(params?: ApiQueryParamsInterface) {
  return useQuery({
    queryKey: apiKeys.list(params),
    queryFn: () => fetchApis(params),
  })
}

/**
 * Hook to fetch a single API by ID
 */
export function useApi(apiId: string) {
  return useQuery({
    queryKey: apiKeys.detail(apiId),
    queryFn: () => fetchApiById(apiId),
    enabled: !!apiId,
  })
}

/**
 * Hook to create a new API
 */
export function useCreateApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateApiRequestInterface) => createApi(data),
    onSuccess: () => {
      // Invalidate APIs list to refetch
      queryClient.invalidateQueries({ queryKey: apiKeys.lists() })
    },
  })
}

/**
 * Hook to update an existing API
 */
export function useUpdateApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ apiId, data }: { apiId: string; data: UpdateApiRequestInterface }) =>
      updateApi(apiId, data),
    onSuccess: (_, variables) => {
      // Invalidate both the specific API and the APIs list
      queryClient.invalidateQueries({ queryKey: apiKeys.detail(variables.apiId) })
      queryClient.invalidateQueries({ queryKey: apiKeys.lists() })
    },
  })
}

/**
 * Hook to delete an API
 */
export function useDeleteApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (apiId: string) => deleteApi(apiId),
    onSuccess: () => {
      // Invalidate APIs list to refetch
      queryClient.invalidateQueries({ queryKey: apiKeys.lists() })
    },
  })
}

/**
 * Hook to update API status
 */
export function useUpdateApiStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ apiId, data }: { apiId: string; data: UpdateApiStatusRequestInterface }) =>
      updateApiStatus(apiId, data),
    onSuccess: (_, variables) => {
      // Invalidate both the specific API and the APIs list
      queryClient.invalidateQueries({ queryKey: apiKeys.detail(variables.apiId) })
      queryClient.invalidateQueries({ queryKey: apiKeys.lists() })
    },
  })
}

