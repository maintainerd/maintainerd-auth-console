import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Save, Trash2, Shield, Key, Plus, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { MOCK_ROLES, AVAILABLE_PERMISSIONS, PERMISSION_CATEGORIES } from "../constants"
import type { Role } from "../components/RoleColumns"

export default function RoleAddOrUpdateForm() {
  const { tenantId, roleId } = useParams<{ tenantId: string; roleId?: string }>()
  const navigate = useNavigate()
  const isEditing = !!roleId
  const isCreating = !isEditing

  // Find existing role if editing
  const existingRole = isEditing ? MOCK_ROLES.find(r => r.id === roleId) : null

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    description: "",
    isActive: true,
  })

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [permissionSearchOpen, setPermissionSearchOpen] = useState(false)

  // Load existing role data if editing
  useEffect(() => {
    if (isEditing && existingRole) {
      setFormData({
        name: existingRole.name,
        displayName: existingRole.displayName,
        description: existingRole.description,
        isActive: existingRole.isActive,
      })
      setSelectedPermissions(existingRole.permissions)
    }
  }, [isEditing, existingRole])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Role name is required"
    } else if (formData.name.length < 2) {
      newErrors.name = "Role name must be at least 2 characters"
    } else if (!/^[a-z0-9-_]+$/.test(formData.name)) {
      newErrors.name = "Role name must contain only lowercase letters, numbers, hyphens, and underscores"
    }

    if (!formData.displayName.trim()) {
      newErrors.displayName = "Display name is required"
    } else if (formData.displayName.length < 2) {
      newErrors.displayName = "Display name must be at least 2 characters"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Role description is required"
    } else if (formData.description.length < 10) {
      newErrors.description = "Role description must be at least 10 characters"
    }

    if (selectedPermissions.length === 0) {
      newErrors.permissions = "At least one permission must be selected"
    }

    // Check for duplicate role name (excluding current role if editing)
    const duplicateRole = MOCK_ROLES.find(r =>
      r.name.toLowerCase() === formData.name.toLowerCase() &&
      (!isEditing || r.id !== roleId)
    )
    if (duplicateRole) {
      newErrors.name = "A role with this name already exists"
    }

    // Check for duplicate display name (excluding current role if editing)
    const duplicateDisplayName = MOCK_ROLES.find(r =>
      r.displayName.toLowerCase() === formData.displayName.toLowerCase() &&
      (!isEditing || r.id !== roleId)
    )
    if (duplicateDisplayName) {
      newErrors.displayName = "A role with this display name already exists"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const roleData = {
        ...formData,
        permissions: selectedPermissions,
      }
      
      if (isCreating) {
        console.log("Creating role:", roleData)
      } else {
        console.log("Updating role:", roleId, roleData)
      }
      
      // Navigate back to roles list
      navigate(`/${tenantId}/roles`)
    } catch (error) {
      console.error("Error saving role:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this role? This action cannot be undone and will remove the role from all users.")) {
      return
    }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log("Deleting role:", roleId)
      navigate(`/${tenantId}/roles`)
    } catch (error) {
      console.error("Error deleting role:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePermissionAdd = (permission: string) => {
    if (!selectedPermissions.includes(permission)) {
      setSelectedPermissions(prev => [...prev, permission])
    }
    setPermissionSearchOpen(false)
  }

  const handlePermissionRemove = (permission: string) => {
    setSelectedPermissions(prev => prev.filter(p => p !== permission))
  }



  const pageTitle = isCreating ? "Create Role" : `Edit ${existingRole?.displayName || "Role"}`
  const submitButtonText = isCreating ? "Create Role" : "Update Role"

  if (isEditing && !existingRole) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Role Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The role you're trying to edit doesn't exist or has been removed.
          </p>
        </div>
        <Button onClick={() => navigate(`/${tenantId}/roles`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Roles
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-6">
        {/* Back Button */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/${tenantId}/roles`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Roles
          </Button>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{pageTitle}</h1>
          <p className="text-muted-foreground mt-1">
            {isCreating 
              ? "Create a new role with specific permissions to control what users can access and do."
              : "Update the role configuration and permissions."
            }
          </p>
        </div>

        {/* System Role Warning */}
        {isEditing && existingRole?.isSystem && (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              This is a system role and cannot be modified. System roles are essential for the application to function properly.
            </AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Role Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., manager, developer, viewer"
                    disabled={existingRole?.isSystem}
                  />
                  <p className="text-xs text-muted-foreground">
                    Internal role identifier (lowercase, numbers, hyphens, underscores only)
                  </p>
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    placeholder="e.g., Team Manager, Developer, Read-Only Viewer"
                    disabled={existingRole?.isSystem}
                  />
                  <p className="text-xs text-muted-foreground">
                    User-friendly name shown in the interface
                  </p>
                  {errors.displayName && <p className="text-sm text-destructive">{errors.displayName}</p>}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what this role is for and what access it provides..."
                    rows={3}
                    disabled={existingRole?.isSystem}
                  />
                  <p className="text-xs text-muted-foreground">
                    Help users understand what this role is for
                  </p>
                  {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="status"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                      disabled={existingRole?.isSystem}
                    />
                    <Label htmlFor="status" className="text-sm">
                      {formData.isActive ? "Active" : "Inactive"}
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Inactive roles cannot be assigned to users
                  </p>
                </div>
              </div>


            </CardContent>
          </Card>

          {/* Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Permissions
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Select the permissions that users with this role should have
              </p>
            </CardHeader>
            <CardContent>
              {errors.permissions && (
                <Alert className="mb-4">
                  <AlertDescription>{errors.permissions}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                {/* Permission Search Dropdown */}
                <div>
                  <Label htmlFor="permission-search" className="text-sm font-medium">
                    Add Permissions
                  </Label>
                  <Popover open={permissionSearchOpen} onOpenChange={setPermissionSearchOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={permissionSearchOpen}
                        className="w-full justify-between mt-2"
                        disabled={existingRole?.isSystem}
                      >
                        <div className="flex items-center gap-2">
                          <Search className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Search and select permissions...</span>
                        </div>
                        <Plus className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search permissions..." />
                        <CommandList>
                          <CommandEmpty>No permissions found.</CommandEmpty>
                          {Object.entries(PERMISSION_CATEGORIES).map(([category, categoryPermissions]) => (
                            <CommandGroup key={category} heading={category}>
                              {categoryPermissions
                                .filter(permission => !selectedPermissions.includes(permission))
                                .map((permission) => (
                                  <CommandItem
                                    key={permission}
                                    value={permission}
                                    onSelect={() => handlePermissionAdd(permission)}
                                    className="cursor-pointer"
                                  >
                                    <Key className="mr-2 h-4 w-4" />
                                    <span className="font-mono">{permission}</span>
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Selected Permissions List */}
                {selectedPermissions.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">
                      Selected Permissions ({selectedPermissions.length})
                    </Label>
                    <div className="mt-2 space-y-2 max-h-60 overflow-y-auto border rounded-md p-3">
                      {selectedPermissions.map((permission) => (
                        <div key={permission} className="flex items-center justify-between p-2 bg-muted rounded-md">
                          <div className="flex items-center gap-2">
                            <Key className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono text-sm">{permission}</span>
                          </div>
                          {!existingRole?.isSystem && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePermissionRemove(permission)}
                              className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div>
              {isEditing && !existingRole?.isSystem && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Role
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/${tenantId}/roles`)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || existingRole?.isSystem}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {isLoading ? "Saving..." : submitButtonText}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
