import * as React from "react"
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
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  Key,
  FileText
} from "lucide-react"

export interface FilterState {
  apiId: string[]
  isSystem: string
}

interface PermissionToolbarProps {
  filter: string
  setFilter: (value: string) => void
  onFiltersChange: (filters: FilterState) => void
}

export function PermissionToolbar({ filter, setFilter, onFiltersChange }: PermissionToolbarProps) {
  const [filters, setFilters] = React.useState<FilterState>({
    apiId: [],
    isSystem: "all"
  })

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFiltersChange(updatedFilters)
  }

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      apiId: [],
      isSystem: "all"
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const activeFilterCount = React.useMemo(() => {
    let count = 0
    if (filters.apiId.length > 0) count += filters.apiId.length
    if (filters.isSystem !== "all") count += 1
    return count
  }, [filters])

  const handleCreatePermission = () => {
    console.log("Create new permission")
    // TODO: Implement create permission
  }

  const handleImport = () => {
    console.log("Import permissions")
    // TODO: Implement import functionality
  }

  const handleExport = () => {
    console.log("Export permissions")
    // TODO: Implement export functionality
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search permissions..."
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="pl-8 w-[300px]"
          />
        </div>
        
        <Popover>
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
              <div className="space-y-2">
                <h4 className="font-medium leading-none">API</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {[
                    { id: "api_001", name: "User Management API" },
                    { id: "api_002", name: "Role Management API" },
                    { id: "api_003", name: "Order Management API" },
                    { id: "api_004", name: "Product Catalog API" },
                    { id: "api_005", name: "Notification API" },
                    { id: "api_006", name: "Payment Processing API" },
                    { id: "api_007", name: "Analytics API" }
                  ].map((api) => (
                    <div key={api.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`api-${api.id}`}
                        checked={filters.apiId.includes(api.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFilters({ apiId: [...filters.apiId, api.id] })
                          } else {
                            updateFilters({ apiId: filters.apiId.filter(a => a !== api.id) })
                          }
                        }}
                      />
                      <Label htmlFor={`api-${api.id}`} className="text-sm">
                        {api.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium leading-none">Type</h4>
                <Select
                  value={filters.isSystem}
                  onValueChange={(value) => updateFilters({ isSystem: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Permissions</SelectItem>
                    <SelectItem value="system">System Only</SelectItem>
                    <SelectItem value="custom">Custom Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {activeFilterCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={handleImport}>
          <Upload className="mr-2 h-4 w-4" />
          Import
        </Button>
        
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        
        <Button size="sm" onClick={handleCreatePermission}>
          <Plus className="mr-2 h-4 w-4" />
          Create Permission
        </Button>
      </div>
    </div>
  )
}
