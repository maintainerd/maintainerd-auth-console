import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Filter,
  Plus,
  Download,
  Upload,
  Mail,
  Trash2,
  X
} from "lucide-react"
import {
  emailTemplateTypes,
  emailTemplateCategories,
  typeDescriptions,
  categoryDescriptions
} from "../types"

export interface FilterState {
  types: string[]
  categories: string[]
  isSystem: string
}

interface EmailTemplateToolbarProps {
  filter: string
  setFilter: (value: string) => void
  selectedCount?: number
  onFiltersChange?: (filters: FilterState) => void
}

export function EmailTemplateToolbar({ 
  filter, 
  setFilter, 
  selectedCount = 0, 
  onFiltersChange 
}: EmailTemplateToolbarProps) {
  const [filters, setFilters] = React.useState<FilterState>({
    types: [],
    categories: [],
    isSystem: "all"
  })

  const [isFilterOpen, setIsFilterOpen] = React.useState(false)

  const handleAddTemplate = () => {
    console.log("Add new email template")
  }

  const handleBulkSend = () => {
    console.log("Bulk send test emails")
  }

  const handleExport = () => {
    console.log("Export email templates")
  }

  const handleImport = () => {
    console.log("Import email templates")
  }

  const handleBulkDelete = () => {
    console.log("Bulk delete selected templates")
  }

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFiltersChange?.(updatedFilters)
  }

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      types: [],
      categories: [],
      isSystem: "all"
    }
    setFilters(clearedFilters)
    onFiltersChange?.(clearedFilters)
  }

  const activeFilterCount = [
    filters.types.length > 0,
    filters.categories.length > 0,
    filters.isSystem !== "all"
  ].filter(Boolean).length

  const toggleArrayFilter = (
    key: keyof Pick<FilterState, 'types' | 'categories'>,
    value: string
  ) => {
    const currentArray = filters[key]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    updateFilters({ [key]: newArray })
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <Input
          placeholder="Search templates by name, type, or content..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full sm:w-80"
        />
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
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
                <h4 className="font-medium">Filters</h4>
                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="mr-1 h-3 w-3" />
                    Clear
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Type</Label>
                <div className="space-y-2">
                  {emailTemplateTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={filters.types.includes(type)}
                        onCheckedChange={() => toggleArrayFilter('types', type)}
                      />
                      <Label htmlFor={`type-${type}`} className="text-sm">
                        {type.replace('_', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm font-medium">Category</Label>
                <div className="space-y-2">
                  {emailTemplateCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={filters.categories.includes(category)}
                        onCheckedChange={() => toggleArrayFilter('categories', category)}
                      />
                      <Label htmlFor={`category-${category}`} className="text-sm">
                        {category.replace('_', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm font-medium">Template Type</Label>
                <Select
                  value={filters.isSystem}
                  onValueChange={(value) => updateFilters({ isSystem: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Templates</SelectItem>
                    <SelectItem value="system">System Templates</SelectItem>
                    <SelectItem value="custom">Custom Templates</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-2">
        {selectedCount > 0 ? (
          <>
            <span className="text-sm text-muted-foreground">
              {selectedCount} selected
            </span>
            <Button variant="outline" size="sm" onClick={handleBulkSend}>
              <Mail className="mr-2 h-4 w-4" />
              Send Test
            </Button>
            <Button variant="outline" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" size="sm" onClick={handleImport}>
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm" onClick={handleAddTemplate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Template
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
