/**
 * Clients Hook
 * Custom hook for fetching clients using TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchClients,
  fetchClientById,
  createClient,
  updateClient,
  deleteClient,
  updateClientStatus,
  fetchClientSecret,
  fetchClientConfig,
  fetchClientUris,
  createClientUri,
  updateClientUri,
  deleteClientUri,
  fetchClientApis,
  addClientApis,
  removeClientApi,
  addClientApiPermissions,
  removeClientApiPermission
} from '@/services/api/auth-client'
import type {
  ClientQueryParamsInterface,
  CreateClientRequestInterface,
  UpdateClientRequestInterface,
  UpdateClientStatusRequestInterface,
  CreateClientUriRequestInterface,
  UpdateClientUriRequestInterface,
  AddClientApisRequestInterface,
  AddClientApiPermissionsRequestInterface
} from '@/services/api/auth-client/types'

/**
 * Query key factory for clients
 */
export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (params?: ClientQueryParamsInterface) => [...clientKeys.lists(), params] as const,
  details: () => [...clientKeys.all, 'detail'] as const,
  detail: (id: string) => [...clientKeys.details(), id] as const,
  secret: (id: string) => [...clientKeys.all, 'secret', id] as const,
  config: (id: string) => [...clientKeys.all, 'config', id] as const,
  uris: (id: string) => [...clientKeys.all, 'uris', id] as const,
  apis: (id: string) => [...clientKeys.all, 'apis', id] as const,
}

/**
 * Hook to fetch clients with optional filters and pagination
 */
export function useClients(params?: ClientQueryParamsInterface) {
  return useQuery({
    queryKey: clientKeys.list(params),
    queryFn: () => fetchClients(params),
  })
}

/**
 * Hook to fetch a single client by ID
 */
export function useClient(clientId: string) {
  return useQuery({
    queryKey: clientKeys.detail(clientId),
    queryFn: () => fetchClientById(clientId),
    enabled: !!clientId,
  })
}

/**
 * Hook to create a new client
 */
export function useCreateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateClientRequestInterface) => createClient(data),
    onSuccess: () => {
      // Invalidate clients list to refetch
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
    },
  })
}

/**
 * Hook to update an existing client
 */
export function useUpdateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ clientId, data }: { clientId: string; data: UpdateClientRequestInterface }) =>
      updateClient(clientId, data),
    onSuccess: (_, variables) => {
      // Invalidate both the specific client and the clients list
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(variables.clientId) })
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
    },
  })
}

/**
 * Hook to delete a client
 */
export function useDeleteClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (clientId: string) => deleteClient(clientId),
    onSuccess: () => {
      // Invalidate clients list to refetch
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
    },
  })
}

/**
 * Hook to update client status
 */
export function useUpdateClientStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ clientId, data }: { clientId: string; data: UpdateClientStatusRequestInterface }) =>
      updateClientStatus(clientId, data),
    onSuccess: (_, variables) => {
      // Invalidate both the specific client and the clients list
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(variables.clientId) })
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
    },
  })
}

/**
 * Hook to fetch client secret
 */
export function useClientSecret(clientId: string, enabled: boolean = false) {
  return useQuery({
    queryKey: clientKeys.secret(clientId),
    queryFn: () => fetchClientSecret(clientId),
    enabled: enabled && !!clientId,
  })
}

/**
 * Hook to fetch client config
 */
export function useClientConfig(clientId: string) {
  return useQuery({
    queryKey: clientKeys.config(clientId),
    queryFn: () => fetchClientConfig(clientId),
    enabled: !!clientId,
  })
}

/**
 * Hook to fetch client URIs
 */
export function useClientUris(clientId: string) {
  return useQuery({
    queryKey: clientKeys.uris(clientId),
    queryFn: () => fetchClientUris(clientId),
    enabled: !!clientId,
  })
}

/**
 * Hook to create a new client URI
 */
export function useCreateClientUri() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ clientId, data }: { clientId: string; data: CreateClientUriRequestInterface }) =>
      createClientUri(clientId, data),
    onSuccess: (_, variables) => {
      // Invalidate client URIs to refetch
      queryClient.invalidateQueries({ queryKey: clientKeys.uris(variables.clientId) })
    },
  })
}

/**
 * Hook to update an existing client URI
 */
export function useUpdateClientUri() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ clientId, clientUriId, data }: { clientId: string; clientUriId: string; data: UpdateClientUriRequestInterface }) =>
      updateClientUri(clientId, clientUriId, data),
    onSuccess: (_, variables) => {
      // Invalidate client URIs to refetch
      queryClient.invalidateQueries({ queryKey: clientKeys.uris(variables.clientId) })
    },
  })
}

/**
 * Hook to delete a client URI
 */
export function useDeleteClientUri() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ clientId, clientUriId }: { clientId: string; clientUriId: string }) =>
      deleteClientUri(clientId, clientUriId),
    onSuccess: (_, variables) => {
      // Invalidate client URIs to refetch
      queryClient.invalidateQueries({ queryKey: clientKeys.uris(variables.clientId) })
    },
  })
}

/**
 * Hook to fetch client APIs
 */
export function useClientApis(clientId: string) {
  return useQuery({
    queryKey: clientKeys.apis(clientId),
    queryFn: () => fetchClientApis(clientId),
    enabled: !!clientId,
  })
}

/**
 * Hook to add APIs to a client
 */
export function useAddClientApis() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ clientId, data }: { clientId: string; data: AddClientApisRequestInterface }) =>
      addClientApis(clientId, data),
    onSuccess: (_, variables) => {
      // Invalidate client APIs to refetch
      queryClient.invalidateQueries({ queryKey: clientKeys.apis(variables.clientId) })
    },
  })
}

/**
 * Hook to remove an API from a client
 */
export function useRemoveClientApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ clientId, apiId }: { clientId: string; apiId: string }) =>
      removeClientApi(clientId, apiId),
    onSuccess: (_, variables) => {
      // Invalidate client APIs to refetch
      queryClient.invalidateQueries({ queryKey: clientKeys.apis(variables.clientId) })
    },
  })
}

/**
 * Hook to add permissions to a client API
 */
export function useAddClientApiPermissions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ clientId, apiId, data }: { clientId: string; apiId: string; data: AddClientApiPermissionsRequestInterface }) =>
      addClientApiPermissions(clientId, apiId, data),
    onSuccess: (_, variables) => {
      // Invalidate client APIs to refetch
      queryClient.invalidateQueries({ queryKey: clientKeys.apis(variables.clientId) })
    },
  })
}

/**
 * Hook to remove a permission from a client API
 */
export function useRemoveClientApiPermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ clientId, apiId, permissionId }: { clientId: string; apiId: string; permissionId: string }) =>
      removeClientApiPermission(clientId, apiId, permissionId),
    onSuccess: (_, variables) => {
      // Invalidate client APIs to refetch
      queryClient.invalidateQueries({ queryKey: clientKeys.apis(variables.clientId) })
    },
  })
}

