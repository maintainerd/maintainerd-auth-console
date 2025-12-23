/**
 * IP Restriction Rules Hook
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchIpRestrictionRules,
  createIpRestrictionRule,
  updateIpRestrictionRule,
  deleteIpRestrictionRule,
  updateIpRestrictionRuleStatus,
} from '@/services/api/ip-restriction-rules'
import { useToast } from '@/hooks/useToast'
import type {
  IpRestrictionRulesQueryParams,
  CreateIpRestrictionRuleRequest,
  UpdateIpRestrictionRuleRequest,
  UpdateIpRestrictionRuleStatusRequest,
} from '@/services/api/ip-restriction-rules/types'

const ipRestrictionRulesKeys = {
  all: ['ipRestrictionRules'] as const,
  lists: () => [...ipRestrictionRulesKeys.all, 'list'] as const,
  list: (params: IpRestrictionRulesQueryParams) => [...ipRestrictionRulesKeys.lists(), params] as const,
}

export const useIpRestrictionRules = (params: IpRestrictionRulesQueryParams = {}) => {
  return useQuery({
    queryKey: ipRestrictionRulesKeys.list(params),
    queryFn: () => fetchIpRestrictionRules(params),
  })
}

export const useCreateIpRestrictionRule = () => {
  const queryClient = useQueryClient()
  const { showSuccess } = useToast()

  return useMutation({
    mutationFn: (data: CreateIpRestrictionRuleRequest) => createIpRestrictionRule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ipRestrictionRulesKeys.lists() })
      showSuccess('IP rule added successfully')
    },
  })
}

export const useUpdateIpRestrictionRule = () => {
  const queryClient = useQueryClient()
  const { showSuccess } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateIpRestrictionRuleRequest }) =>
      updateIpRestrictionRule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ipRestrictionRulesKeys.lists() })
      showSuccess('IP rule updated successfully')
    },
  })
}

export const useDeleteIpRestrictionRule = () => {
  const queryClient = useQueryClient()
  const { showSuccess } = useToast()

  return useMutation({
    mutationFn: (id: string) => deleteIpRestrictionRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ipRestrictionRulesKeys.lists() })
      showSuccess('IP rule deleted successfully')
    },
  })
}

export const useUpdateIpRestrictionRuleStatus = () => {
  const queryClient = useQueryClient()
  const { showSuccess } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateIpRestrictionRuleStatusRequest }) =>
      updateIpRestrictionRuleStatus(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ipRestrictionRulesKeys.lists() })
      const newStatus = variables.data.status
      showSuccess(`IP rule ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
    },
  })
}
