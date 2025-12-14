/**
 * API Keys Hook
 * Custom hook for fetching API keys using TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchApiKeys,
  fetchApiKeyById,
  createApiKey,
  updateApiKey,
  deleteApiKey,
  updateApiKeyStatus,
  fetchApiKeyConfig,
  fetchApiKeyApis,
  fetchApiKeyApiPermissions,
  addApiKeyApis,
  removeApiKeyApi,
  addApiKeyApiPermissions,
  removeApiKeyApiPermission
} from '@/services/api/api-key'
import type {
  ApiKeyQueryParamsInterface,
  CreateApiKeyRequestInterface,
  UpdateApiKeyRequestInterface,
  UpdateApiKeyStatusRequestInterface,
  AddApiKeyApisRequestInterface,
  AddApiKeyApiPermissionsRequestInterface
} from '@/services/api/api-key/types'

/**
 * Query key factory for API keys
 */
export const apiKeyKeys = {
  all: ['api-keys'] as const,
  lists: () => [...apiKeyKeys.all, 'list'] as const,
  list: (params?: ApiKeyQueryParamsInterface) => [...apiKeyKeys.lists(), params] as const,
  details: () => [...apiKeyKeys.all, 'detail'] as const,
  detail: (id: string) => [...apiKeyKeys.details(), id] as const,
  config: (id: string) => [...apiKeyKeys.all, 'config', id] as const,
  apis: (id: string) => [...apiKeyKeys.all, 'apis', id] as const,
  apiPermissions: (apiKeyId: string, apiId: string) => [...apiKeyKeys.all, 'api-permissions', apiKeyId, apiId] as const,
}

/**
 * Hook to fetch API keys with optional filters and pagination
 */
export function useApiKeys(params?: ApiKeyQueryParamsInterface) {
  return useQuery({
    queryKey: apiKeyKeys.list(params),
    queryFn: () => fetchApiKeys(params),
  })
}

/**
 * Hook to fetch a single API key by ID
 */
export function useApiKey(apiKeyId: string) {
  return useQuery({
    queryKey: apiKeyKeys.detail(apiKeyId),
    queryFn: () => fetchApiKeyById(apiKeyId),
    enabled: !!apiKeyId,
  })
}

/**
 * Hook to create a new API key
 */
export function useCreateApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateApiKeyRequestInterface) => createApiKey(data),
    onSuccess: () => {
      // Invalidate API keys list to refetch
      queryClient.invalidateQueries({ queryKey: apiKeyKeys.lists() })
    },
  })
}

/**
 * Hook to update an existing API key
 */
export function useUpdateApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ apiKeyId, data }: { apiKeyId: string; data: UpdateApiKeyRequestInterface }) =>
      updateApiKey(apiKeyId, data),
    onSuccess: (_, variables) => {
      // Invalidate the specific API key and the list
      queryClient.invalidateQueries({ queryKey: apiKeyKeys.detail(variables.apiKeyId) })
      queryClient.invalidateQueries({ queryKey: apiKeyKeys.lists() })
    },
  })
}

/**
 * Hook to delete an API key
 */
export function useDeleteApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (apiKeyId: string) => deleteApiKey(apiKeyId),
    onSuccess: () => {
      // Invalidate API keys list to refetch
      queryClient.invalidateQueries({ queryKey: apiKeyKeys.lists() })
    },
  })
}

/**
 * Hook to update API key status
 */
export function useUpdateApiKeyStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ apiKeyId, data }: { apiKeyId: string; data: UpdateApiKeyStatusRequestInterface }) =>
      updateApiKeyStatus(apiKeyId, data),
    onSuccess: (_, variables) => {
      // Invalidate the specific API key and the list
      queryClient.invalidateQueries({ queryKey: apiKeyKeys.detail(variables.apiKeyId) })
      queryClient.invalidateQueries({ queryKey: apiKeyKeys.lists() })
    },
  })
}

/**
 * Hook to fetch API key config
 */
export function useApiKeyConfig(apiKeyId: string) {
  return useQuery({
    queryKey: apiKeyKeys.config(apiKeyId),
    queryFn: () => fetchApiKeyConfig(apiKeyId),
    enabled: !!apiKeyId,
  })
}

/**
 * Hook to fetch API key APIs
 */
export function useApiKeyApis(apiKeyId: string) {
  return useQuery({
    queryKey: apiKeyKeys.apis(apiKeyId),
    queryFn: () => fetchApiKeyApis(apiKeyId),
    enabled: !!apiKeyId,
  })
}

/**
 * Hook to fetch API key API permissions
 */
export function useApiKeyApiPermissions(apiKeyId: string, apiId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: apiKeyKeys.apiPermissions(apiKeyId, apiId),
    queryFn: () => fetchApiKeyApiPermissions(apiKeyId, apiId),
    enabled: !!apiKeyId && !!apiId && enabled,
  })
}

/**
 * Hook to add APIs to an API key
 */
export function useAddApiKeyApis() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ apiKeyId, data }: { apiKeyId: string; data: AddApiKeyApisRequestInterface }) =>
      addApiKeyApis(apiKeyId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: apiKeyKeys.apis(variables.apiKeyId) })
    },
  })
}

/**
 * Hook to remove an API from an API key
 */
export function useRemoveApiKeyApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ apiKeyId, apiId }: { apiKeyId: string; apiId: string }) =>
      removeApiKeyApi(apiKeyId, apiId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: apiKeyKeys.apis(variables.apiKeyId) })
    },
  })
}

/**
 * Hook to add permissions to an API key API
 */
export function useAddApiKeyApiPermissions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ apiKeyId, apiId, data }: { apiKeyId: string; apiId: string; data: AddApiKeyApiPermissionsRequestInterface }) =>
      addApiKeyApiPermissions(apiKeyId, apiId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: apiKeyKeys.apis(variables.apiKeyId) })
      queryClient.invalidateQueries({ queryKey: apiKeyKeys.apiPermissions(variables.apiKeyId, variables.apiId) })
    },
  })
}

/**
 * Hook to remove a permission from an API key API
 */
export function useRemoveApiKeyApiPermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ apiKeyId, apiId, permissionId }: { apiKeyId: string; apiId: string; permissionId: string }) =>
      removeApiKeyApiPermission(apiKeyId, apiId, permissionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: apiKeyKeys.apis(variables.apiKeyId) })
      queryClient.invalidateQueries({ queryKey: apiKeyKeys.apiPermissions(variables.apiKeyId, variables.apiId) })
    },
  })
}

