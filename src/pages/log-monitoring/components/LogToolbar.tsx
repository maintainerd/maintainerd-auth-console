import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
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
  Download,
  RefreshCw,
  X,
  Play,
  Pause
} from "lucide-react"
import {
  LOG_LEVEL_OPTIONS,
  LOG_STATUS_OPTIONS,
  LOG_SERVICE_OPTIONS,
  TIME_RANGE_OPTIONS,
  type LogLevel,
  type LogStatus
} from "../constants"

export interface LogFilterState {
  levels: LogLevel[]
  services: string[]
  status: LogStatus[]
  timeRange: string
  ipAddress: string
  userId: string
  requestId: string
  tags: string[]
  hasError: boolean
  hasUser: boolean
  minResponseTime: string
  maxResponseTime: string
}

interface LogToolbarProps {
  filter: string
  setFilter: (value: string) => void
  selectedCount?: number
  onFiltersChange: (filters: LogFilterState) => void
  isLiveMode: boolean
  onToggleLiveMode: () => void
}

export function LogToolbar({ 
  filter, 
  setFilter, 
  selectedCount = 0, 
  onFiltersChange,
  isLiveMode,
  onToggleLiveMode
}: LogToolbarProps) {
  const [filters, setFilters] = React.useState<LogFilterState>({
    levels: [],
    services: [],
    status: [],
    timeRange: "24h",
    ipAddress: "",
    userId: "",
    requestId: "",
    tags: [],
    hasError: false,
    hasUser: false,
    minResponseTime: "",
    maxResponseTime: ""
  })

  const [isFilterOpen, setIsFilterOpen] = React.useState(false)
  const [tagInput, setTagInput] = React.useState("")

  const handleExport = () => {
    console.log("Export logs")
  }

  const handleRefresh = () => {
    console.log("Refresh logs")
  }

  const handleClearFilters = () => {
    const clearedFilters: LogFilterState = {
      levels: [],
      services: [],
      status: [],
      timeRange: "24h",
      ipAddress: "",
      userId: "",
      requestId: "",
      tags: [],
      hasError: false,
      hasUser: false,
      minResponseTime: "",
      maxResponseTime: ""
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const updateFilters = (updates: Partial<LogFilterState>) => {
    const newFilters = { ...filters, ...updates }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  // Calculate active filter count
  const activeFilterCount = [
    filters.levels.length > 0,
    filters.services.length > 0,
    filters.status.length > 0,
    filters.timeRange !== "24h",
    filters.ipAddress.trim() !== "",
    filters.userId.trim() !== "",
    filters.requestId.trim() !== "",
    filters.tags.length > 0,
    filters.hasError,
    filters.hasUser,
    filters.minResponseTime.trim() !== "",
    filters.maxResponseTime.trim() !== ""
  ].filter(Boolean).length

  // Add tag
  const addTag = (tag: string) => {
    if (tag.trim() && !filters.tags.includes(tag.trim())) {
      updateFilters({ tags: [...filters.tags, tag.trim()] })
      setTagInput("")
    }
  }

  // Remove tag
  const removeTag = (tag: string) => {
    updateFilters({ tags: filters.tags.filter(t => t !== tag) })
  }

  // Toggle array filter
  const toggleArrayFilter = <T,>(key: keyof LogFilterState, value: T) => {
    const currentArray = filters[key] as T[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    updateFilters({ [key]: newArray })
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <Input
          placeholder="Search logs by message, user, IP, request ID..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full sm:w-80"
        />
        
        <div className="flex items-center gap-2">
          {/* Time Range Quick Filter */}
          <Select
            value={filters.timeRange}
            onValueChange={(value) => updateFilters({ timeRange: value })}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIME_RANGE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Advanced Filters */}
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="outline" className="ml-2 h-5 w-5 rounded-full p-0 text-xs bg-red-100 text-red-800 border-red-200">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="start">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Advanced Filters</h4>
                  {activeFilterCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                      Clear all
                    </Button>
                  )}
                </div>

                {/* Log Levels */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Log Levels</Label>
                  <div className="flex flex-wrap gap-1">
                    {LOG_LEVEL_OPTIONS.slice(1).map((option) => (
                      <Button
                        key={option.value}
                        variant={filters.levels.includes(option.value as LogLevel) ? "default" : "outline"}
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => toggleArrayFilter("levels", option.value as LogLevel)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>


                {/* Services */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Services</Label>
                  <Select
                    value=""
                    onValueChange={(value) => {
                      if (value !== "all" && !filters.services.includes(value)) {
                        updateFilters({ services: [...filters.services, value] })
                      }
                    }}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Select services..." />
                    </SelectTrigger>
                    <SelectContent>
                      {LOG_SERVICE_OPTIONS.slice(1).map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {filters.services.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {filters.services.map((service) => (
                        <Badge key={service} variant="outline" className="bg-purple-100 text-purple-800 border-purple-200 text-xs">
                          {service}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-3 w-3 p-0"
                            onClick={() => updateFilters({
                              services: filters.services.filter(s => s !== service)
                            })}
                          >
                            <X className="h-2 w-2" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="flex flex-wrap gap-1">
                    {LOG_STATUS_OPTIONS.slice(1).map((option) => (
                      <Button
                        key={option.value}
                        variant={filters.status.includes(option.value as LogStatus) ? "default" : "outline"}
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => toggleArrayFilter("status", option.value as LogStatus)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Additional Filters */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs">IP Address</Label>
                    <Input
                      placeholder="192.168.1.1"
                      value={filters.ipAddress}
                      onChange={(e) => updateFilters({ ipAddress: e.target.value })}
                      className="text-sm h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">User ID</Label>
                    <Input
                      placeholder="usr_123"
                      value={filters.userId}
                      onChange={(e) => updateFilters({ userId: e.target.value })}
                      className="text-sm h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Request ID</Label>
                    <Input
                      placeholder="req_abc123"
                      value={filters.requestId}
                      onChange={(e) => updateFilters({ requestId: e.target.value })}
                      className="text-sm h-8"
                    />
                  </div>
                </div>

                {/* Response Time Range */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Response Time (ms)</Label>
                  <div className="grid gap-2 grid-cols-2">
                    <Input
                      placeholder="Min"
                      value={filters.minResponseTime}
                      onChange={(e) => updateFilters({ minResponseTime: e.target.value })}
                      className="text-sm h-8"
                      type="number"
                    />
                    <Input
                      placeholder="Max"
                      value={filters.maxResponseTime}
                      onChange={(e) => updateFilters({ maxResponseTime: e.target.value })}
                      className="text-sm h-8"
                      type="number"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addTag(tagInput)
                        }
                      }}
                      className="text-sm h-8"
                    />
                    <Button
                      size="sm"
                      onClick={() => addTag(tagInput)}
                      disabled={!tagInput.trim()}
                    >
                      Add
                    </Button>
                  </div>
                  {filters.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {filters.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="bg-gray-100 text-gray-800 border-gray-200 text-xs">
                          {tag}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-3 w-3 p-0"
                            onClick={() => removeTag(tag)}
                          >
                            <X className="h-2 w-2" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Live Mode Toggle */}
        <Button
          variant={isLiveMode ? "default" : "outline"}
          size="sm"
          onClick={onToggleLiveMode}
        >
          {isLiveMode ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
          {isLiveMode ? "Live" : "Paused"}
        </Button>

        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>

        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  )
}
