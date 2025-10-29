import * as React from "react"
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { SmsTemplateToolbar, type FilterState } from "./SmsTemplateToolbar"

interface SmsTemplateDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function SmsTemplateDataTable<TData, TValue>({
  columns,
  data,
}: SmsTemplateDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [advancedFilters, setAdvancedFilters] = React.useState<FilterState>({
    types: [],
    categories: [],
    isSystem: "all"
  })

  // Global filter function
  const globalFilterFn = React.useCallback((row: any, columnId: string, filterValue: string) => {
    const searchValue = filterValue.toLowerCase()
    const template = row.original
    
    // Search across multiple fields
    const searchableText = [
      template.name,
      template.description,
      template.type,
      template.category,
      template.content?.message,
      template.createdBy,
      ...(template.variables?.map((v: any) => v.name) || [])
    ].filter(Boolean).join(' ').toLowerCase()
    
    return searchableText.includes(searchValue)
  }, [])

  // Advanced filter function
  const filteredData = React.useMemo(() => {
    return data.filter((template: any) => {
      // Type filter
      if (advancedFilters.types.length > 0 && !advancedFilters.types.includes(template.type)) {
        return false
      }
      
      // Category filter
      if (advancedFilters.categories.length > 0 && !advancedFilters.categories.includes(template.category)) {
        return false
      }
      
      // System/Custom filter
      if (advancedFilters.isSystem !== "all") {
        const isSystemTemplate = template.isSystem
        if (advancedFilters.isSystem === "system" && !isSystemTemplate) return false
        if (advancedFilters.isSystem === "custom" && isSystemTemplate) return false
      }
      
      return true
    })
  }, [data, advancedFilters])

  const selectedCount = Object.keys(rowSelection).length

  // Active filters display
  const activeFilters = React.useMemo(() => {
    const filtersList = []
    if (advancedFilters.types.length > 0) {
      filtersList.push(`Type: ${advancedFilters.types.map(t => t.replace('_', ' ')).join(", ")}`)
    }
    if (advancedFilters.categories.length > 0) {
      filtersList.push(`Category: ${advancedFilters.categories.map(c => c.replace('_', ' ')).join(", ")}`)
    }
    if (advancedFilters.isSystem !== "all") {
      filtersList.push(`Template: ${advancedFilters.isSystem === "system" ? "System" : "Custom"}`)
    }
    return filtersList
  }, [advancedFilters])

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    globalFilterFn,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const [globalFilter, setGlobalFilter] = React.useState("")

  React.useEffect(() => {
    table.setGlobalFilter(globalFilter)
  }, [globalFilter, table])

  return (
    <div className="space-y-4">
      <SmsTemplateToolbar 
        filter={globalFilter}
        setFilter={setGlobalFilter}
        selectedCount={selectedCount}
        onFiltersChange={setAdvancedFilters}
      />

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {filter}
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => setAdvancedFilters({
              types: [],
              categories: [],
              isSystem: "all"
            })}
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="whitespace-nowrap">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Responsive Pagination */}
      <div className="flex flex-col gap-4 px-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Left side - Rows per page and results info */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:space-x-2">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length === 0
              ? "No results"
              : `${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-${Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )} of ${table.getFilteredRowModel().rows.length} results`}
          </div>
        </div>
        {/* Right side - Navigation buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
