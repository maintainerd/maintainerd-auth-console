import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Filter,
  Plus,
  Download,
  Upload,
  Server,
  FileText
} from "lucide-react"

export interface FilterState {
  status: string[]
  isSystem: string
}

interface ServiceToolbarProps {
  filter: string
  setFilter: (value: string) => void
  onFiltersChange?: (filters: FilterState) => void
}

export function ServiceToolbar({ filter, setFilter, onFiltersChange }: ServiceToolbarProps) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)
  const [filters, setFilters] = React.useState<FilterState>({
    status: [],
    isSystem: "all"
  })

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFiltersChange?.(updatedFilters)
  }

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      status: [],
      isSystem: "all"
    }
    setFilters(clearedFilters)
    onFiltersChange?.(clearedFilters)
  }

  const activeFilterCount = React.useMemo(() => {
    let count = 0
    if (filters.status.length > 0) count++
    if (filters.isSystem !== "all") count++
    return count
  }, [filters])

  // Action handlers
  const handleCreateService = () => {
    navigate(`/${tenantId}/services/create`)
  }

  const handleExport = () => {
    console.log("Export services")
    // TODO: Implement export functionality
  }

  const handleImport = () => {
    console.log("Import services")
    // TODO: Implement import functionality
  }

  const handleManageAPIs = () => {
    console.log("Navigate to APIs management")
    // TODO: Navigate to APIs page
  }

  const handleManagePolicies = () => {
    console.log("Navigate to Policies management")
    // TODO: Navigate to Policies page
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Search services by name, description, or maintainer..."
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
        <Button variant="outline" size="sm" onClick={handleManageAPIs}>
          <Server className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Manage APIs</span>
        </Button>

        <Button variant="outline" size="sm" onClick={handleManagePolicies}>
          <FileText className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Manage Policies</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="p-2">
              <p className="text-sm text-muted-foreground">Export functionality coming soon</p>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" size="sm" onClick={handleImport}>
          <Upload className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Import</span>
        </Button>

        <Button size="sm" onClick={handleCreateService}>
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">New Service</span>
        </Button>
      </div>
    </div>
  )
}
