import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import type { Table } from "@tanstack/react-table"
import { Check, Filter, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch"
import { DataTableViewOptions } from "@/components/data-table"
import type { UserPool } from "@/services/api/user-pools/types"
import { DEFAULT_USER_POOL_FILTERS, type FilterState } from "./userPoolFilters"

const USER_POOL_STATUSES = ["active", "inactive"] as const

interface UserPoolToolbarProps {
  filter: string
  setFilter: (value: string) => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  table: Table<UserPool>
}

export function UserPoolToolbar({ filter, setFilter, filters, onFiltersChange, table }: UserPoolToolbarProps) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)

  const { searchInput, handleSearchChange, handleKeyDown } = useDebouncedSearch({
    initialValue: filter,
    delay: 300,
    onDebouncedChange: setFilter,
  })

  const toggleStatus = React.useCallback(
    (status: string) => {
      onFiltersChange({
        status: filters.status.includes(status)
          ? filters.status.filter((s) => s !== status)
          : [...filters.status, status],
      })
    },
    [filters, onFiltersChange],
  )

  const clearAllFilters = React.useCallback(() => {
    onFiltersChange(DEFAULT_USER_POOL_FILTERS)
  }, [onFiltersChange])

  const activeFilterCount = filters.status.length

  const handleCreate = React.useCallback(() => {
    navigate(`/${tenantId}/user-pools/create`)
  }, [navigate, tenantId])

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Search user pools by name or identifier..."
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-background sm:w-80"
        />

        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="relative h-9 bg-background">
              <Filter className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-2" align="start">
            <div className="px-2 py-1.5 text-sm font-medium">Filter by status</div>
            <div className="flex flex-col">
              {USER_POOL_STATUSES.map((status) => {
                const selected = filters.status.includes(status)
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => toggleStatus(status)}
                    className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                  >
                    <span className="flex items-center gap-2 capitalize">
                      <span
                        className={cn(
                          "size-2 rounded-full",
                          status === "active" ? "bg-emerald-500" : "bg-slate-300",
                        )}
                      />
                      {status}
                    </span>
                    {selected && <Check className="size-4 text-foreground" />}
                  </button>
                )
              })}
            </div>
            {activeFilterCount > 0 && (
              <>
                <Separator className="my-1" />
                <Button variant="ghost" size="sm" className="w-full justify-center" onClick={clearAllFilters}>
                  Reset
                </Button>
              </>
            )}
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <DataTableViewOptions table={table} />
        <Button size="sm" className="h-9" onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">New User Pool</span>
        </Button>
      </div>
    </div>
  )
}
