/**
 * Identity Providers Hook
 * Custom hook for fetching identity providers using TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  fetchIdentityProviders, 
  fetchIdentityProviderById, 
  createIdentityProvider, 
  updateIdentityProvider, 
  deleteIdentityProvider, 
  updateIdentityProviderStatus 
} from '@/services/api/identity-providers'
import type {
  IdentityProviderQueryParams,
  CreateIdentityProviderRequest,
  UpdateIdentityProviderRequest,
  UpdateIdentityProviderStatusRequest
} from '@/services/api/identity-providers/types'

/**
 * Query key factory for identity providers
 */
export const identityProviderKeys = {
  all: ['identityProviders'] as const,
  lists: () => [...identityProviderKeys.all, 'list'] as const,
  list: (params?: IdentityProviderQueryParams) => [...identityProviderKeys.lists(), params] as const,
  details: () => [...identityProviderKeys.all, 'detail'] as const,
  detail: (id: string) => [...identityProviderKeys.details(), id] as const,
}

/**
 * Hook to fetch identity providers with optional filters and pagination
 */
export function useIdentityProviders(params?: IdentityProviderQueryParams) {
  return useQuery({
    queryKey: identityProviderKeys.list(params),
    queryFn: () => fetchIdentityProviders(params),
  })
}

/**
 * Hook to fetch a single identity provider by ID
 */
export function useIdentityProvider(identityProviderId: string) {
  return useQuery({
    queryKey: identityProviderKeys.detail(identityProviderId),
    queryFn: () => fetchIdentityProviderById(identityProviderId),
    enabled: !!identityProviderId,
  })
}

/**
 * Hook to create a new identity provider
 */
export function useCreateIdentityProvider() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateIdentityProviderRequest) => createIdentityProvider(data),
    onSuccess: () => {
      // Invalidate identity providers list to refetch
      queryClient.invalidateQueries({ queryKey: identityProviderKeys.lists() })
    },
  })
}

/**
 * Hook to update an existing identity provider
 */
export function useUpdateIdentityProvider() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ identityProviderId, data }: { identityProviderId: string; data: UpdateIdentityProviderRequest }) =>
      updateIdentityProvider(identityProviderId, data),
    onSuccess: (_, variables) => {
      // Invalidate both the specific identity provider and the identity providers list
      queryClient.invalidateQueries({ queryKey: identityProviderKeys.detail(variables.identityProviderId) })
      queryClient.invalidateQueries({ queryKey: identityProviderKeys.lists() })
    },
  })
}

/**
 * Hook to delete an identity provider
 */
export function useDeleteIdentityProvider() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (identityProviderId: string) => deleteIdentityProvider(identityProviderId),
    onSuccess: () => {
      // Invalidate identity providers list to refetch
      queryClient.invalidateQueries({ queryKey: identityProviderKeys.lists() })
    },
  })
}

/**
 * Hook to update identity provider status
 */
export function useUpdateIdentityProviderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ identityProviderId, data }: { identityProviderId: string; data: UpdateIdentityProviderStatusRequest }) =>
      updateIdentityProviderStatus(identityProviderId, data),
    onSuccess: (_, variables) => {
      // Invalidate both the specific identity provider and the identity providers list
      queryClient.invalidateQueries({ queryKey: identityProviderKeys.detail(variables.identityProviderId) })
      queryClient.invalidateQueries({ queryKey: identityProviderKeys.lists() })
    },
  })
}

