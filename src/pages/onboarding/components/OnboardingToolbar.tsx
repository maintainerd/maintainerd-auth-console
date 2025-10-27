import React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Filter, Plus } from "lucide-react"
import type { OnboardingStatus, OnboardingType } from "../constants"
import { onboardingStatuses, onboardingTypes } from "../constants"

interface FilterState {
  statuses: OnboardingStatus[]
  types: OnboardingType[]
  isDefault: boolean | null
}

interface OnboardingToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export function OnboardingToolbar({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
}: OnboardingToolbarProps) {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)

  const handleCreateOnboarding = () => {
    console.log("Create new onboarding flow")
    // TODO: Implement create functionality
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.statuses.length > 0) count++
    if (filters.types.length > 0) count++
    if (filters.isDefault !== null) count++
    return count
  }

  const handleStatusChange = (status: OnboardingStatus, checked: boolean) => {
    const newStatuses = checked
      ? [...filters.statuses, status]
      : filters.statuses.filter((s) => s !== status)
    onFiltersChange({ ...filters, statuses: newStatuses })
  }

  const handleTypeChange = (type: OnboardingType, checked: boolean) => {
    const newTypes = checked
      ? [...filters.types, type]
      : filters.types.filter((t) => t !== type)
    onFiltersChange({ ...filters, types: newTypes })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      statuses: [],
      types: [],
      isDefault: null,
    })
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <Input
          placeholder="Search onboarding flows..."
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
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {onboardingStatuses.map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={filters.statuses.includes(status)}
                        onCheckedChange={(checked) =>
                          handleStatusChange(status, !!checked)
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

              <div>
                <Label className="text-sm font-medium">Type</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {onboardingTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={filters.types.includes(type)}
                        onCheckedChange={(checked) =>
                          handleTypeChange(type, !!checked)
                        }
                      />
                      <Label
                        htmlFor={`type-${type}`}
                        className="text-sm"
                      >
                        {type === "signup" ? "Public Signup" : "Invited Signup"}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>



              <div>
                <Label className="text-sm font-medium">Special Filters</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is-default"
                      checked={filters.isDefault === true}
                      onCheckedChange={(checked) =>
                        onFiltersChange({
                          ...filters,
                          isDefault: checked ? true : null,
                        })
                      }
                    />
                    <Label htmlFor="is-default" className="text-sm">
                      Default flows only
                    </Label>
                  </div>

                </div>
              </div>

              {getActiveFilterCount() > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="w-full"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Button onClick={handleCreateOnboarding}>
        <Plus className="mr-2 h-4 w-4" />
        Create Onboarding
      </Button>
    </div>
  )
}
