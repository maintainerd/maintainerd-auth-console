import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Save, X, Plus, Trash2, Monitor, Smartphone, Globe, Cog, Search, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MOCK_CLIENTS, CLIENT_TYPES, CLIENT_STATUSES, type FieldMapping } from "../constants"
import { AVAILABLE_PROVIDERS, COMMON_FIELD_MAPPINGS, STANDARD_FIELDS, FIELD_TYPE_OPTIONS, TRANSFORM_OPTIONS, type Provider } from "../providers"
import type { ClientType, ClientStatus } from "../constants"

const CLIENT_TYPE_OPTIONS = [
  { value: "spa", label: "Single Page Application", description: "JavaScript apps running in browsers", icon: Monitor },
  { value: "regular", label: "Regular Web Application", description: "Server-side web applications", icon: Globe },
  { value: "native", label: "Native Mobile Application", description: "Mobile and desktop applications", icon: Smartphone },
  { value: "m2m", label: "Machine to Machine", description: "APIs and backend services", icon: Cog }
]

const COMMON_GRANT_TYPES = [
  "authorization_code",
  "refresh_token", 
  "client_credentials",
  "implicit",
  "password"
]

// Comprehensive scope dataset representing thousands of permissions from multiple services
const AVAILABLE_SCOPES = [
  // OpenID Connect Standard Scopes
  { scope: "openid", category: "OpenID Connect", description: "Required for OpenID Connect authentication" },
  { scope: "profile", category: "OpenID Connect", description: "Access to user profile information" },
  { scope: "email", category: "OpenID Connect", description: "Access to user email address" },
  { scope: "offline_access", category: "OpenID Connect", description: "Ability to get refresh tokens" },

  // User Management Service
  { scope: "read:users", category: "User Management", description: "View user profiles and information" },
  { scope: "write:users", category: "User Management", description: "Create and update user accounts" },
  { scope: "delete:users", category: "User Management", description: "Remove user accounts" },
  { scope: "read:user-sessions", category: "User Management", description: "View user session information" },
  { scope: "manage:user-sessions", category: "User Management", description: "Terminate user sessions" },
  { scope: "read:user-preferences", category: "User Management", description: "Access user preferences and settings" },
  { scope: "write:user-preferences", category: "User Management", description: "Update user preferences and settings" },

  // Authentication & Authorization Service
  { scope: "read:clients", category: "Auth Service", description: "View OAuth client configurations" },
  { scope: "write:clients", category: "Auth Service", description: "Manage OAuth client configurations" },
  { scope: "delete:clients", category: "Auth Service", description: "Remove OAuth clients" },
  { scope: "read:roles", category: "Auth Service", description: "View user roles and permissions" },
  { scope: "write:roles", category: "Auth Service", description: "Create and modify user roles" },
  { scope: "delete:roles", category: "Auth Service", description: "Remove user roles" },
  { scope: "read:permissions", category: "Auth Service", description: "View permission definitions" },
  { scope: "write:permissions", category: "Auth Service", description: "Create and modify permissions" },
  { scope: "read:identity-providers", category: "Auth Service", description: "View identity provider configurations" },
  { scope: "write:identity-providers", category: "Auth Service", description: "Manage identity provider configurations" },

  // API Gateway Service
  { scope: "read:apis", category: "API Gateway", description: "View API definitions and configurations" },
  { scope: "write:apis", category: "API Gateway", description: "Create and modify API configurations" },
  { scope: "delete:apis", category: "API Gateway", description: "Remove API configurations" },
  { scope: "read:api-keys", category: "API Gateway", description: "View API key information" },
  { scope: "write:api-keys", category: "API Gateway", description: "Generate and manage API keys" },
  { scope: "delete:api-keys", category: "API Gateway", description: "Revoke API keys" },
  { scope: "read:rate-limits", category: "API Gateway", description: "View rate limiting configurations" },
  { scope: "write:rate-limits", category: "API Gateway", description: "Configure rate limiting rules" },

  // Policy Management Service
  { scope: "read:policies", category: "Policy Management", description: "View security and access policies" },
  { scope: "write:policies", category: "Policy Management", description: "Create and modify policies" },
  { scope: "delete:policies", category: "Policy Management", description: "Remove policies" },
  { scope: "apply:policies", category: "Policy Management", description: "Apply policies to resources" },
  { scope: "read:policy-violations", category: "Policy Management", description: "View policy violation reports" },

  // Service Registry
  { scope: "read:services", category: "Service Registry", description: "View registered services" },
  { scope: "write:services", category: "Service Registry", description: "Register and update services" },
  { scope: "delete:services", category: "Service Registry", description: "Unregister services" },
  { scope: "read:service-health", category: "Service Registry", description: "View service health status" },
  { scope: "read:service-metrics", category: "Service Registry", description: "Access service performance metrics" },

  // Audit & Logging Service
  { scope: "read:audit-logs", category: "Audit & Logging", description: "View system audit logs" },
  { scope: "read:access-logs", category: "Audit & Logging", description: "View access and authentication logs" },
  { scope: "read:error-logs", category: "Audit & Logging", description: "View application error logs" },
  { scope: "write:audit-logs", category: "Audit & Logging", description: "Create custom audit log entries" },
  { scope: "export:logs", category: "Audit & Logging", description: "Export log data" },

  // Notification Service
  { scope: "read:notifications", category: "Notification Service", description: "View notification configurations" },
  { scope: "write:notifications", category: "Notification Service", description: "Create and send notifications" },
  { scope: "read:notification-templates", category: "Notification Service", description: "View notification templates" },
  { scope: "write:notification-templates", category: "Notification Service", description: "Create and modify notification templates" },

  // Analytics Service
  { scope: "read:analytics", category: "Analytics Service", description: "View analytics data and reports" },
  { scope: "read:usage-metrics", category: "Analytics Service", description: "Access usage statistics" },
  { scope: "read:performance-metrics", category: "Analytics Service", description: "View performance analytics" },
  { scope: "export:analytics", category: "Analytics Service", description: "Export analytics data" },

  // Configuration Management
  { scope: "read:config", category: "Configuration", description: "View system configuration" },
  { scope: "write:config", category: "Configuration", description: "Modify system configuration" },
  { scope: "read:secrets", category: "Configuration", description: "Access secret management" },
  { scope: "write:secrets", category: "Configuration", description: "Manage secrets and credentials" },

  // System Administration
  { scope: "admin:system", category: "System Admin", description: "Full system administration access" },
  { scope: "admin:users", category: "System Admin", description: "User administration privileges" },
  { scope: "admin:services", category: "System Admin", description: "Service administration privileges" },
  { scope: "admin:security", category: "System Admin", description: "Security administration privileges" },
  { scope: "manage:backups", category: "System Admin", description: "Backup and restore operations" },
  { scope: "manage:maintenance", category: "System Admin", description: "System maintenance operations" }
]

// Default scopes for different client types
const DEFAULT_SCOPES_BY_TYPE = {
  spa: ["openid", "profile", "email"],
  regular: ["openid", "profile", "email", "read:users"],
  native: ["openid", "profile", "email", "offline_access"],
  m2m: ["read:services", "read:apis"]
}

export default function ClientAddOrUpdateForm() {
  const { tenantId, clientId } = useParams<{ tenantId: string; clientId?: string }>()
  const navigate = useNavigate()
  
  const isEditing = Boolean(clientId)
  const isCreating = !isEditing
  const existingClient = isEditing ? MOCK_CLIENTS.find(c => c.id === clientId) : null

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "" as ClientType,
    status: "active" as ClientStatus,
    providerId: "",
    redirectUris: [""],
    allowedOrigins: [""],
    grantTypes: ["authorization_code", "refresh_token"],
    scopes: [] as string[],
    tokenLifetime: 3600,
    refreshTokenLifetime: 604800,
    fieldMappings: [] as FieldMapping[],
    customFields: {} as Record<string, string>
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [scopeSearchOpen, setScopeSearchOpen] = useState(false)
  const [scopeSearchValue, setScopeSearchValue] = useState("")

  // Load existing client data when editing
  useEffect(() => {
    if (existingClient) {
      setFormData({
        name: existingClient.name,
        description: existingClient.description,
        type: existingClient.type,
        status: existingClient.status,
        providerId: existingClient.providerId,
        redirectUris: existingClient.redirectUris.length > 0 ? existingClient.redirectUris : [""],
        allowedOrigins: existingClient.allowedOrigins.length > 0 ? existingClient.allowedOrigins : [""],
        grantTypes: existingClient.grantTypes,
        scopes: existingClient.scopes,
        tokenLifetime: existingClient.tokenLifetime,
        refreshTokenLifetime: existingClient.refreshTokenLifetime,
        fieldMappings: (existingClient.fieldMappings || []).map(mapping => ({
          ...mapping,
          id: mapping.id || `mapping-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        })),
        customFields: existingClient.customFields || {}
      })
    }
  }, [existingClient])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Client name is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.type) {
      newErrors.type = "Client type is required"
    }

    if (!formData.providerId) {
      newErrors.providerId = "Provider is required"
    }

    if (formData.redirectUris.filter(uri => uri.trim()).length === 0) {
      newErrors.redirectUris = "At least one redirect URI is required"
    }

    if (formData.grantTypes.length === 0) {
      newErrors.grantTypes = "At least one grant type is required"
    }

    if (formData.scopes.length === 0) {
      newErrors.scopes = "At least one scope is required"
    }

    if (formData.tokenLifetime < 300 || formData.tokenLifetime > 86400) {
      newErrors.tokenLifetime = "Token lifetime must be between 5 minutes and 24 hours"
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
      
      console.log("Saving client:", formData)
      
      // Navigate back to clients list or client details
      if (isCreating) {
        navigate(`/${tenantId}/clients`)
      } else {
        navigate(`/${tenantId}/clients/${clientId}`)
      }
    } catch (error) {
      console.error("Error saving client:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (isEditing) {
      navigate(`/${tenantId}/clients/${clientId}`)
    } else {
      navigate(`/${tenantId}/clients`)
    }
  }

  const addArrayField = (field: 'redirectUris' | 'allowedOrigins') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }))
  }

  const removeArrayField = (field: 'redirectUris' | 'allowedOrigins', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const updateArrayField = (field: 'redirectUris' | 'allowedOrigins', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const toggleGrantType = (grantType: string) => {
    setFormData(prev => ({
      ...prev,
      grantTypes: prev.grantTypes.includes(grantType)
        ? prev.grantTypes.filter(gt => gt !== grantType)
        : [...prev.grantTypes, grantType]
    }))
  }

  const toggleScope = (scope: string) => {
    setFormData(prev => ({
      ...prev,
      scopes: prev.scopes.includes(scope)
        ? prev.scopes.filter(s => s !== scope)
        : [...prev.scopes, scope]
    }))
  }

  const addScope = (scope: string) => {
    if (!formData.scopes.includes(scope)) {
      setFormData(prev => ({
        ...prev,
        scopes: [...prev.scopes, scope]
      }))
    }
    setScopeSearchOpen(false)
    setScopeSearchValue("")
  }

  const removeScope = (scope: string) => {
    setFormData(prev => ({
      ...prev,
      scopes: prev.scopes.filter(s => s !== scope)
    }))
  }

  const handleClientTypeChange = (newType: ClientType) => {
    const defaultScopes = DEFAULT_SCOPES_BY_TYPE[newType] || ["openid", "profile", "email"]
    setFormData(prev => ({
      ...prev,
      type: newType,
      scopes: defaultScopes
    }))
  }

  // Filter available scopes based on search
  const filteredScopes = AVAILABLE_SCOPES.filter(item =>
    !formData.scopes.includes(item.scope) && (
      item.scope.toLowerCase().includes(scopeSearchValue.toLowerCase()) ||
      item.category.toLowerCase().includes(scopeSearchValue.toLowerCase()) ||
      item.description.toLowerCase().includes(scopeSearchValue.toLowerCase())
    )
  )

  // Group scopes by category for display
  const scopesByCategory = formData.scopes.reduce((acc, scope) => {
    const scopeInfo = AVAILABLE_SCOPES.find(s => s.scope === scope)
    const category = scopeInfo?.category || "Other"
    if (!acc[category]) acc[category] = []
    acc[category].push(scope)
    return acc
  }, {} as Record<string, string[]>)

  // Attribute mapping management
  const [showFieldMappingForm, setShowFieldMappingForm] = useState(false)
  const [editingMappingIndex, setEditingMappingIndex] = useState<number | null>(null)
  const [currentMapping, setCurrentMapping] = useState<FieldMapping>({
    id: "",
    fieldType: "standard",
    externalField: "",
    required: false,
    category: "user"
  })

  const resetMappingForm = () => {
    setCurrentMapping({
      id: "",
      fieldType: "standard",
      externalField: "",
      required: false,
      category: "user"
    })
    setEditingMappingIndex(null)
    setShowFieldMappingForm(false)
  }

  const handleAddMapping = () => {
    resetMappingForm()
    setShowFieldMappingForm(true)
  }

  const handleEditMapping = (index: number) => {
    const mapping = formData.fieldMappings[index]
    setCurrentMapping({
      id: mapping.id || "",
      fieldType: mapping.fieldType,
      localField: mapping.localField,
      customFieldName: mapping.customFieldName,
      externalField: mapping.externalField,
      required: mapping.required,
      transform: mapping.transform,
      category: mapping.category
    })
    setEditingMappingIndex(index)
    setShowFieldMappingForm(true)
  }

  const handleSaveMapping = () => {
    const mappingWithId = {
      ...currentMapping,
      id: currentMapping.id || `mapping-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }

    if (editingMappingIndex !== null) {
      // Update existing mapping
      setFormData(prev => ({
        ...prev,
        fieldMappings: prev.fieldMappings.map((mapping, i) =>
          i === editingMappingIndex ? mappingWithId : mapping
        )
      }))
    } else {
      // Add new mapping
      setFormData(prev => ({
        ...prev,
        fieldMappings: [...prev.fieldMappings, mappingWithId]
      }))
    }
    resetMappingForm()
  }

  const handleRemoveMapping = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fieldMappings: prev.fieldMappings.filter((_, i) => i !== index)
    }))
  }

  const updateCurrentMapping = (field: keyof FieldMapping, value: string | boolean) => {
    setCurrentMapping(prev => {
      const updated = { ...prev, [field]: value }

      // Handle field type changes
      if (field === "fieldType") {
        if (value === "standard") {
          delete updated.customFieldName
          updated.category = "user"
        } else if (value === "custom") {
          delete updated.localField
          updated.category = "custom"
        }
      }

      // Handle local field changes
      if (field === "localField") {
        const selectedField = STANDARD_FIELDS.find(f => f.value === value)
        if (selectedField) {
          updated.category = selectedField.category
        }
      }

      return updated
    })
  }

  const handleProviderChange = (providerId: string) => {
    const selectedProvider = AVAILABLE_PROVIDERS.find(p => p.id === providerId)
    if (selectedProvider) {
      const commonMappings = COMMON_FIELD_MAPPINGS[selectedProvider.type as keyof typeof COMMON_FIELD_MAPPINGS] || []
      const mappingsWithIds = commonMappings.map(mapping => ({
        ...mapping,
        id: `mapping-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }))
      setFormData(prev => ({
        ...prev,
        providerId,
        fieldMappings: mappingsWithIds
      }))
    }
  }

  // Get selected provider info
  const selectedProvider = AVAILABLE_PROVIDERS.find(p => p.id === formData.providerId)
  const isExternalProvider = selectedProvider && !selectedProvider.isDefault

  const selectedClientType = CLIENT_TYPE_OPTIONS.find(option => option.value === formData.type)
  const ClientTypeIcon = selectedClientType?.icon || Monitor

  return (
    <div className="container mx-auto max-w-4xl space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={handleCancel}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {isEditing ? 'Client Details' : 'Clients'}
      </Button>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {isEditing ? 'Edit Client' : 'Create New Client'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditing
              ? 'Update client configuration and settings'
              : 'Configure a new OAuth client for your application'
            }
          </p>
        </div>
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <p className="text-sm text-muted-foreground">
              Basic client details and identification
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Client Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Web Dashboard, Mobile App"
                  disabled={existingClient?.isDefault || isLoading}
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Client Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={handleClientTypeChange}
                  disabled={existingClient?.isDefault || isLoading}
                >
                  <SelectTrigger className="justify-start">
                    <SelectValue placeholder="Select client type">
                      {formData.type && (() => {
                        const selectedOption = CLIENT_TYPE_OPTIONS.find(option => option.value === formData.type)
                        if (selectedOption) {
                          const Icon = selectedOption.icon
                          return (
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              <span>{selectedOption.label}</span>
                            </div>
                          )
                        }
                        return null
                      })()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {CLIENT_TYPE_OPTIONS.map((option) => {
                      const Icon = option.icon
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <div className="text-left">
                              <div className="font-medium">{option.label}</div>
                              <div className="text-xs text-muted-foreground">{option.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the purpose and functionality of this client"
                disabled={isLoading}
              />
              {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="provider">Provider *</Label>
                <Select
                  value={formData.providerId}
                  onValueChange={handleProviderChange}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Identity Providers</SelectLabel>
                      {AVAILABLE_PROVIDERS.filter(p => p.category === "identity").map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          <div className="flex items-center gap-2">
                            <span>{provider.displayName}</span>
                            {provider.isDefault && (
                              <Badge variant="secondary" className="text-xs">System</Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Social Providers</SelectLabel>
                      {AVAILABLE_PROVIDERS.filter(p => p.category === "social").map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.displayName}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.providerId && <p className="text-sm text-red-600">{errors.providerId}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: ClientStatus) => setFormData(prev => ({ ...prev, status: value }))}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* OAuth Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClientTypeIcon className="h-5 w-5" />
              OAuth Configuration
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Configure OAuth 2.0 and OpenID Connect settings for this {selectedClientType?.label.toLowerCase()}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Redirect URIs */}
            <div className="space-y-2">
              <Label>Redirect URIs *</Label>
              <p className="text-xs text-muted-foreground">
                URLs where users will be redirected after authentication
              </p>
              {formData.redirectUris.map((uri, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={uri}
                    onChange={(e) => updateArrayField('redirectUris', index, e.target.value)}
                    placeholder="https://your-app.com/callback"
                    disabled={isLoading}
                  />
                  {formData.redirectUris.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayField('redirectUris', index)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayField('redirectUris')}
                disabled={isLoading}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Redirect URI
              </Button>
              {errors.redirectUris && <p className="text-sm text-red-600">{errors.redirectUris}</p>}
            </div>

            {/* Allowed Origins */}
            <div className="space-y-2">
              <Label>Allowed Origins</Label>
              <p className="text-xs text-muted-foreground">
                Origins allowed to make requests to this client (CORS)
              </p>
              {formData.allowedOrigins.map((origin, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={origin}
                    onChange={(e) => updateArrayField('allowedOrigins', index, e.target.value)}
                    placeholder="https://your-app.com"
                    disabled={isLoading}
                  />
                  {formData.allowedOrigins.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayField('allowedOrigins', index)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayField('allowedOrigins')}
                disabled={isLoading}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Origin
              </Button>
            </div>

            {/* Grant Types */}
            <div className="space-y-2">
              <Label>Grant Types *</Label>
              <p className="text-xs text-muted-foreground">
                OAuth 2.0 grant types this client is allowed to use
              </p>
              <div className="flex flex-wrap gap-2">
                {COMMON_GRANT_TYPES.map((grantType) => (
                  <Badge
                    key={grantType}
                    variant={formData.grantTypes.includes(grantType) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleGrantType(grantType)}
                  >
                    {grantType}
                  </Badge>
                ))}
              </div>
              {errors.grantTypes && <p className="text-sm text-red-600">{errors.grantTypes}</p>}
            </div>

            {/* Scopes */}
            <div className="space-y-4">
              <div>
                <Label>Scopes *</Label>
                <p className="text-xs text-muted-foreground">
                  OAuth 2.0 scopes define the permissions this client can request. Search and select from thousands of available permissions.
                </p>
              </div>

              {/* Add Scope Dropdown */}
              <div className="space-y-2">
                <Popover open={scopeSearchOpen} onOpenChange={setScopeSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={scopeSearchOpen}
                      className="w-full justify-between"
                      disabled={isLoading}
                    >
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        Search and add scopes...
                      </div>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Search scopes by name, category, or description..."
                        value={scopeSearchValue}
                        onValueChange={setScopeSearchValue}
                      />
                      <CommandList>
                        <CommandEmpty>No scopes found.</CommandEmpty>
                        {Object.entries(
                          filteredScopes.reduce((acc, scope) => {
                            if (!acc[scope.category]) acc[scope.category] = []
                            acc[scope.category].push(scope)
                            return acc
                          }, {} as Record<string, typeof filteredScopes>)
                        ).map(([category, scopes]) => (
                          <CommandGroup key={category} heading={category}>
                            {scopes.map((scopeInfo) => (
                              <CommandItem
                                key={scopeInfo.scope}
                                value={`${scopeInfo.scope} ${scopeInfo.category} ${scopeInfo.description}`}
                                onSelect={() => addScope(scopeInfo.scope)}
                                className="flex flex-col items-start gap-1 p-3"
                              >
                                <div className="flex items-center gap-2 w-full">
                                  <code className="text-sm font-mono bg-muted px-1.5 py-0.5 rounded">
                                    {scopeInfo.scope}
                                  </code>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {scopeInfo.description}
                                </p>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        ))}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Selected Scopes */}
              {formData.scopes.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Selected Scopes ({formData.scopes.length})</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, scopes: [] }))}
                      disabled={isLoading}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Clear All
                    </Button>
                  </div>

                  {Object.entries(scopesByCategory).map(([category, scopes]) => (
                    <div key={category} className="space-y-2">
                      <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {category}
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {scopes.map((scope) => {
                          const scopeInfo = AVAILABLE_SCOPES.find(s => s.scope === scope)
                          return (
                            <Badge
                              key={scope}
                              variant="default"
                              className="gap-1 pr-1"
                            >
                              <span className="font-mono text-xs">{scope}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeScope(scope)}
                                disabled={isLoading}
                                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {errors.scopes && <p className="text-sm text-red-600">{errors.scopes}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Attribute Mapping Configuration */}
        {isExternalProvider && (
          <Card>
            <CardHeader>
              <CardTitle>Attribute Mapping</CardTitle>
              <p className="text-sm text-muted-foreground">
                Map external provider attributes to local user fields. This is required for external providers like {selectedProvider?.displayName}.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing Attribute Mappings */}
              {formData.fieldMappings.length > 0 && (
                <div className="space-y-3">
                  {formData.fieldMappings.map((mapping, index) => (
                    <div key={mapping.id || `mapping-${index}`} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="text-sm">
                              <span className="font-medium">
                                {mapping.fieldType === "standard"
                                  ? STANDARD_FIELDS.find(f => f.value === mapping.localField)?.label || mapping.localField
                                  : mapping.customFieldName
                                }
                              </span>
                              <span className="text-muted-foreground"> ({mapping.externalField})</span>
                            </div>
                            <Badge variant={mapping.fieldType === "standard" ? "default" : "secondary"} className="text-xs">
                              {mapping.fieldType === "standard" ? "Standard" : "Custom"}
                            </Badge>
                            {mapping.required && (
                              <Badge variant="destructive" className="text-xs">Required</Badge>
                            )}
                            {mapping.transform && mapping.transform !== "none" && (
                              <Badge variant="outline" className="text-xs">
                                {TRANSFORM_OPTIONS.find(t => t.value === mapping.transform)?.label}
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <span>Local: </span>
                            <span className="font-medium">
                              {mapping.fieldType === "standard"
                                ? mapping.localField
                                : mapping.customFieldName
                              }
                            </span>
                            <span className="mx-2">•</span>
                            <span>External: </span>
                            <span className="font-medium">{mapping.externalField}</span>
                            {mapping.transform && mapping.transform !== "none" && (
                              <>
                                <span className="mx-2">•</span>
                                <span>Transform: </span>
                                <span className="font-medium">{mapping.transform}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditMapping(index)}
                          disabled={isLoading}
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMapping(index)}
                          disabled={isLoading}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Attribute Mapping Form */}
              {showFieldMappingForm && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">
                      {editingMappingIndex !== null ? "Edit Attribute Mapping" : "Add Attribute Mapping"}
                    </h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={resetMappingForm}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Field Type</Label>
                      <Select
                        key={`fieldType-${editingMappingIndex}-${currentMapping.fieldType}`}
                        value={currentMapping.fieldType}
                        onValueChange={(value) => updateCurrentMapping("fieldType", value)}
                      >
                        <SelectTrigger className="justify-start">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FIELD_TYPE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>
                        {currentMapping.fieldType === "standard" ? "Standard Field" : "Custom Field Name"}
                      </Label>
                      {currentMapping.fieldType === "standard" ? (
                        <Select
                          key={`localField-${editingMappingIndex}-${currentMapping.localField}`}
                          value={currentMapping.localField || ""}
                          onValueChange={(value) => updateCurrentMapping("localField", value)}
                        >
                          <SelectTrigger className="justify-start">
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>User Fields</SelectLabel>
                              {STANDARD_FIELDS.filter(f => f.category === "user").map((field) => (
                                <SelectItem key={field.value} value={field.value}>
                                  {field.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                            <SelectGroup>
                              <SelectLabel>Profile Fields</SelectLabel>
                              {STANDARD_FIELDS.filter(f => f.category === "profile").map((field) => (
                                <SelectItem key={field.value} value={field.value}>
                                  {field.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          value={currentMapping.customFieldName || ""}
                          onChange={(e) => updateCurrentMapping("customFieldName", e.target.value)}
                          placeholder="e.g., employee_id, department"
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>External Field</Label>
                      <Input
                        value={currentMapping.externalField}
                        onChange={(e) => updateCurrentMapping("externalField", e.target.value)}
                        placeholder="e.g., email, given_name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Transform</Label>
                      <Select
                        key={`transform-${editingMappingIndex}-${currentMapping.transform || "none"}`}
                        value={currentMapping.transform || "none"}
                        onValueChange={(value) => updateCurrentMapping("transform", value === "none" ? undefined : value)}
                      >
                        <SelectTrigger className="justify-start">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TRANSFORM_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="mapping-required"
                        checked={currentMapping.required}
                        onCheckedChange={(checked) => updateCurrentMapping("required", checked)}
                      />
                      <Label htmlFor="mapping-required">Required field</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetMappingForm}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSaveMapping}
                        disabled={!currentMapping.externalField ||
                          (currentMapping.fieldType === "standard" && !currentMapping.localField) ||
                          (currentMapping.fieldType === "custom" && !currentMapping.customFieldName)
                        }
                      >
                        {editingMappingIndex !== null ? "Update" : "Add"} Attribute
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {!showFieldMappingForm && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddMapping}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Attribute Mapping
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Token Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Token Configuration</CardTitle>
            <p className="text-sm text-muted-foreground">
              Configure token lifetimes and security settings
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tokenLifetime">Access Token Lifetime (seconds) *</Label>
                <Input
                  id="tokenLifetime"
                  type="number"
                  value={formData.tokenLifetime}
                  onChange={(e) => setFormData(prev => ({ ...prev, tokenLifetime: parseInt(e.target.value) || 3600 }))}
                  min="300"
                  max="86400"
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  Current: {formData.tokenLifetime / 3600} hours (300-86400 seconds)
                </p>
                {errors.tokenLifetime && <p className="text-sm text-red-600">{errors.tokenLifetime}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="refreshTokenLifetime">Refresh Token Lifetime (seconds)</Label>
                <Input
                  id="refreshTokenLifetime"
                  type="number"
                  value={formData.refreshTokenLifetime}
                  onChange={(e) => setFormData(prev => ({ ...prev, refreshTokenLifetime: parseInt(e.target.value) || 604800 }))}
                  min="3600"
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  Current: {formData.refreshTokenLifetime / 86400} days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : (isEditing ? 'Update Client' : 'Create Client')}
          </Button>
        </div>
      </form>
    </div>
  )
}
