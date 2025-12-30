import * as React from "react"
import { useSearchParams } from "react-router-dom"
import type { SortingState, PaginationState } from "@tanstack/react-table"
import type { FilterState } from "../components/MemberToolbar"
import { useTenantMembers } from "@/hooks/useTenantMembers"
import { useAppSelector } from '@/store/hooks'

export function useMemberQuery() {
  const currentTenant = useAppSelector((state) => state.tenant.currentTenant)
  const tenantId = currentTenant?.tenant_id || ''
  
  const [searchParams, setSearchParams] = useSearchParams()

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = React.useState(() => searchParams.get("search") || "")
  
  // Filters
  const [filters, setFilters] = React.useState<FilterState>(() => ({
    role: searchParams.get("role") || "all"
  }))

  // Sorting
  const [sorting, setSorting] = React.useState<SortingState>(() => {
    const sortBy = searchParams.get("sortBy")
    const sortOrder = searchParams.get("sortOrder")
    if (sortBy) {
      return [{ id: sortBy, desc: sortOrder === "desc" }]
    }
    return [{ id: "created_at", desc: true }]
  })

  // Pagination
  const [pagination, setPagination] = React.useState<PaginationState>(() => ({
    pageIndex: parseInt(searchParams.get("page") || "1") - 1,
    pageSize: parseInt(searchParams.get("limit") || "10"),
  }))

  // Build query params based on filters, sorting, and pagination
  const queryParams = React.useMemo(() => {
    // Get sort field from sorting state
    const sortField = sorting.length > 0 ? sorting[0].id : 'created_at'
    const sortOrder = sorting.length > 0 && sorting[0].desc ? 'desc' : 'asc'

    const params: {
      page: number
      limit: number
      sort_by: string
      sort_order: 'asc' | 'desc'
      role?: string
    } = {
      page: pagination.pageIndex + 1, // API uses 1-based pagination
      limit: pagination.pageSize,
      sort_by: sortField,
      sort_order: sortOrder
    }

    // Map role filter
    if (filters.role !== 'all') {
      params.role = filters.role
    }

    return params
  }, [filters, sorting, pagination.pageIndex, pagination.pageSize])

  const { data, isLoading, error } = useTenantMembers(tenantId, queryParams)

  // Use API data directly
  const members = data?.data ?? []
  const rowCount = members.length // API doesn't return total count, using current page count

  // Sync state to URL params
  React.useEffect(() => {
    const params = new URLSearchParams()

    // Add search query
    if (searchQuery) {
      params.set("search", searchQuery)
    }

    // Add role filter
    if (filters.role !== "all") {
      params.set("role", filters.role)
    }

    // Add sorting
    if (sorting.length > 0) {
      params.set("sortBy", sorting[0].id)
      params.set("sortOrder", sorting[0].desc ? "desc" : "asc")
    }

    // Add pagination
    params.set("page", String(pagination.pageIndex + 1))
    params.set("limit", String(pagination.pageSize))

    setSearchParams(params, { replace: true })
  }, [searchQuery, filters, sorting, pagination, setSearchParams])

  return {
    members,
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
