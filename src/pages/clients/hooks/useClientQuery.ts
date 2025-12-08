import * as React from "react"
import { useSearchParams } from "react-router-dom"
import type { SortingState, PaginationState } from "@tanstack/react-table"
import type { FilterState } from "../components/ClientToolbar"
import { useClients } from "@/hooks/useClients"

export function useClientQuery() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = React.useState(() => searchParams.get("search") || "")
  
  // Filters
  const [filters, setFilters] = React.useState<FilterState>(() => ({
    status: searchParams.get("status")?.split(",").filter(Boolean) || [],
    clientType: searchParams.get("clientType")?.split(",").filter(Boolean) || [],
    isSystem: (searchParams.get("isSystem") as "all" | "system" | "regular") || "all",
    identityProviderId: searchParams.get("identity_provider_id") || "",
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
      name?: string
      display_name?: string
      status?: string
      client_type?: string
      identity_provider_id?: string
      is_default?: boolean
      is_system?: boolean
    } = {
      page: pagination.pageIndex + 1, // API uses 1-based pagination
      limit: pagination.pageSize,
      sort_by: sortField,
      sort_order: sortOrder
    }

    // Add search query to name and display_name
    if (searchQuery) {
      params.name = searchQuery
      params.display_name = searchQuery
    }

    // Map status filter - send comma-separated values for multiple statuses
    if (filters.status.length > 0) {
      params.status = filters.status.join(',')
    }

    // Map clientType filter - send comma-separated values for multiple types
    if (filters.clientType.length > 0) {
      params.client_type = filters.clientType.join(',')
    }

    // Map isSystem filter to is_default
    if (filters.isSystem === 'system') {
      params.is_default = true
    } else if (filters.isSystem === 'regular') {
      params.is_default = false
    }

    // Add identity provider filter
    if (filters.identityProviderId) {
      params.identity_provider_id = filters.identityProviderId
    }

    return params
  }, [searchQuery, filters, sorting, pagination.pageIndex, pagination.pageSize])

  const { data, isLoading, error } = useClients(queryParams)

  // Use API data directly - no mapping needed
  const clients = data?.rows ?? []
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

    // Add clientType filter
    if (filters.clientType.length > 0) {
      params.set("clientType", filters.clientType.join(","))
    }

    // Add isSystem filter
    if (filters.isSystem !== "all") {
      params.set("isSystem", filters.isSystem)
    }

    // Add identity provider filter
    if (filters.identityProviderId) {
      params.set("identity_provider_id", filters.identityProviderId)
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
    clients,
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

