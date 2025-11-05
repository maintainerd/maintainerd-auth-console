import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Save, Trash2, User, Shield, Mail, Phone, Key, Search, X, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { MOCK_USERS, AVAILABLE_ROLES, USER_STATUSES } from "../constants"
import type { User as UserType, UserStatus } from "../components/UserColumns"

export default function UserAddOrUpdateForm() {
  const { tenantId, userId } = useParams<{ tenantId: string; userId?: string }>()
  const navigate = useNavigate()
  const isEditing = !!userId
  const isCreating = !isEditing

  // Find existing user if editing
  const existingUser = isEditing ? MOCK_USERS.find(u => u.id === userId) : null

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    roles: [] as string[],
    status: "active" as UserStatus,
    emailVerified: false,
    isActive: true,
    twoFactorEnabled: false,
    sendWelcomeEmail: true,
    requirePasswordChange: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [roleSearch, setRoleSearch] = useState("")
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false)

  // Load existing user data when editing
  useEffect(() => {
    if (existingUser) {
      setFormData({
        username: existingUser.username,
        email: existingUser.email,
        phone: existingUser.phone || "",
        roles: existingUser.roles,
        status: existingUser.status,
        emailVerified: existingUser.emailVerified,
        isActive: existingUser.isActive,
        twoFactorEnabled: existingUser.twoFactorEnabled,
        sendWelcomeEmail: false,
        requirePasswordChange: false,
      })
    }
  }, [existingUser])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    } else if (!/^[a-zA-Z0-9._-]+$/.test(formData.username)) {
      newErrors.username = "Username can only contain letters, numbers, dots, underscores, and hyphens"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (formData.roles.length === 0) {
      newErrors.roles = "At least one role must be selected"
    }

    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log(isEditing ? "Update user:" : "Create user:", formData)
      
      // Navigate back to users list
      navigate(`/${tenantId}/users`)
    } catch (error) {
      console.error("Error saving user:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!existingUser || !confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return
    }

    try {
      console.log("Delete user:", existingUser)
      navigate(`/${tenantId}/users`)
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  const addRole = (role: string) => {
    if (!formData.roles.includes(role)) {
      setFormData({ ...formData, roles: [...formData.roles, role] })
    }
    setRoleSearch("")
  }

  const removeRole = (role: string) => {
    setFormData({ ...formData, roles: formData.roles.filter(r => r !== role) })
  }

  // Filter available roles based on search and exclude already selected ones
  const getFilteredAvailableRoles = () => {
    const searchLower = roleSearch.toLowerCase()
    return AVAILABLE_ROLES.filter(role =>
      !formData.roles.includes(role) &&
      role.toLowerCase().includes(searchLower)
    )
  }

  // Check if the current search term is a new role that can be added
  const canAddNewRole = () => {
    const trimmedSearch = roleSearch.trim()
    return trimmedSearch &&
           !formData.roles.includes(trimmedSearch) &&
           !AVAILABLE_ROLES.includes(trimmedSearch)
  }

  return (
    <div className="w-4xl max-w-6xl mx-auto">
      <div className="flex flex-col gap-6">
        {/* Back Button */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/${tenantId}/users`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Button>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {isEditing ? "Edit User" : "Create New User"}
              </h1>
              <p className="text-muted-foreground">
                {isEditing 
                  ? "Update user information and settings"
                  : "Add a new user to the system with roles and permissions"
                }
              </p>
            </div>
          </div>
          {isEditing && existingUser && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete User
            </Button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="e.g., john.doe"
                  />
                  {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g., john.doe@company.com"
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g., +1 (555) 123-4567"
                  />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: UserStatus) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {USER_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Roles & Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Roles & Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Assigned Roles</Label>
                <Popover open={isRoleDropdownOpen} onOpenChange={setIsRoleDropdownOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Search className="mr-2 h-4 w-4" />
                      {formData.roles.length > 0
                        ? `${formData.roles.length} role${formData.roles.length !== 1 ? 's' : ''} selected`
                        : "Search and select roles..."
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="start">
                    <div className="p-3 border-b">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search or type role name..."
                          value={roleSearch}
                          onChange={(e) => setRoleSearch(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {/* Available roles from predefined list */}
                      {getFilteredAvailableRoles().map((role) => (
                        <div
                          key={role}
                          className="flex items-center justify-between px-3 py-2 hover:bg-accent cursor-pointer"
                          onClick={() => addRole(role)}
                        >
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{role}</span>
                          </div>
                          <Plus className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))}

                      {/* Add new role option */}
                      {canAddNewRole() && (
                        <div
                          className="flex items-center justify-between px-3 py-2 hover:bg-accent cursor-pointer border-t"
                          onClick={() => addRole(roleSearch.trim())}
                        >
                          <div className="flex items-center gap-2">
                            <Plus className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Add "{roleSearch.trim()}"</span>
                          </div>
                        </div>
                      )}

                      {/* No results message */}
                      {getFilteredAvailableRoles().length === 0 && !canAddNewRole() && roleSearch && (
                        <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                          No roles found
                        </div>
                      )}

                      {/* Initial state message */}
                      {!roleSearch && getFilteredAvailableRoles().length === 0 && (
                        <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                          All available roles are already selected
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
                {errors.roles && <p className="text-sm text-destructive">{errors.roles}</p>}
              </div>

              {/* Selected Roles Display */}
              {formData.roles.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Roles ({formData.roles.length})</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.roles.map((role) => (
                      <Badge key={role} variant="secondary" className="text-xs gap-1">
                        <Shield className="h-3 w-3" />
                        {role}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 ml-1 hover:bg-transparent"
                          onClick={() => removeRole(role)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Verified</Label>
                  <p className="text-sm text-muted-foreground">
                    Mark the user's email as verified
                  </p>
                </div>
                <Switch
                  checked={formData.emailVerified}
                  onCheckedChange={(checked) => setFormData({ ...formData, emailVerified: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Account Active</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow the user to sign in and access the system
                  </p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable 2FA for enhanced security
                  </p>
                </div>
                <Switch
                  checked={formData.twoFactorEnabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, twoFactorEnabled: checked })}
                />
              </div>

              {isCreating && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Send Welcome Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Send a welcome email with login instructions
                      </p>
                    </div>
                    <Switch
                      checked={formData.sendWelcomeEmail}
                      onCheckedChange={(checked) => setFormData({ ...formData, sendWelcomeEmail: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Password Change</Label>
                      <p className="text-sm text-muted-foreground">
                        Force user to change password on first login
                      </p>
                    </div>
                    <Switch
                      checked={formData.requirePasswordChange}
                      onCheckedChange={(checked) => setFormData({ ...formData, requirePasswordChange: checked })}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/${tenantId}/users`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              <Save className="h-4 w-4" />
              {isSubmitting ? "Saving..." : isEditing ? "Update User" : "Create User"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
