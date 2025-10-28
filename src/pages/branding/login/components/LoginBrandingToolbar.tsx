"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Filter
} from "lucide-react"
import * as React from "react"
import type { LoginBrandingStatus, LoginBrandingTemplate } from "../types"
import { loginBrandingStatuses, loginBrandingTemplates } from "../types"

export interface FilterState {
  status: LoginBrandingStatus[]
  templates: LoginBrandingTemplate[]
}

interface LoginBrandingToolbarProps {
  filter: string
  setFilter: (value: string) => void
  filters: FilterState
  setFilters: (filters: FilterState) => void
  onCreateNew: () => void
}

export function LoginBrandingToolbar({
  filter,
  setFilter,
  filters,
  setFilters,
  onCreateNew
}: LoginBrandingToolbarProps) {
  const activeFilterCount = filters.status.length + filters.templates.length

  const clearFilters = () => {
    setFilters({
      status: [],
      templates: []
    })
  }

  const handleStatusChange = (status: LoginBrandingStatus, checked: boolean) => {
    if (checked) {
      setFilters({
        ...filters,
        status: [...filters.status, status]
      })
    } else {
      setFilters({
        ...filters,
        status: filters.status.filter(s => s !== status)
      })
    }
  }

  const handleTemplateChange = (template: LoginBrandingTemplate, checked: boolean) => {
    if (checked) {
      setFilters({
        ...filters,
        templates: [...filters.templates, template]
      })
    } else {
      setFilters({
        ...filters,
        templates: filters.templates.filter(t => t !== template)
      })
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <Input
          placeholder="Search login brandings..."
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="w-full sm:w-80"
        />

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
                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <div className="grid grid-cols-2 gap-2">
                  {loginBrandingStatuses.map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={filters.status.includes(status)}
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

              <div className="space-y-2">
                <Label className="text-sm font-medium">Template</Label>
                <div className="grid grid-cols-2 gap-2">
                  {loginBrandingTemplates.map((template) => (
                    <div key={template} className="flex items-center space-x-2">
                      <Checkbox
                        id={`template-${template}`}
                        checked={filters.templates.includes(template)}
                        onCheckedChange={(checked) =>
                          handleTemplateChange(template, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`template-${template}`}
                        className="text-sm capitalize"
                      >
                        {template}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

      </div>

      <div className="flex items-center space-x-2">
        <Button onClick={onCreateNew} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Create Login Branding
        </Button>
      </div>
    </div>
  )
}
