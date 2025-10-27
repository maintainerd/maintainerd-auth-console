import * as React from "react"
import { Filter, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { POLICY_STATUSES } from "../constants"
import type { PolicyStatus } from "../constants"

interface FilterState {
  statuses: PolicyStatus[]
  isSystem: boolean | null
  hasServices: boolean | null
}

interface PolicyToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export function PolicyToolbar({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
}: PolicyToolbarProps) {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)

  const hasActiveFilters = filters.statuses.length > 0 || filters.isSystem !== null || filters.hasServices !== null

  const clearFilters = () => {
    onFiltersChange({
      statuses: [],
      isSystem: null,
      hasServices: null
    })
  }

  const handleStatusChange = (status: PolicyStatus, checked: boolean) => {
    const newStatuses = checked
      ? [...filters.statuses, status]
      : filters.statuses.filter(s => s !== status)
    
    onFiltersChange({
      ...filters,
      statuses: newStatuses
    })
  }

  const handleSystemChange = (checked: boolean) => {
    onFiltersChange({
      ...filters,
      isSystem: checked ? true : null
    })
  }

  const handleServicesChange = (checked: boolean) => {
    onFiltersChange({
      ...filters,
      hasServices: checked ? true : null
    })
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.statuses.length > 0) count += filters.statuses.length
    if (filters.isSystem !== null) count += 1
    if (filters.hasServices !== null) count += 1
    return count
  }

  const handleCreatePolicy = () => {
    console.log("Create new policy")
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <Input
          placeholder="Search policies..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full sm:w-80"
        />

        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="relative">
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {getActiveFilterCount() > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Advanced Filters</h4>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                )}
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <div className="grid grid-cols-2 gap-2">
                  {POLICY_STATUSES.map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={filters.statuses.includes(status)}
                        onCheckedChange={(checked) =>
                          handleStatusChange(status, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`status-${status}`}
                        className="text-sm capitalize"
                      >
                        {status}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Type</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="system-policy"
                    checked={filters.isSystem === true}
                    onCheckedChange={handleSystemChange}
                  />
                  <Label htmlFor="system-policy" className="text-sm">
                    System Policies Only
                  </Label>
                </div>
              </div>

              {/* Services Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Application</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has-services"
                    checked={filters.hasServices === true}
                    onCheckedChange={handleServicesChange}
                  />
                  <Label htmlFor="has-services" className="text-sm">
                    Applied to Services
                  </Label>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Button onClick={handleCreatePolicy}>
        <Plus className="mr-2 h-4 w-4" />
        Create Policy
      </Button>
    </div>
  )
}
