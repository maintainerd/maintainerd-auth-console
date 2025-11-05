import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Plus, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { MOCK_API_KEYS, API_KEY_TYPES } from "../constants"
import type { ApiKey } from "../constants"
import { MOCK_PERMISSIONS } from "../../permissions/constants"

type FormData = {
  name: string
  displayName: string
  description: string
  type: string
  permissions: string[]
  expiresAt: string
  neverExpires: boolean
}

type FormErrors = {
  name?: string
  displayName?: string
  description?: string
  type?: string
  permissions?: string
  expiresAt?: string
}

export default function ApiKeyAddOrUpdateFormPage() {
  const { tenantId, id } = useParams<{ tenantId: string; id: string }>()
  const navigate = useNavigate()
  const isEditing = Boolean(id)
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    displayName: "",
    description: "",
    type: "",
    permissions: [],
    expiresAt: "",
    neverExpires: false
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPermissionSearch, setShowPermissionSearch] = useState(false)
  const [permissionSearchQuery, setPermissionSearchQuery] = useState("")

  // Load existing API key data if editing
  useEffect(() => {
    if (isEditing && id) {
      const existingApiKey = MOCK_API_KEYS.find(key => key.id === id)
      if (existingApiKey) {
        setFormData({
          name: existingApiKey.name,
          displayName: existingApiKey.displayName,
          description: existingApiKey.description,
          type: existingApiKey.type,
          permissions: existingApiKey.permissions,
          expiresAt: existingApiKey.expiresAt ? existingApiKey.expiresAt.split('T')[0] : "",
          neverExpires: !existingApiKey.expiresAt
        })
      }
    }
  }, [isEditing, id])

  // Group permissions by API for better organization
  const permissionsByApi = MOCK_PERMISSIONS.reduce((acc, permission) => {
    if (!acc[permission.apiName]) {
      acc[permission.apiName] = []
    }
    acc[permission.apiName].push(permission)
    return acc
  }, {} as Record<string, typeof MOCK_PERMISSIONS>)

  // Filter permissions based on search query
  const filteredPermissions = MOCK_PERMISSIONS.filter(permission =>
    permission.name.toLowerCase().includes(permissionSearchQuery.toLowerCase()) ||
    permission.description.toLowerCase().includes(permissionSearchQuery.toLowerCase()) ||
    permission.apiName.toLowerCase().includes(permissionSearchQuery.toLowerCase())
  )

  const filteredPermissionsByApi = filteredPermissions.reduce((acc, permission) => {
    if (!acc[permission.apiName]) {
      acc[permission.apiName] = []
    }
    acc[permission.apiName].push(permission)
    return acc
  }, {} as Record<string, typeof MOCK_PERMISSIONS>)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "API key name is required"
    }

    if (!formData.displayName.trim()) {
      newErrors.displayName = "Display name is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.type) {
      newErrors.type = "API key type is required"
    }

    if (formData.permissions.length === 0) {
      newErrors.permissions = "At least one permission is required"
    }

    if (!formData.neverExpires && !formData.expiresAt) {
      newErrors.expiresAt = "Expiration date is required when not set to never expire"
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
      
      // In a real app, you would make an API call here
      console.log("Form submitted:", formData)
      
      // Navigate back to API keys list
      navigate(`/${tenantId}/api-keys`)
    } catch (error) {
      console.error("Error saving API key:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePermissionToggle = (permissionName: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionName)
        ? prev.permissions.filter(p => p !== permissionName)
        : [...prev.permissions, permissionName]
    }))
  }

  const handleRemovePermission = (permissionName: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.filter(p => p !== permissionName)
    }))
  }

  const handleNeverExpiresChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      neverExpires: checked,
      expiresAt: checked ? "" : prev.expiresAt
    }))
  }

  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(`/${tenantId}/api-keys`)}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to API Keys
      </Button>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit API Key" : "Create API Key"}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {isEditing 
              ? "Update the API key configuration and permissions."
              : "Create a new API key with specific permissions for programmatic access."
            }
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">API Key Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., prod-api-key, analytics-service-key"
                    />
                    <p className="text-xs text-muted-foreground">
                      Internal identifier (kebab-case recommended)
                    </p>
                    {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      placeholder="e.g., Production API, Analytics Service"
                    />
                    <p className="text-xs text-muted-foreground">
                      Human-readable name shown in the interface
                    </p>
                    {errors.displayName && <p className="text-sm text-red-600">{errors.displayName}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">API Key Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger className="justify-start">
                      <SelectValue placeholder="Select API key type" />
                    </SelectTrigger>
                    <SelectContent>
                      {API_KEY_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the purpose and usage of this API key"
                    rows={3}
                  />
                  {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                </div>
              </div>

              {/* Expiration */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Expiration</h3>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="never-expires"
                    checked={formData.neverExpires}
                    onCheckedChange={handleNeverExpiresChange}
                  />
                  <Label htmlFor="never-expires">Never expires</Label>
                </div>

                {!formData.neverExpires && (
                  <div className="space-y-2">
                    <Label htmlFor="expiresAt">Expiration Date</Label>
                    <Input
                      id="expiresAt"
                      type="date"
                      value={formData.expiresAt}
                      onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.expiresAt && <p className="text-sm text-red-600">{errors.expiresAt}</p>}
                  </div>
                )}
              </div>

              {/* Permissions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Permissions</h3>
                  <Popover open={showPermissionSearch} onOpenChange={setShowPermissionSearch}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Permissions
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-96 p-0" align="end">
                      <Command>
                        <CommandInput
                          placeholder="Search permissions..."
                          value={permissionSearchQuery}
                          onValueChange={setPermissionSearchQuery}
                        />
                        <CommandList className="max-h-64">
                          <CommandEmpty>No permissions found.</CommandEmpty>
                          {Object.entries(filteredPermissionsByApi).map(([apiName, permissions]) => (
                            <CommandGroup key={apiName} heading={apiName}>
                              {permissions.map((permission) => (
                                <CommandItem
                                  key={permission.name}
                                  onSelect={() => {
                                    handlePermissionToggle(permission.name)
                                  }}
                                  className="flex items-center justify-between"
                                >
                                  <div className="flex-1">
                                    <div className="font-mono text-sm">{permission.name}</div>
                                    <div className="text-xs text-muted-foreground">{permission.description}</div>
                                  </div>
                                  {formData.permissions.includes(permission.name) && (
                                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                                  )}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Selected Permissions */}
                {formData.permissions.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {formData.permissions.length} permission{formData.permissions.length !== 1 ? 's' : ''} selected
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.permissions.map((permissionName) => {
                        const permission = MOCK_PERMISSIONS.find(p => p.name === permissionName)
                        return (
                          <Badge key={permissionName} variant="secondary" className="gap-1">
                            <span className="font-mono text-xs">{permissionName}</span>
                            <button
                              type="button"
                              onClick={() => handleRemovePermission(permissionName)}
                              className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No permissions selected</p>
                )}
                {errors.permissions && <p className="text-sm text-red-600">{errors.permissions}</p>}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div>
                {isEditing && (
                  <Button type="button" variant="destructive" disabled={isLoading}>
                    Delete API Key
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/${tenantId}/api-keys`)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : isEditing ? "Update API Key" : "Create API Key"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
