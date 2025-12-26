import * as React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Table } from '@tanstack/react-table'
import { Filter, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch'
import { DataTableViewOptions } from '@/components/data-table'
import type { LoginTemplate, LoginTemplateStatusType, TemplateType } from '@/services/api/login-template/types'

const LOGIN_TEMPLATE_STATUSES: LoginTemplateStatusType[] = ['active', 'inactive'] as const
const TEMPLATE_TYPES: TemplateType[] = ['classic', 'modern', 'minimal'] as const

export interface FilterState {
  status: LoginTemplateStatusType[]
  template: TemplateType[]
}

interface LoginTemplateToolbarProps {
  filter: string
  setFilter: (value: string) => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  table: Table<LoginTemplate>
}

export function LoginTemplateToolbar({ 
  filter, 
  setFilter, 
  filters, 
  onFiltersChange, 
  table 
}: LoginTemplateToolbarProps) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)

  const { searchInput, handleSearchChange, handleKeyDown } = useDebouncedSearch({
    initialValue: filter,
    delay: 500,
    onDebouncedChange: setFilter
  })

  const updateFilters = React.useCallback((newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters }
    onFiltersChange(updatedFilters)
  }, [filters, onFiltersChange])

  const clearAllFilters = React.useCallback(() => {
    const clearedFilters: FilterState = {
      status: [],
      template: [],
    }
    onFiltersChange(clearedFilters)
  }, [onFiltersChange])

  const activeFilterCount = React.useMemo(() => {
    let count = 0
    if (filters.status.length > 0) count++
    if (filters.template.length > 0) count++
    return count
  }, [filters])

  const handleCreateTemplate = React.useCallback(() => {
    navigate(`/${tenantId}/branding/login/create`)
  }, [navigate, tenantId])

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Search login templates by name..."
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
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
                <div className="flex flex-col gap-2">
                  {LOGIN_TEMPLATE_STATUSES.map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={filters.status.includes(status)}
                        onCheckedChange={(checked) => {
                          const newStatus = checked
                            ? [...filters.status, status]
                            : filters.status.filter((s) => s !== status)
                          updateFilters({ status: newStatus })
                        }}
                      />
                      <label
                        htmlFor={`status-${status}`}
                        className="text-sm capitalize cursor-pointer"
                      >
                        {status}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Template Type Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Template Type</Label>
                <div className="flex flex-col gap-2">
                  {TEMPLATE_TYPES.map((template) => (
                    <div key={template} className="flex items-center space-x-2">
                      <Checkbox
                        id={`template-${template}`}
                        checked={filters.template.includes(template)}
                        onCheckedChange={(checked) => {
                          const newTemplate = checked
                            ? [...filters.template, template]
                            : filters.template.filter((t) => t !== template)
                          updateFilters({ template: newTemplate })
                        }}
                      />
                      <label
                        htmlFor={`template-${template}`}
                        className="text-sm capitalize cursor-pointer"
                      >
                        {template}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-2">
        <DataTableViewOptions table={table} />
        <Button size="sm" onClick={handleCreateTemplate}>
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Create Template</span>
          <span className="sm:hidden">Create</span>
        </Button>
      </div>
    </div>
  )
}
