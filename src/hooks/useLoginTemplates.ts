import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchLoginTemplates,
  fetchLoginTemplateById,
  createLoginTemplate,
  updateLoginTemplate,
  updateLoginTemplateStatus,
  deleteLoginTemplate,
} from '@/services/api/login-template'
import type {
  LoginTemplateQueryParams,
  CreateLoginTemplateRequest,
  UpdateLoginTemplateRequest,
  UpdateLoginTemplateStatusRequest,
} from '@/services/api/login-template/types'
import { useToast } from './useToast'

const QUERY_KEYS = {
  loginTemplates: (params?: LoginTemplateQueryParams) => ['login-templates', params] as const,
  loginTemplate: (id: string) => ['login-template', id] as const,
}

/**
 * Hook to fetch login templates with filters and pagination
 */
export function useLoginTemplates(params?: LoginTemplateQueryParams) {
  return useQuery({
    queryKey: QUERY_KEYS.loginTemplates(params),
    queryFn: () => fetchLoginTemplates(params),
  })
}

/**
 * Hook to fetch a single login template by ID
 */
export function useLoginTemplate(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.loginTemplate(id),
    queryFn: () => fetchLoginTemplateById(id),
    enabled: !!id,
  })
}

/**
 * Hook to create a new login template
 */
export function useCreateLoginTemplate() {
  const queryClient = useQueryClient()
  const { showSuccess } = useToast()

  return useMutation({
    mutationFn: (data: CreateLoginTemplateRequest) => createLoginTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['login-templates'] })
      showSuccess('Login template created successfully')
    },
  })
}

/**
 * Hook to update a login template
 */
export function useUpdateLoginTemplate() {
  const queryClient = useQueryClient()
  const { showSuccess } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLoginTemplateRequest }) =>
      updateLoginTemplate(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['login-templates'] })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.loginTemplate(variables.id) })
      showSuccess('Login template updated successfully')
    },
  })
}

/**
 * Hook to update login template status
 */
export function useUpdateLoginTemplateStatus() {
  const queryClient = useQueryClient()
  const { showSuccess } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLoginTemplateStatusRequest }) =>
      updateLoginTemplateStatus(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['login-templates'] })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.loginTemplate(variables.id) })
      showSuccess('Login template status updated successfully')
    },
  })
}

/**
 * Hook to delete a login template
 */
export function useDeleteLoginTemplate() {
  const queryClient = useQueryClient()
  const { showSuccess } = useToast()

  return useMutation({
    mutationFn: (id: string) => deleteLoginTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['login-templates'] })
      showSuccess('Login template deleted successfully')
    },
  })
}
