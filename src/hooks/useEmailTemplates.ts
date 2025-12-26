/**
 * Email Templates Hook
 * Custom hook for fetching email templates using TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchEmailTemplates,
  fetchEmailTemplateById,
  createEmailTemplate,
  updateEmailTemplate,
  updateEmailTemplateStatus,
  deleteEmailTemplate,
} from '@/services/api/email-template'
import type {
  EmailTemplateQueryParams,
  CreateEmailTemplateRequest,
  UpdateEmailTemplateRequest,
  UpdateEmailTemplateStatusRequest,
} from '@/services/api/email-template/types'
import { useToast } from './useToast'

/**
 * Query key factory for email templates
 */
export const emailTemplateKeys = {
  all: ['emailTemplates'] as const,
  lists: () => [...emailTemplateKeys.all, 'list'] as const,
  list: (params?: EmailTemplateQueryParams) => [...emailTemplateKeys.lists(), params] as const,
  details: () => [...emailTemplateKeys.all, 'detail'] as const,
  detail: (id: string) => [...emailTemplateKeys.details(), id] as const,
}

/**
 * Hook to fetch email templates with optional filters
 */
export function useEmailTemplates(params?: EmailTemplateQueryParams) {
  return useQuery({
    queryKey: emailTemplateKeys.list(params),
    queryFn: () => fetchEmailTemplates(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch a single email template by ID
 */
export function useEmailTemplate(id: string) {
  return useQuery({
    queryKey: emailTemplateKeys.detail(id),
    queryFn: () => fetchEmailTemplateById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to create a new email template
 */
export function useCreateEmailTemplate() {
  const queryClient = useQueryClient()
  const { showSuccess } = useToast()

  return useMutation({
    mutationFn: (data: CreateEmailTemplateRequest) => createEmailTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: emailTemplateKeys.lists() })
      showSuccess('Email template created successfully')
    },
  })
}

/**
 * Hook to update an email template
 */
export function useUpdateEmailTemplate() {
  const queryClient = useQueryClient()
  const { showSuccess } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmailTemplateRequest }) =>
      updateEmailTemplate(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: emailTemplateKeys.lists() })
      queryClient.invalidateQueries({ queryKey: emailTemplateKeys.detail(variables.id) })
      showSuccess('Email template updated successfully')
    },
  })
}

/**
 * Hook to update email template status
 */
export function useUpdateEmailTemplateStatus() {
  const queryClient = useQueryClient()
  const { showSuccess } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmailTemplateStatusRequest }) =>
      updateEmailTemplateStatus(id, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: emailTemplateKeys.lists() })
      queryClient.invalidateQueries({ queryKey: emailTemplateKeys.detail(result.emailTemplateId) })
      showSuccess(`Email template ${result.status === 'active' ? 'activated' : 'deactivated'} successfully`)
    },
  })
}

/**
 * Hook to delete an email template
 */
export function useDeleteEmailTemplate() {
  const queryClient = useQueryClient()
  const { showSuccess } = useToast()

  return useMutation({
    mutationFn: (id: string) => deleteEmailTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: emailTemplateKeys.lists() })
      showSuccess('Email template deleted successfully')
    },
  })
}
