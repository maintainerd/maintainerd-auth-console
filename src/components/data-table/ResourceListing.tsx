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
      {/* The table bleeds past the card's px-8 to touch its side edges (-mx-8),
          while the first/last columns re-pad to the same 32px gutter so cell
          content stays aligned with the toolbar and pagination above/below. */}
      <div className="-mx-6 md:[&_td:first-child]:pl-6 md:[&_td:last-child]:pr-6 md:[&_th:first-child]:pl-6 md:[&_th:last-child]:pr-6">
        <DataTable
          table={table}
          columnCount={columns.length}
          isLoading={isLoading}
          error={error}
          onRowClick={onRowClick}
        />
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
