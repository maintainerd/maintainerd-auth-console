import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Save, Trash2, Shield, AlertTriangle, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MOCK_IDENTITY_PROVIDERS, IDENTITY_PROVIDER_STATUSES } from "../constants"
import type { IdentityProvider, IdentityProviderType } from "../components/IdentityProviderColumns"

const PROVIDER_TYPES: { value: IdentityProviderType; label: string; description: string }[] = [
  { value: "cognito", label: "AWS Cognito", description: "Amazon Cognito User Pools for scalable user management" },
  { value: "auth0", label: "Auth0", description: "Auth0 identity platform for secure authentication" },
  { value: "okta", label: "Okta", description: "Okta identity and access management platform" },
  { value: "azure_ad", label: "Azure Active Directory", description: "Microsoft Azure AD for enterprise identity" },
  { value: "keycloak", label: "Keycloak", description: "Open source identity and access management" },
  { value: "firebase", label: "Firebase Auth", description: "Google Firebase Authentication service" },
  { value: "custom", label: "Custom Provider", description: "Custom or self-hosted identity provider" }
]

export default function IdentityProviderAddOrUpdateForm() {
  const { tenantId, providerId } = useParams<{ tenantId: string; providerId?: string }>()
  const navigate = useNavigate()
  
  const isEditing = Boolean(providerId)
  const isCreating = !isEditing
  const existingProvider = isEditing ? MOCK_IDENTITY_PROVIDERS.find(p => p.id === providerId) : null

  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    description: "",
    identifier: "",
    type: "custom" as IdentityProviderType,
    status: "active" as const,
    endpoint: "",
  })

  // Generate random alphanumeric identifier
  const generateIdentifier = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Generate name from displayName
  const generateNameFromDisplayName = (displayName: string) => {
    return displayName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
  }

  // Custom fields state
  const [customFields, setCustomFields] = useState<Array<{ key: string; value: string; id: string }>>([])
  const [newFieldKey, setNewFieldKey] = useState("")
  const [newFieldValue, setNewFieldValue] = useState("")

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load existing provider data if editing, or generate identifier for new providers
  useEffect(() => {
    if (isEditing && existingProvider) {
      setFormData({
        name: existingProvider.name,
        displayName: existingProvider.displayName || "",
        description: existingProvider.description,
        identifier: existingProvider.identifier || "",
        type: existingProvider.type,
        status: existingProvider.status,
        endpoint: existingProvider.endpoint,
      })

      // Load custom fields from metadata if they exist, including region for existing providers
      const fields: Array<{ key: string; value: string; id: string }> = []

      // Add region as a custom field if it exists
      if (existingProvider.region) {
        fields.push({
          id: `region-${Date.now()}`,
          key: 'region',
          value: existingProvider.region
        })
      }

      // Add other metadata fields
      if (existingProvider.metadata) {
        const metadataFields = Object.entries(existingProvider.metadata).map(([key, value], index) => ({
          id: `${Date.now()}-${index}`,
          key,
          value: String(value)
        }))
        fields.push(...metadataFields)
      }

      setCustomFields(fields)
    } else if (isCreating) {
      // Generate identifier for new providers
      setFormData(prev => ({
        ...prev,
        identifier: generateIdentifier()
      }))
    }
  }, [isEditing, existingProvider, isCreating])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Name validation (slug format)
    if (!formData.name.trim()) {
      newErrors.name = "Provider name is required"
    } else if (!/^[a-z0-9-]+$/.test(formData.name)) {
      newErrors.name = "Name can only contain lowercase letters, numbers, and hyphens"
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    } else if (formData.name.length > 50) {
      newErrors.name = "Name must be less than 50 characters"
    } else if (formData.name.startsWith('-') || formData.name.endsWith('-')) {
      newErrors.name = "Name cannot start or end with a hyphen"
    }

    // Identifier validation
    if (!formData.identifier.trim()) {
      newErrors.identifier = "Provider identifier is required"
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.identifier)) {
      newErrors.identifier = "Identifier can only contain letters and numbers"
    } else if (formData.identifier.length !== 12) {
      newErrors.identifier = "Identifier must be exactly 12 characters"
    }

    // Display Name validation
    if (!formData.displayName.trim()) {
      newErrors.displayName = "Display name is required"
    } else if (formData.displayName.length < 2) {
      newErrors.displayName = "Display name must be at least 2 characters"
    } else if (formData.displayName.length > 50) {
      newErrors.displayName = "Display name must be less than 50 characters"
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters"
    } else if (formData.description.length > 200) {
      newErrors.description = "Description must be less than 200 characters"
    }

    // Endpoint validation
    if (!formData.endpoint.trim()) {
      newErrors.endpoint = "Provider endpoint is required"
    } else if (!isValidUrl(formData.endpoint)) {
      newErrors.endpoint = "Please enter a valid URL"
    }

    // Check for duplicate provider name (excluding current provider if editing)
    const duplicateProvider = MOCK_IDENTITY_PROVIDERS.find(p =>
      p.name.toLowerCase() === formData.name.toLowerCase() &&
      (!isEditing || p.id !== providerId)
    )
    if (duplicateProvider) {
      newErrors.name = "A provider with this name already exists"
    }

    // Check for duplicate provider identifier (excluding current provider if editing)
    const duplicateIdentifier = MOCK_IDENTITY_PROVIDERS.find(p =>
      p.identifier?.toLowerCase() === formData.identifier.toLowerCase() &&
      (!isEditing || p.id !== providerId)
    )
    if (duplicateIdentifier) {
      newErrors.identifier = "A provider with this identifier already exists"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  // Custom field management functions
  const addCustomField = () => {
    if (newFieldKey.trim() && newFieldValue.trim()) {
      const newField = {
        id: Date.now().toString(),
        key: newFieldKey.trim(),
        value: newFieldValue.trim()
      }
      setCustomFields([...customFields, newField])
      setNewFieldKey("")
      setNewFieldValue("")
    }
  }

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter(field => field.id !== id))
  }

  const updateCustomField = (id: string, key: string, value: string) => {
    setCustomFields(customFields.map(field =>
      field.id === id ? { ...field, key, value } : field
    ))
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
      
      // Extract region from custom fields for backward compatibility
      const regionField = customFields.find(field => field.key === 'region')
      const otherCustomFields = customFields.filter(field => field.key !== 'region')

      const providerData = {
        ...formData,
        id: isCreating ? `new-${Date.now()}` : providerId,
        userCount: 0,
        isDefault: false,
        region: regionField?.value || undefined,
        metadata: otherCustomFields.reduce((acc, field) => {
          acc[field.key] = field.value
          return acc
        }, {} as Record<string, string>),
        createdAt: isCreating ? new Date().toISOString() : existingProvider?.createdAt,
        createdBy: isCreating ? "admin" : existingProvider?.createdBy,
        updatedAt: new Date().toISOString(),
      }
      
      if (isCreating) {
        console.log("Creating identity provider:", providerData)
      } else {
        console.log("Updating identity provider:", providerData)
      }
      
      // Navigate back to providers list
      navigate(`/${tenantId}/providers/identity`)
    } catch (error) {
      console.error("Error saving identity provider:", error)
      setErrors({ submit: "Failed to save identity provider. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!existingProvider || existingProvider.isDefault) return
    
    const confirmed = window.confirm(
      `Are you sure you want to delete "${existingProvider.name}"? This action cannot be undone.`
    )
    
    if (!confirmed) return

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log("Deleting identity provider:", existingProvider.id)
      
      // Navigate back to providers list
      navigate(`/${tenantId}/providers/identity`)
    } catch (error) {
      console.error("Error deleting identity provider:", error)
      setErrors({ submit: "Failed to delete identity provider. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const pageTitle = isCreating ? "Add Identity Provider" : `Edit ${existingProvider?.name || "Identity Provider"}`

  return (
    <div className="container mx-auto max-w-4xl space-y-6">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate(`/${tenantId}/providers/identity`)}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Identity Providers
      </Button>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{pageTitle}</h1>
          <p className="text-muted-foreground mt-1">
            {isCreating 
              ? "Configure a new identity provider to handle user authentication for your application."
              : "Update the identity provider configuration and settings."
            }
          </p>
        </div>

        {/* System Provider Warning */}
        {isEditing && existingProvider?.isDefault && (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              This is the system's built-in identity provider and cannot be modified. 
              The built-in provider handles user authentication automatically.
            </AlertDescription>
          </Alert>
        )}

        {/* Submit Error */}
        {errors.submit && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{errors.submit}</AlertDescription>
          </Alert>
        )}

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <p className="text-sm text-muted-foreground">
              Configure the basic details for your identity provider
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name *</Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) => {
                  const newDisplayName = e.target.value
                  setFormData(prev => ({
                    ...prev,
                    displayName: newDisplayName,
                    name: generateNameFromDisplayName(newDisplayName)
                  }))
                }}
                placeholder="e.g., Corporate Auth0, Okta Enterprise"
                disabled={existingProvider?.isDefault || isLoading}
              />
              {errors.displayName && <p className="text-sm text-red-600">{errors.displayName}</p>}
              <p className="text-xs text-muted-foreground">
                This will be the display name shown to users
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">System Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., corporate-auth0, okta-enterprise"
                  disabled={existingProvider?.isDefault || isLoading}
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                <p className="text-xs text-muted-foreground">
                  Lowercase letters, numbers, and hyphens only (auto-generated from display name)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="identifier">Identifier *</Label>
                <div className="flex gap-2">
                  <Input
                    id="identifier"
                    value={formData.identifier}
                    onChange={(e) => setFormData(prev => ({ ...prev, identifier: e.target.value }))}
                    placeholder="e.g., A1b2C3d4E5f6"
                    disabled={existingProvider?.isDefault || isLoading}
                    className="font-mono"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, identifier: generateIdentifier() }))}
                    disabled={existingProvider?.isDefault || isLoading}
                    className="px-3"
                  >
                    Generate
                  </Button>
                </div>
                {errors.identifier && <p className="text-sm text-red-600">{errors.identifier}</p>}
                <p className="text-xs text-muted-foreground">
                  12-character random alphanumeric identifier (letters and numbers)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the purpose and usage of this identity provider..."
                rows={3}
                disabled={existingProvider?.isDefault || isLoading}
              />
              {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
            </div>

            <div className="grid gap-4 md:grid-cols-2">

              <div className="space-y-2">
                <Label htmlFor="type">Provider Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: IdentityProviderType) => setFormData(prev => ({ ...prev, type: value }))}
                  disabled={existingProvider?.isDefault || isLoading}
                >
                  <SelectTrigger className="text-left">
                    <SelectValue placeholder="Select provider type">
                      {formData.type && PROVIDER_TYPES.find(p => p.value === formData.type)?.label}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {PROVIDER_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex flex-col">
                          <span>{type.label}</span>
                          <span className="text-xs text-muted-foreground">{type.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
                  disabled={existingProvider?.isDefault || isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {IDENTITY_PROVIDER_STATUSES.map((status) => (
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

        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Provider Configuration</CardTitle>
            <p className="text-sm text-muted-foreground">
              Configure the connection settings for your identity provider
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="endpoint">Endpoint URL *</Label>
              <Input
                id="endpoint"
                value={formData.endpoint}
                onChange={(e) => setFormData(prev => ({ ...prev, endpoint: e.target.value }))}
                placeholder="https://your-provider.auth0.com"
                disabled={existingProvider?.isDefault || isLoading}
              />
              {errors.endpoint && <p className="text-sm text-red-600">{errors.endpoint}</p>}
              <p className="text-xs text-muted-foreground">
                The primary endpoint URL for your identity provider. All other configuration should be added as custom fields below.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Custom Configuration Fields */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Custom Configuration Fields
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Add provider-specific configuration fields (e.g., User Pool ID, Client Secret, Token Signing Key URL)
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Existing Custom Fields */}
            {customFields.length > 0 && (
              <div className="space-y-3">
                {customFields.map((field) => (
                  <div key={field.id} className="flex gap-3 items-start">
                    <div className="flex-1 grid gap-3 md:grid-cols-2">
                      <Input
                        value={field.key}
                        onChange={(e) => updateCustomField(field.id, e.target.value, field.value)}
                        placeholder="Field name (e.g., user_pool_id, client_secret)"
                        disabled={existingProvider?.isDefault || isLoading}
                      />
                      <Input
                        value={field.value}
                        onChange={(e) => updateCustomField(field.id, field.key, e.target.value)}
                        placeholder="Field value"
                        disabled={existingProvider?.isDefault || isLoading}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCustomField(field.id)}
                      className="text-destructive hover:text-destructive"
                      disabled={existingProvider?.isDefault || isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Custom Field */}
            <div className="border-t pt-4">
              <div className="flex gap-3 items-end">
                <div className="flex-1 grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="newFieldKey">Field Name</Label>
                    <Input
                      id="newFieldKey"
                      value={newFieldKey}
                      onChange={(e) => setNewFieldKey(e.target.value)}
                      placeholder="e.g., user_pool_id, client_secret, token_url"
                      disabled={existingProvider?.isDefault || isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newFieldValue">Field Value</Label>
                    <Input
                      id="newFieldValue"
                      value={newFieldValue}
                      onChange={(e) => setNewFieldValue(e.target.value)}
                      placeholder="e.g., us-west-2_ABC123XYZ"
                      disabled={existingProvider?.isDefault || isLoading}
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={addCustomField}
                  disabled={!newFieldKey.trim() || !newFieldValue.trim() || existingProvider?.isDefault || isLoading}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Field
                </Button>
              </div>
            </div>

            {customFields.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No custom configuration fields added yet</p>
                <p className="text-sm">Add provider-specific configuration fields for your identity provider</p>
              </div>
            )}

            {/* Provider-specific field suggestions */}
            {formData.type && formData.type !== 'custom' && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-2">
                  Common configuration fields for {PROVIDER_TYPES.find(p => p.value === formData.type)?.label}:
                </p>
                <div className="text-xs text-blue-700 space-y-1">
                  {formData.type === 'cognito' && (
                    <>
                      <p>• region - AWS Region (e.g., us-west-2, us-east-1)</p>
                      <p>• user_pool_id - AWS Cognito User Pool ID</p>
                      <p>• user_pool_name - User Pool Name</p>
                      <p>• app_client_id - App Client ID</p>
                      <p>• app_client_secret - App Client Secret</p>
                      <p>• token_signing_key_url - Token Signing Key URL</p>
                      <p>• identity_pool_id - Identity Pool ID (if using)</p>
                    </>
                  )}
                  {formData.type === 'auth0' && (
                    <>
                      <p>• domain - Auth0 Domain (e.g., company.auth0.com)</p>
                      <p>• client_id - Application Client ID</p>
                      <p>• client_secret - Application Client Secret</p>
                      <p>• audience - API Audience/Identifier</p>
                      <p>• connection - Database Connection Name</p>
                      <p>• scope - OAuth Scopes (e.g., openid profile email)</p>
                      <p>• management_api_token - Management API Token</p>
                    </>
                  )}
                  {formData.type === 'okta' && (
                    <>
                      <p>• org_url - Okta Organization URL (e.g., company.okta.com)</p>
                      <p>• client_id - Application Client ID</p>
                      <p>• client_secret - Application Client Secret</p>
                      <p>• authorization_server_id - Authorization Server ID</p>
                      <p>• api_token - Okta API Token</p>
                      <p>• issuer - Issuer URL</p>
                      <p>• redirect_uri - Redirect URI</p>
                    </>
                  )}
                  {formData.type === 'azure_ad' && (
                    <>
                      <p>• tenant_id - Azure AD Tenant ID</p>
                      <p>• client_id - Application (Client) ID</p>
                      <p>• client_secret - Application Client Secret</p>
                      <p>• authority - Authority URL</p>
                      <p>• graph_api_endpoint - Microsoft Graph API Endpoint</p>
                      <p>• redirect_uri - Redirect URI</p>
                      <p>• scope - OAuth Scopes</p>
                    </>
                  )}
                  {formData.type === 'keycloak' && (
                    <>
                      <p>• server_url - Keycloak Server URL</p>
                      <p>• realm - Realm Name</p>
                      <p>• client_id - Client ID</p>
                      <p>• client_secret - Client Secret</p>
                      <p>• admin_username - Admin Username</p>
                      <p>• admin_password - Admin Password</p>
                      <p>• ssl_required - SSL Required Setting</p>
                    </>
                  )}
                  {formData.type === 'firebase' && (
                    <>
                      <p>• project_id - Firebase Project ID</p>
                      <p>• api_key - Web API Key</p>
                      <p>• auth_domain - Auth Domain</p>
                      <p>• messaging_sender_id - Messaging Sender ID</p>
                      <p>• app_id - Firebase App ID</p>
                      <p>• measurement_id - Google Analytics Measurement ID</p>
                      <p>• storage_bucket - Storage Bucket</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div>
            {isEditing && !existingProvider?.isDefault && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Provider
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/${tenantId}/providers/identity`)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || existingProvider?.isDefault}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isLoading ? "Saving..." : isCreating ? "Create Provider" : "Update Provider"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
