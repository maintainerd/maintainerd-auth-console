import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
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
import { API_KEY_STATUSES } from "../constants"
import type { ApiKeyStatus } from "../constants"

interface FilterState {
  statuses: ApiKeyStatus[]
}

interface ApiKeyToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export function ApiKeyToolbar({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
}: ApiKeyToolbarProps) {
  const { containerId } = useParams<{ containerId: string }>()
  const navigate = useNavigate()
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false)

  const hasActiveFilters = filters.statuses.length > 0

  const clearFilters = () => {
    onFiltersChange({
      statuses: []
    })
  }

  const handleStatusChange = (status: ApiKeyStatus, checked: boolean) => {
    const newStatuses = checked
      ? [...filters.statuses, status]
      : filters.statuses.filter(s => s !== status)

    onFiltersChange({
      ...filters,
      statuses: newStatuses
    })
  }

  const getActiveFilterCount = () => {
    return filters.statuses.length
  }

  const handleCreateApiKey = () => {
    navigate(`/c/${containerId}/api-keys/create`)
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <Input
          placeholder="Search API keys..."
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
                <Badge
                  variant="destructive"
                  className="ml-2 h-5 w-5 rounded-full p-0 text-xs"
                >
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filters</h4>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-auto p-0 text-xs"
                  >
                    Clear all
                  </Button>
                )}
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <div className="grid grid-cols-2 gap-2">
                  {API_KEY_STATUSES.map((status) => (
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

      <Button onClick={handleCreateApiKey}>
        <Plus className="mr-2 h-4 w-4" />
        Create API Key
      </Button>
    </div>
  )
}
