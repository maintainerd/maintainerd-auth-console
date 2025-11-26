import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import type { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
import type { ServiceType } from "@/services/api/service/types"

export interface FilterState {
  status: string[]
  isSystem: string
}

/**
 * ServiceToolbar Props
 * Props for the service toolbar component including search and filters
 */
interface ServiceToolbarProps {
  filter: string
  setFilter: (value: string) => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  table: Table<ServiceType>
}

export function ServiceToolbar({ filter, setFilter, filters, onFiltersChange, table }: ServiceToolbarProps) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
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
      status: [],
      isSystem: "all"
    }
    onFiltersChange(clearedFilters)
  }, [onFiltersChange])

  const activeFilterCount = React.useMemo(() => {
    let count = 0
    if (filters.status.length > 0) count++
    if (filters.isSystem !== "all") count++
    return count
  }, [filters])

  // Action handlers
  const handleCreateService = React.useCallback(() => {
    navigate(`/${tenantId}/services/create`)
  }, [navigate, tenantId])

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Search services by name, description, or maintainer..."
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

              {/* Status Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["active", "maintenance", "deprecated", "inactive"].map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={filters.status.includes(status)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFilters({ status: [...filters.status, status] })
                          } else {
                            updateFilters({ status: filters.status.filter(s => s !== status) })
                          }
                        }}
                      />
                      <Label htmlFor={`status-${status}`} className="text-sm capitalize">
                        {status}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              {/* Service Type Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Service Type</Label>
                <Select value={filters.isSystem} onValueChange={(value) => updateFilters({ isSystem: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="system">System Services</SelectItem>
                    <SelectItem value="regular">Regular Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <DataTableViewOptions table={table} />
        <Button size="sm" onClick={handleCreateService}>
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">New Service</span>
        </Button>
      </div>
    </div>
  )
}
