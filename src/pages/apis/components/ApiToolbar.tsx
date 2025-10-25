import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  Key,
  X
} from "lucide-react"

export interface FilterState {
  status: string[]
  serviceId: string[]
}

interface ApiToolbarProps {
  filter: string
  setFilter: (value: string) => void
  onFiltersChange?: (filters: FilterState) => void
}

export function ApiToolbar({ filter, setFilter, onFiltersChange }: ApiToolbarProps) {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)
  const [filters, setFilters] = React.useState<FilterState>({
    status: [],
    serviceId: []
  })

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFiltersChange?.(updatedFilters)
  }

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      status: [],
      serviceId: []
    }
    setFilters(clearedFilters)
    onFiltersChange?.(clearedFilters)
  }

  const activeFilterCount = React.useMemo(() => {
    let count = 0
    if (filters.status.length > 0) count++
    if (filters.serviceId.length > 0) count++
    return count
  }, [filters])

  const handleExport = () => {
    console.log("Export APIs")
    // TODO: Implement export functionality
  }

  const handleImport = () => {
    console.log("Import APIs")
    // TODO: Implement import functionality
  }

  const handleManagePermissions = () => {
    console.log("Manage Permissions")
    // TODO: Implement manage permissions
  }

  const handleNewApi = () => {
    console.log("Create new API")
    // TODO: Implement new API creation
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Search APIs by name, description, or service..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
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

              {/* Service Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Service</Label>
                <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                  {[
                    { id: "core", name: "Core Service" },
                    { id: "auth", name: "Authentication Service" },
                    { id: "sms", name: "SMS Service" },
                    { id: "email", name: "Email Service" },
                    { id: "storage", name: "Storage Service" },
                    { id: "analytics", name: "Analytics Service" },
                    { id: "webhook", name: "Webhook Service" },
                    { id: "legacy-api", name: "Legacy API Service" }
                  ].map((service) => (
                    <div key={service.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`service-${service.id}`}
                        checked={filters.serviceId.includes(service.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFilters({ serviceId: [...filters.serviceId, service.id] })
                          } else {
                            updateFilters({ serviceId: filters.serviceId.filter(s => s !== service.id) })
                          }
                        }}
                      />
                      <Label htmlFor={`service-${service.id}`} className="text-sm">
                        {service.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>


            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Right side - Action buttons */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleManagePermissions}>
          <Key className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Manage Permissions</span>
        </Button>

        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>

        <Button variant="outline" size="sm" onClick={handleImport}>
          <Upload className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Import</span>
        </Button>

        <Button size="sm" onClick={handleNewApi}>
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">New API</span>
        </Button>
      </div>
    </div>
  )
}
