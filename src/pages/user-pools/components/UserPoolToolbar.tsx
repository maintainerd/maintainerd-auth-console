import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import type { Table } from "@tanstack/react-table"
import { Filter, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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

  const clearAllFilters = React.useCallback(() => {
    onFiltersChange(DEFAULT_USER_POOL_FILTERS)
  }, [onFiltersChange])

  const activeFilterCount = filters.status.length > 0 ? 1 : 0

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
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filters</h4>
                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Clear All
                  </Button>
                )}
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <div className="grid grid-cols-2 gap-2">
                  {USER_POOL_STATUSES.map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={filters.status.includes(status)}
                        onCheckedChange={(checked) => {
                          onFiltersChange({
                            status: checked
                              ? [...filters.status, status]
                              : filters.status.filter((s) => s !== status),
                          })
                        }}
                      />
                      <Label htmlFor={`status-${status}`} className="text-sm capitalize">
                        {status}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
