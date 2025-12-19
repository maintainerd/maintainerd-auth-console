import * as React from "react"
import { useSearchParams } from "react-router-dom"
import type { SortingState } from "@tanstack/react-table"
import { useUsers } from "@/hooks/useUsers"

type FilterState = {
  status: string[]
}

export function useUserQuery() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = React.useState(() => searchParams.get("search") || "")
  
  // Filters
  const [filters, setFilters] = React.useState<FilterState>(() => ({
    status: searchParams.get("status")?.split(",").filter(Boolean) || [],
  }))

  // Sorting
  const [sorting, setSorting] = React.useState<SortingState>(() => {
    const sortBy = searchParams.get("sortBy")
    const sortOrder = searchParams.get("sortOrder")
    if (sortBy) {
      return [{ id: sortBy, desc: sortOrder === "desc" }]
    }
    return [{ id: "created_at", desc: false }]
  })

  // Pagination
  const [pagination, setPagination] = React.useState(() => ({
    pageIndex: Math.max(0, Number(searchParams.get("page") || 1) - 1),
    pageSize: Number(searchParams.get("limit") || 10),
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
      username?: string
      email?: string
      phone?: string
      status?: string
    } = {
      page: pagination.pageIndex + 1, // API uses 1-based pagination
      limit: pagination.pageSize,
      sort_by: sortField,
      sort_order: sortOrder
    }

    // Add search query to username, email, and phone
    if (searchQuery) {
      params.username = searchQuery
      params.email = searchQuery
      params.phone = searchQuery
    }

    // Map status filter
    if (filters.status.length > 0) {
      params.status = filters.status.join(',')
    }

    return params
  }, [searchQuery, filters, sorting, pagination.pageIndex, pagination.pageSize])

  // Fetch users using the custom hook
  const { data, isLoading, error } = useUsers(queryParams)

  const users = data?.rows || []
  const rowCount = data?.total || 0

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

    // Add sorting
    if (sorting.length > 0) {
      params.set("sortBy", sorting[0].id)
      params.set("sortOrder", sorting[0].desc ? "desc" : "asc")
    }

    // Add pagination
    params.set("page", String(pagination.pageIndex + 1))
    params.set("limit", String(pagination.pageSize))

    // Update URL without triggering a navigation
    setSearchParams(params, { replace: true })
  }, [searchQuery, filters, sorting, pagination, setSearchParams])

  return {
    users,
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
