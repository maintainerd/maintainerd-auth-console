import * as React from "react"
import type { SortingState, PaginationState } from "@tanstack/react-table"
import type { FilterState } from "../components/ServiceToolbar"
import { useServices } from "@/hooks/useServices"

export function useServiceQuery() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filters, setFilters] = React.useState<FilterState>({
    status: [],
    isSystem: "all"
  })
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "display_name", desc: false }
  ])
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // Build query params based on filters, sorting, and pagination
  const queryParams = React.useMemo(() => {
    // Get sort field from sorting state (already using API field names)
    const sortField = sorting.length > 0 ? sorting[0].id : 'display_name'
    const sortOrder = sorting.length > 0 && sorting[0].desc ? 'desc' : 'asc'

    const params: {
      page: number
      limit: number
      sort_by: string
      sort_order: 'asc' | 'desc'
      name?: string
      display_name?: string
      description?: string
      status?: string
      is_system?: boolean
    } = {
      page: pagination.pageIndex + 1, // API uses 1-based pagination
      limit: pagination.pageSize,
      sort_by: sortField,
      sort_order: sortOrder
    }

    // Add search query to name, display_name, and description
    if (searchQuery) {
      params.name = searchQuery
      params.display_name = searchQuery
      params.description = searchQuery
    }

    // Map status filter - API now supports status field directly
    if (filters.status.length > 0) {
      // Join multiple statuses with comma for API
      params.status = filters.status.join(',')
    }

    // Map isSystem filter to is_system
    if (filters.isSystem === 'system') {
      params.is_system = true
    } else if (filters.isSystem === 'regular') {
      params.is_system = false
    }

    return params
  }, [searchQuery, filters, sorting, pagination.pageIndex, pagination.pageSize])

  const { data, isLoading, error } = useServices(queryParams)

  // Use API data directly - no mapping needed
  const services = data?.rows ?? []
  const rowCount = data?.total ?? 0

  return {
    services,
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

