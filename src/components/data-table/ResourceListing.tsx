import type { ColumnDef, SortingState } from "@tanstack/react-table"
import { DataTable } from "./DataTable"
import { DataTablePagination } from "./DataTablePagination"
import { DataTableActiveFilters } from "./DataTableActiveFilters"
import { ListingToolbar } from "./ListingToolbar"
import {
  useServerDataTable,
  type FilterGroup,
  type UseListData,
} from "./useServerDataTable"

interface ResourceListingProps<TRow, TParams> {
  columns: ColumnDef<TRow>[]
  defaultSort: SortingState
  /** API params the free-text search maps to. */
  searchFields: string[]
  searchPlaceholder: string
  /** The resource's strongly-typed list hook (e.g. `useUsers`). */
  useData: UseListData<TRow, TParams>
  filterGroups?: readonly FilterGroup[]
  /** Navigate when a row body is clicked (the actions menu is ignored). */
  onRowClick?: (row: TRow) => void
  onCreate?: () => void
  createLabel?: string
  defaultPageSize?: number
}

/**
 * The standard server-driven listing: toolbar (search + filters + create) →
 * active-filter chips → table → pagination. A listing page declares its columns
 * and a small config; all the state/URL/query/table wiring lives in the shared
 * `useServerDataTable` engine.
 */
export function ResourceListing<TRow, TParams = Record<string, unknown>>({
  columns,
  defaultSort,
  searchFields,
  searchPlaceholder,
  useData,
  filterGroups,
  onRowClick,
  onCreate,
  createLabel,
  defaultPageSize,
}: ResourceListingProps<TRow, TParams>) {
  const { table, isLoading, error, search, setSearch, filters, setFilters, activeFilters, clearFilters } =
    useServerDataTable<TRow, TParams>({
      columns,
      defaultSort,
      searchFields,
      filterGroups,
      useData,
      defaultPageSize,
    })

  return (
    <div className="space-y-4">
      <ListingToolbar
        table={table}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={searchPlaceholder}
        filterGroups={filterGroups}
        filters={filters}
        onFiltersChange={setFilters}
        onCreate={onCreate}
        createLabel={createLabel}
      />
      <DataTableActiveFilters activeFilters={activeFilters} onClearAll={clearFilters} />
      <DataTable
        table={table}
        columnCount={columns.length}
        isLoading={isLoading}
        error={error}
        onRowClick={onRowClick}
      />
      <DataTablePagination table={table} />
    </div>
  )
}
