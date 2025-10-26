import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Download,
  Upload,
  Filter,
  MoreHorizontal,
  UserPlus,
  Mail,
  Trash2,
  X
} from "lucide-react"
import * as React from "react"
import { USER_STATUSES } from "../constants"

export interface FilterState {
  status: string[]
  roles: string[]
  roleSearch: string
  emailVerified: string
  twoFactorEnabled: string
  hasLoginAttempts: boolean
}

interface UserToolbarProps {
  filter: string
  setFilter: (value: string) => void
  selectedCount?: number
  onFiltersChange?: (filters: FilterState) => void
  availableRoles?: string[]
}

export function UserToolbar({ filter, setFilter, selectedCount = 0, onFiltersChange, availableRoles = [] }: UserToolbarProps) {
  const [filters, setFilters] = React.useState<FilterState>({
    status: [],
    roles: [],
    roleSearch: "",
    emailVerified: "all",
    twoFactorEnabled: "all",
    hasLoginAttempts: false
  })

  const [isFilterOpen, setIsFilterOpen] = React.useState(false)
  const handleAddUser = () => {
    console.log("Add new user")
  }

  const handleBulkInvite = () => {
    console.log("Bulk invite users")
  }

  const handleExport = () => {
    console.log("Export users")
  }

  const handleImport = () => {
    console.log("Import users")
  }

  const handleBulkDelete = () => {
    console.log("Bulk delete selected users")
  }

  const handleBulkEmail = () => {
    console.log("Send bulk email to selected users")
  }

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFiltersChange?.(updatedFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      status: [],
      roles: [],
      roleSearch: "",
      emailVerified: "all",
      twoFactorEnabled: "all",
      hasLoginAttempts: false
    }
    setFilters(clearedFilters)
    onFiltersChange?.(clearedFilters)
  }

  const hasActiveFilters = filters.status.length > 0 ||
    filters.roles.length > 0 ||
    filters.roleSearch.trim() !== "" ||
    filters.emailVerified !== "all" ||
    filters.twoFactorEnabled !== "all" ||
    filters.hasLoginAttempts

  const activeFilterCount = [
    filters.status.length > 0,
    filters.roles.length > 0,
    filters.roleSearch.trim() !== "",
    filters.emailVerified !== "all",
    filters.twoFactorEnabled !== "all",
    filters.hasLoginAttempts
  ].filter(Boolean).length

  // Filter available roles based on search
  const filteredAvailableRoles = React.useMemo(() => {
    if (!filters.roleSearch.trim()) return availableRoles
    return availableRoles.filter(role =>
      role.toLowerCase().includes(filters.roleSearch.toLowerCase())
    )
  }, [availableRoles, filters.roleSearch])

  // Add role to selected roles
  const addRole = (role: string) => {
    if (!filters.roles.includes(role)) {
      updateFilters({ roles: [...filters.roles, role] })
    }
  }

  // Remove role from selected roles
  const removeRole = (role: string) => {
    updateFilters({ roles: filters.roles.filter(r => r !== role) })
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <Input
          placeholder="Search users by name, email, phone, or roles..."
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
                <h4 className="font-medium">Advanced Filters</h4>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                )}
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <div className="grid grid-cols-2 gap-2">
                  {USER_STATUSES.map((status) => (
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

              {/* Roles Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Roles</Label>

                {/* Role Search Input */}
                <div className="space-y-2">
                  <Input
                    placeholder="Search or type role name..."
                    value={filters.roleSearch}
                    onChange={(e) => updateFilters({ roleSearch: e.target.value })}
                    className="text-sm"
                  />

                  {/* Add role button if search has value and not already selected */}
                  {filters.roleSearch.trim() && !filters.roles.includes(filters.roleSearch.trim()) && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => addRole(filters.roleSearch.trim())}
                    >
                      Add "{filters.roleSearch.trim()}"
                    </Button>
                  )}
                </div>

                {/* Selected Roles */}
                {filters.roles.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Selected roles:</Label>
                    <div className="flex flex-wrap gap-1">
                      {filters.roles.map((role) => (
                        <Badge
                          key={role}
                          variant="secondary"
                          className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeRole(role)}
                        >
                          {role}
                          <X className="ml-1 h-3 w-3" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Available Roles from Data */}
                {availableRoles.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Available roles:</Label>
                    <div className="grid grid-cols-2 gap-1 max-h-24 overflow-y-auto">
                      {filteredAvailableRoles.slice(0, 8).map((role) => (
                        <Button
                          key={role}
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs justify-start"
                          onClick={() => addRole(role)}
                          disabled={filters.roles.includes(role)}
                        >
                          {role}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Email Verification Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Email Verification</Label>
                <Select value={filters.emailVerified} onValueChange={(value) => updateFilters({ emailVerified: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="verified">Verified Only</SelectItem>
                    <SelectItem value="unverified">Unverified Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 2FA Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                <Select value={filters.twoFactorEnabled} onValueChange={(value) => updateFilters({ twoFactorEnabled: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="enabled">2FA Enabled</SelectItem>
                    <SelectItem value="disabled">2FA Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Login Attempts Filter */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="login-attempts"
                  checked={filters.hasLoginAttempts}
                  onCheckedChange={(checked) => updateFilters({ hasLoginAttempts: !!checked })}
                />
                <Label htmlFor="login-attempts" className="text-sm">
                  Show users with failed login attempts
                </Label>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {selectedCount > 0 && (
          <>
            <span className="text-sm text-muted-foreground">
              {selectedCount} selected
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleBulkEmail}>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleBulkDelete} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExport}>
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExport}>
              Export as Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" size="sm" onClick={handleImport}>
          <Upload className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Import</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Add User</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleAddUser}>
              <UserPlus className="mr-2 h-4 w-4" />
              Create New User
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleBulkInvite}>
              <Mail className="mr-2 h-4 w-4" />
              Invite Users
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
