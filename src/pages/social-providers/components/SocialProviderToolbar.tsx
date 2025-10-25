import * as React from "react"
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
import { Search, Filter, X, Plus, Shield } from "lucide-react"
import { SOCIAL_PROVIDER_STATUSES, SOCIAL_PROVIDER_TYPES } from "../constants"

export interface FilterState {
  type: string[]
  status: string[]
}

interface SocialProviderToolbarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export function SocialProviderToolbar({
  searchValue,
  onSearchChange,
  filters,
  onFiltersChange,
}: SocialProviderToolbarProps) {

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters }
    onFiltersChange(updatedFilters)
  }

  const clearAllFilters = () => {
    const clearedFilters = {
      type: [],
      status: []
    }
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters = filters.type.length > 0 ||
    filters.status.length > 0

  const activeFilterCount = React.useMemo(() => {
    let count = 0
    if (filters.type.length > 0) count += filters.type.length
    if (filters.status.length > 0) count += filters.status.length
    return count
  }, [filters])

  const handleAddProvider = () => {
    console.log("Add new social provider")
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search social providers..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="relative">
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="ml-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium leading-none">Advanced Filters</h4>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Clear All
                  </Button>
                )}
              </div>

              {/* Provider Type Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Provider Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {SOCIAL_PROVIDER_TYPES.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={filters.type.includes(type)}
                        onCheckedChange={(checked) => {
                          const newType = checked
                            ? [...filters.type, type]
                            : filters.type.filter(t => t !== type)
                          updateFilters({ type: newType })
                        }}
                      />
                      <Label htmlFor={`type-${type}`} className="text-sm capitalize">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <div className="grid grid-cols-2 gap-2">
                  {SOCIAL_PROVIDER_STATUSES.map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={filters.status.includes(status)}
                        onCheckedChange={(checked) => {
                          const newStatus = checked
                            ? [...filters.status, status]
                            : filters.status.filter(s => s !== status)
                          updateFilters({ status: newStatus })
                        }}
                      />
                      <Label htmlFor={`status-${status}`} className="text-sm capitalize">
                        {status}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {activeFilterCount > 0 && (
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm text-muted-foreground">
                    {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} applied
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-8 px-2 lg:px-3"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Button onClick={handleAddProvider} size="sm">
        <Plus className="mr-2 h-4 w-4" />
        <span className="hidden sm:inline">Add Provider</span>
        <span className="sm:hidden">Add</span>
      </Button>
    </div>
  )
}
