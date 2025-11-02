"use client"

import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Search, Filter, X, Plus, Shield } from "lucide-react"
import { IDENTITY_PROVIDER_STATUSES } from "../constants"

export interface FilterState {
  type: string[]
  status: string[]
}

interface IdentityProviderToolbarProps {
  filter: string
  setFilter: (value: string) => void
  onFiltersChange: (filters: FilterState) => void
}

export function IdentityProviderToolbar({
  filter,
  setFilter,
  onFiltersChange,
}: IdentityProviderToolbarProps) {
  const { containerId } = useParams<{ containerId: string }>()
  const navigate = useNavigate()

  const [filters, setFilters] = React.useState<FilterState>({
    type: [],
    status: []
  })

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFiltersChange(updatedFilters)
  }

  const clearAllFilters = () => {
    const clearedFilters = {
      type: [],
      status: []
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const handleAddProvider = () => {
    navigate(`/c/${containerId}/providers/identity/create`)
  }

  const hasActiveFilters = filters.type.length > 0 ||
    filters.status.length > 0

  const activeFilterCount = React.useMemo(() => {
    let count = 0
    if (filters.type.length > 0) count += filters.type.length
    if (filters.status.length > 0) count += filters.status.length
    return count
  }, [filters])

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search identity providers..."
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="pl-8 w-[300px]"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="relative">
              <Filter className="mr-2 h-4 w-4" />
              Filters
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
                <h4 className="font-medium">Advanced Filters</h4>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Clear All
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="font-medium leading-none">Provider Type</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {[
                    { id: "cognito", name: "AWS Cognito" },
                    { id: "auth0", name: "Auth0" },
                    { id: "okta", name: "Okta" },
                    { id: "azure_ad", name: "Azure AD" },
                    { id: "keycloak", name: "Keycloak" },
                    { id: "firebase", name: "Firebase" },
                    { id: "custom", name: "Custom" }
                  ].map((type) => (
                    <div key={type.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type.id}`}
                        checked={filters.type.includes(type.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFilters({ type: [...filters.type, type.id] })
                          } else {
                            updateFilters({ type: filters.type.filter(t => t !== type.id) })
                          }
                        }}
                      />
                      <Label htmlFor={`type-${type.id}`} className="text-sm">
                        {type.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <div className="grid grid-cols-2 gap-2">
                  {IDENTITY_PROVIDER_STATUSES.map((status) => (
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

      <Button onClick={handleAddProvider}>
        <Plus className="mr-2 h-4 w-4" />
        <span className="hidden sm:inline">Add Provider</span>
        <span className="sm:hidden">Add</span>
      </Button>
    </div>
  )
}
