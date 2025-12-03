import * as React from "react"
import { useSearchParams } from "react-router-dom"
import type { SortingState } from "@tanstack/react-table"
import { useIdentityProviders } from "@/hooks/useIdentityProviders"
import type { IdentityProviderQueryParams } from "@/services/api/identity-provider/types"

export interface FilterState {
  status: string[]
  provider: string[]
  isSystem: string
}

/**
 * Custom hook to manage social provider query state
 * Syncs filters, search, sorting, and pagination with URL search params
 */
export function useSocialProviderQuery() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = React.useState(searchParams.get("search") || "")
  const [filters, setFilters] = React.useState<FilterState>({
    status: searchParams.get("status")?.split(",").filter(Boolean) || [],
    provider: searchParams.get("provider")?.split(",").filter(Boolean) || [],
    isSystem: searchParams.get("isSystem") || "all"
  })
  const [sorting, setSorting] = React.useState<SortingState>(() => {
    const sortBy = searchParams.get("sort_by")
    const sortOrder = searchParams.get("sort_order")
    if (sortBy && sortOrder) {
      return [{ id: sortBy, desc: sortOrder === "desc" }]
    }
    return [{ id: "name", desc: false }]
  })
  const [pagination, setPagination] = React.useState({
    pageIndex: parseInt(searchParams.get("page") || "1") - 1,
    pageSize: parseInt(searchParams.get("limit") || "10")
  })

  // Build query params
  const queryParams = React.useMemo((): IdentityProviderQueryParams => {
    const params: IdentityProviderQueryParams = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      provider_type: "social" // Always filter for social providers
    }

    // Add search query
    if (searchQuery) {
      params.name = searchQuery
      params.display_name = searchQuery
      params.identifier = searchQuery
    }

    // Add filters
    if (filters.status.length > 0) {
      params.status = filters.status.join(",") as any
    }
    if (filters.provider.length > 0) {
      params.provider = filters.provider.join(",") as any
    }
    if (filters.isSystem !== "all") {
      params.is_system = filters.isSystem === "system"
    }

    // Add sorting
    if (sorting.length > 0) {
      params.sort_by = sorting[0].id
      params.sort_order = sorting[0].desc ? "desc" : "asc"
    }

    return params
  }, [searchQuery, filters, sorting, pagination])

  // Fetch social providers
  const { data, isLoading, error } = useIdentityProviders(queryParams)

  // Sync state to URL params
  React.useEffect(() => {
    const params = new URLSearchParams()

    if (searchQuery) params.set("search", searchQuery)
    if (filters.status.length > 0) params.set("status", filters.status.join(","))
    if (filters.provider.length > 0) params.set("provider", filters.provider.join(","))
    if (filters.isSystem !== "all") params.set("isSystem", filters.isSystem)
    if (sorting.length > 0) {
      params.set("sort_by", sorting[0].id)
      params.set("sort_order", sorting[0].desc ? "desc" : "asc")
    }
    params.set("page", String(pagination.pageIndex + 1))
    params.set("limit", String(pagination.pageSize))

    setSearchParams(params, { replace: true })
  }, [searchQuery, filters, sorting, pagination, setSearchParams])

  return {
    socialProviders: data?.rows || [],
    rowCount: data?.total || 0,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    sorting,
    setSorting,
    pagination,
    setPagination
  }
}

