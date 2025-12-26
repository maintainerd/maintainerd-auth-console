/**
 * Login Template Query Hook
 * Manages query state for login templates listing
 */

import { useState, useMemo } from 'react'
import type { SortingState, PaginationState } from '@tanstack/react-table'
import { useLoginTemplates } from '@/hooks/useLoginTemplates'
import type { LoginTemplateStatusType, TemplateType } from '@/services/api/login-template/types'

interface LoginTemplateFilters {
  status: LoginTemplateStatusType[]
  template: TemplateType[]
}

export function useLoginTemplateQuery() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<LoginTemplateFilters>({
    status: [],
    template: [],
  })
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'created_at', desc: true },
  ])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // Build query params for API
  const queryParams = useMemo(() => {
    const params: Record<string, string | number> = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    }

    if (searchQuery) {
      params.name = searchQuery
    }

    if (filters.status.length > 0) {
      params.status = filters.status[0] // Backend expects single value
    }

    if (filters.template.length > 0) {
      params.template = filters.template[0] // Backend expects single value
    }

    if (sorting.length > 0) {
      params.sort_by = sorting[0].id
      params.sort_order = sorting[0].desc ? 'desc' : 'asc'
    }

    return params
  }, [searchQuery, filters, sorting, pagination])

  // Fetch login templates
  const { data, isLoading, error } = useLoginTemplates(queryParams)

  const loginTemplates = data?.rows || []
  const rowCount = data?.total || 0

  return {
    loginTemplates,
    rowCount,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    sorting,
    setSorting,
    pagination,
    setPagination,
  }
}
