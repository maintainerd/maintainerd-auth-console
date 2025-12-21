import * as React from "react"
import type { PaginationState, SortingState } from "@tanstack/react-table"
import { useSignupFlows } from "@/hooks/useSignupFlows"
import type { SignupFlowStatusType } from "@/services/api/signup-flow/types"

interface SignupFlowFilters {
  status: SignupFlowStatusType[]
}

export function useSignupFlowQuery() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filters, setFilters] = React.useState<SignupFlowFilters>({
    status: [],
  })
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "created_at", desc: true },
  ])
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // Build query parameters
  const queryParams = React.useMemo(() => {
    const params: Record<string, string | number> = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    }

    if (searchQuery) {
      params.name = searchQuery
    }

    if (filters.status.length === 1) {
      params.status = filters.status[0]
    }

    if (sorting.length > 0) {
      params.sort_by = sorting[0].id
      params.sort_order = sorting[0].desc ? "desc" : "asc"
    }

    return params
  }, [pagination, searchQuery, filters, sorting])

  const { data, isLoading, error } = useSignupFlows(queryParams)

  const signupFlows = React.useMemo(() => data?.rows || [], [data])
  const rowCount = data?.total || 0

  return {
    signupFlows,
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
