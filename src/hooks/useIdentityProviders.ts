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
} from '@/services/api/identity-provider'
import type {
  IdentityProviderQueryParamsInterface,
  CreateIdentityProviderRequestInterface,
  UpdateIdentityProviderRequestInterface,
  UpdateIdentityProviderStatusRequestInterface
} from '@/services/api/identity-provider/types'

/**
 * Query key factory for identity providers
 */
export const identityProviderKeys = {
  all: ['identityProviders'] as const,
  lists: () => [...identityProviderKeys.all, 'list'] as const,
  list: (params?: IdentityProviderQueryParamsInterface) => [...identityProviderKeys.lists(), params] as const,
  details: () => [...identityProviderKeys.all, 'detail'] as const,
  detail: (id: string) => [...identityProviderKeys.details(), id] as const,
}

/**
 * Hook to fetch identity providers with optional filters and pagination
 */
export function useIdentityProviders(params?: IdentityProviderQueryParamsInterface) {
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
    mutationFn: (data: CreateIdentityProviderRequestInterface) => createIdentityProvider(data),
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
    mutationFn: ({ identityProviderId, data }: { identityProviderId: string; data: UpdateIdentityProviderRequestInterface }) =>
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
    mutationFn: ({ identityProviderId, data }: { identityProviderId: string; data: UpdateIdentityProviderStatusRequestInterface }) =>
      updateIdentityProviderStatus(identityProviderId, data),
    onSuccess: (_, variables) => {
      // Invalidate both the specific identity provider and the identity providers list
      queryClient.invalidateQueries({ queryKey: identityProviderKeys.detail(variables.identityProviderId) })
      queryClient.invalidateQueries({ queryKey: identityProviderKeys.lists() })
    },
  })
}

