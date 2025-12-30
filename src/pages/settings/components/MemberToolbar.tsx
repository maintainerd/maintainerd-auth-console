import * as React from "react"
import type { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Filter,
  Plus
} from "lucide-react"
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch"
import { DataTableViewOptions } from "@/components/data-table"
import type { TenantMember } from "@/services/api/tenant/members"

export interface FilterState {
  role: string
}

/**
 * MemberToolbar Props
 * Props for the Member toolbar component including search and filters
 */
interface MemberToolbarProps {
  filter: string
  setFilter: (value: string) => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  table: Table<TenantMember>
  onAddMember: () => void
}

export function MemberToolbar({ filter, setFilter, filters, onFiltersChange, table, onAddMember }: MemberToolbarProps) {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)

  // Debounced search with Enter key support
  const { searchInput, handleSearchChange, handleKeyDown } = useDebouncedSearch({
    initialValue: filter,
    delay: 500,
    onDebouncedChange: setFilter
  })

  const updateFilters = React.useCallback((newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters }
    onFiltersChange(updatedFilters)
  }, [filters, onFiltersChange])

  const clearAllFilters = React.useCallback(() => {
    const clearedFilters: FilterState = {
      role: "all"
    }
    onFiltersChange(clearedFilters)
  }, [onFiltersChange])

  const activeFilterCount = React.useMemo(() => {
    let count = 0
    if (filters.role !== "all") count++
    return count
  }, [filters])

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Search members by name or email..."
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full sm:w-80"
        />

        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="relative">
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

              {/* Role Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Role</Label>
                <Select value={filters.role} onValueChange={(value) => updateFilters({ role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <DataTableViewOptions table={table} />
        <Button size="sm" onClick={onAddMember}>
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Add Member</span>
        </Button>
      </div>
    </div>
  )
}
