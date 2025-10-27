import * as React from "react"
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
import { CLIENT_STATUSES, CLIENT_TYPES } from "../constants"
import type { ClientStatus, ClientType } from "../constants"

interface FilterState {
  types: ClientType[]
  statuses: ClientStatus[]
}

interface ClientToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export function ClientToolbar({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
}: ClientToolbarProps) {
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false)

  const hasActiveFilters = filters.types.length > 0 || filters.statuses.length > 0

  const clearFilters = () => {
    onFiltersChange({
      types: [],
      statuses: []
    })
  }

  const handleTypeChange = (type: ClientType, checked: boolean) => {
    const newTypes = checked
      ? [...filters.types, type]
      : filters.types.filter(t => t !== type)
    
    onFiltersChange({
      ...filters,
      types: newTypes
    })
  }

  const handleStatusChange = (status: ClientStatus, checked: boolean) => {
    const newStatuses = checked
      ? [...filters.statuses, status]
      : filters.statuses.filter(s => s !== status)
    
    onFiltersChange({
      ...filters,
      statuses: newStatuses
    })
  }

  const getActiveFilterCount = () => {
    return filters.types.length + filters.statuses.length
  }

  const handleCreateClient = () => {
    console.log("Create new client")
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <Input
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full sm:w-80"
        />

        <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="relative">
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {hasActiveFilters && (
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                  >
                    Clear All
                  </Button>
                )}
              </div>

              {/* Client Type Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Client Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {CLIENT_TYPES.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={filters.types.includes(type)}
                        onCheckedChange={(checked) =>
                          handleTypeChange(type, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`type-${type}`}
                        className="text-sm capitalize"
                      >
                        {type === "spa" ? "SPA" : type === "m2m" ? "M2M" : type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <div className="grid grid-cols-2 gap-2">
                  {CLIENT_STATUSES.map((status) => (
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
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Button onClick={handleCreateClient}>
        <Plus className="mr-2 h-4 w-4" />
        Create Client
      </Button>
    </div>
  )
}
