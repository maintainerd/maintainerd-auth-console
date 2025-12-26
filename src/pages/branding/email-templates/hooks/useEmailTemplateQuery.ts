/**
 * Email Template Query Hook
 * Manages query state for email templates listing
 */

import { useState, useMemo } from 'react'
import type { SortingState, PaginationState } from '@tanstack/react-table'
import { useEmailTemplates } from '@/hooks/useEmailTemplates'
import type { EmailTemplateStatusType } from '@/services/api/email-template/types'

interface EmailTemplateFilters {
  status: EmailTemplateStatusType[]
}

export function useEmailTemplateQuery() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<EmailTemplateFilters>({
    status: [],
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

    if (sorting.length > 0) {
      params.sort_by = sorting[0].id
      params.sort_order = sorting[0].desc ? 'desc' : 'asc'
    }

    return params
  }, [searchQuery, filters, sorting, pagination])

  // Fetch email templates
  const { data, isLoading, error } = useEmailTemplates(queryParams)

  const emailTemplates = data?.rows || []
  const rowCount = data?.total || 0

  return {
    emailTemplates,
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
