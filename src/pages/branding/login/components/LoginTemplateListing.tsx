import * as React from 'react'
import type { ColumnFiltersState, VisibilityState } from '@tanstack/react-table'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import { DataTable, DataTablePagination, DataTableActiveFilters } from '@/components/data-table'
import { LoginTemplateToolbar } from './LoginTemplateToolbar'
import { loginTemplateColumns } from './LoginTemplateColumns'
import { useLoginTemplateQuery } from '../hooks/useLoginTemplateQuery'

export function LoginTemplateListing() {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const columns = React.useMemo(() => loginTemplateColumns, [])

  const {
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
  } = useLoginTemplateQuery()

  const table = useReactTable({
    data: loginTemplates,
    columns,
    pageCount: Math.ceil(rowCount / pagination.pageSize),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    manualSorting: true,
    manualPagination: true,
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
  })

  const activeFilters = React.useMemo(() => {
    const filterLabels: string[] = []
    if (filters.status.length > 0) {
      filterLabels.push(`Status: ${filters.status.join(', ')}`)
    }
    if (filters.template.length > 0) {
      filterLabels.push(`Template: ${filters.template.join(', ')}`)
    }
    return filterLabels
  }, [filters])

  const clearAllFilters = React.useCallback(() => {
    setFilters({
      status: [],
      template: [],
    })
  }, [setFilters])

  return (
    <div className="space-y-4">
      <LoginTemplateToolbar
        filter={searchQuery}
        setFilter={setSearchQuery}
        filters={filters}
        onFiltersChange={setFilters}
        table={table}
      />
      <DataTableActiveFilters
        activeFilters={activeFilters}
        onClearAll={clearAllFilters}
      />
      <DataTable 
        table={table} 
        columnCount={columns.length}
        isLoading={isLoading}
        error={error}
      />
      <DataTablePagination table={table} />
    </div>
  )
}
