import * as React from "react"
import { useSearchParams } from "react-router-dom"
import type { SortingState, PaginationState } from "@tanstack/react-table"
import type { FilterState } from "../components/PolicyToolbar"
import { usePolicies } from "@/hooks/usePolicies"

export function usePolicyQuery() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = React.useState(() => searchParams.get("search") || "")
  
  // Filters
  const [filters, setFilters] = React.useState<FilterState>(() => ({
    status: searchParams.get("status")?.split(",").filter(Boolean) || [],
    isSystem: (searchParams.get("isSystem") as "all" | "system" | "regular") || "all",
    serviceId: searchParams.get("service_id") || ""
  }))

  // Sorting
  const [sorting, setSorting] = React.useState<SortingState>(() => {
    const sortBy = searchParams.get("sortBy")
    const sortOrder = searchParams.get("sortOrder")
    if (sortBy) {
      return [{ id: sortBy, desc: sortOrder === "desc" }]
    }
    return [{ id: "name", desc: false }]
  })
  
  // Pagination
  const [pagination, setPagination] = React.useState<PaginationState>(() => ({
    pageIndex: parseInt(searchParams.get("page") || "1") - 1,
    pageSize: parseInt(searchParams.get("limit") || "10"),
  }))

  // Build query params based on filters, sorting, and pagination
  const queryParams = React.useMemo(() => {
    // Get sort field from sorting state (already using API field names)
    const sortField = sorting.length > 0 ? sorting[0].id : 'name'
    const sortOrder = sorting.length > 0 && sorting[0].desc ? 'desc' : 'asc'

    const params: {
      page: number
      limit: number
      sort_by: string
      sort_order: 'asc' | 'desc'
      name?: string
      description?: string
      status?: string
      is_system?: boolean
      service_id?: string
    } = {
      page: pagination.pageIndex + 1, // API uses 1-based pagination
      limit: pagination.pageSize,
      sort_by: sortField,
      sort_order: sortOrder
    }

    // Add search query to name and description only
    if (searchQuery) {
      params.name = searchQuery
      params.description = searchQuery
    }

    // Map status filter - API supports comma-separated values
    if (filters.status.length > 0) {
      params.status = filters.status.join(',')
    }

    // Map isSystem filter to is_system
    if (filters.isSystem === 'system') {
      params.is_system = true
    } else if (filters.isSystem === 'regular') {
      params.is_system = false
    }

    // Add service filter
    if (filters.serviceId) {
      params.service_id = filters.serviceId
    }

    return params
  }, [searchQuery, filters, sorting, pagination.pageIndex, pagination.pageSize])

  const { data, isLoading, error } = usePolicies(queryParams)

  // Use API data directly - no mapping needed
  const policies = data?.rows ?? []
  const rowCount = data?.total ?? 0

  // Sync state to URL params
  React.useEffect(() => {
    const params = new URLSearchParams()

    // Add search query
    if (searchQuery) {
      params.set("search", searchQuery)
    }

    // Add status filter
    if (filters.status.length > 0) {
      params.set("status", filters.status.join(","))
    }

    // Add isSystem filter
    if (filters.isSystem !== "all") {
      params.set("isSystem", filters.isSystem)
    }

    // Add service filter
    if (filters.serviceId) {
      params.set("service_id", filters.serviceId)
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
    policies,
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

