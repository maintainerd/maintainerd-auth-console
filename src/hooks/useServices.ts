/**
 * Services Hook
 * Custom hook for fetching services using TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchServices, fetchServiceById, createService, updateService, deleteService, updateServiceStatus } from '@/services/api/service'
import type {
  ServiceQueryParamsInterface,
  CreateServiceRequestInterface,
  UpdateServiceRequestInterface,
  UpdateServiceStatusRequestInterface
} from '@/services/api/service/types'

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

/**
 * Hook to create a new service
 */
export function useCreateService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateServiceRequestInterface) => createService(data),
    onSuccess: () => {
      // Invalidate services list to refetch
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() })
    },
  })
}

/**
 * Hook to update an existing service
 */
export function useUpdateService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ serviceId, data }: { serviceId: string; data: UpdateServiceRequestInterface }) =>
      updateService(serviceId, data),
    onSuccess: (_, variables) => {
      // Invalidate both the specific service and the services list
      queryClient.invalidateQueries({ queryKey: serviceKeys.detail(variables.serviceId) })
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() })
    },
  })
}

/**
 * Hook to delete a service
 */
export function useDeleteService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (serviceId: string) => deleteService(serviceId),
    onSuccess: () => {
      // Invalidate services list to refetch
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() })
    },
  })
}

/**
 * Hook to update service status
 */
export function useUpdateServiceStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ serviceId, data }: { serviceId: string; data: UpdateServiceStatusRequestInterface }) =>
      updateServiceStatus(serviceId, data),
    onSuccess: (_, variables) => {
      // Invalidate both the specific service and the services list
      queryClient.invalidateQueries({ queryKey: serviceKeys.detail(variables.serviceId) })
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() })
    },
  })
}
