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
import { MOCK_SOCIAL_PROVIDERS, SOCIAL_PROVIDER_STATUSES } from "../constants"
import type { SocialProviderType } from "../components/SocialProviderColumns"

const PROVIDER_TYPES: { value: SocialProviderType; label: string; description: string }[] = [
  { value: "google", label: "Google", description: "Google OAuth 2.0 for Gmail and Google Workspace users" },
  { value: "facebook", label: "Facebook", description: "Facebook Login for social authentication" },
  { value: "github", label: "GitHub", description: "GitHub OAuth for developer authentication" },
  { value: "twitter", label: "Twitter", description: "Twitter OAuth for social media integration" },
  { value: "linkedin", label: "LinkedIn", description: "LinkedIn OAuth for professional networking" },
  { value: "apple", label: "Apple", description: "Sign in with Apple for iOS and macOS users" },
  { value: "microsoft", label: "Microsoft", description: "Microsoft OAuth for Office 365 and Azure AD" },
  { value: "discord", label: "Discord", description: "Discord OAuth for gaming community authentication" },
  { value: "custom", label: "Custom OAuth", description: "Custom OAuth 2.0 provider" }
]

export default function SocialProviderAddOrUpdateForm() {
  const { tenantId, providerId } = useParams<{ tenantId: string; providerId?: string }>()
  const navigate = useNavigate()
  
  const isEditing = Boolean(providerId)
  const isCreating = !isEditing
  const existingProvider = isEditing ? MOCK_SOCIAL_PROVIDERS.find(p => p.id === providerId) : null

  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    description: "",
    identifier: "",
    type: "custom" as SocialProviderType,
    status: "active" as const,
    clientId: "",
    clientSecret: "",
    endpoint: "",
    scopes: [] as string[],
  })

  const [customFields, setCustomFields] = useState<Array<{ key: string; value: string; id: string }>>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

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

  // Load existing provider data
  useEffect(() => {
    if (isEditing && existingProvider) {
      setFormData({
        name: existingProvider.name,
        displayName: existingProvider.displayName || "",
        description: existingProvider.description,
        identifier: existingProvider.identifier || "",
        type: existingProvider.type,
        status: existingProvider.status,
        clientId: existingProvider.clientId,
        clientSecret: existingProvider.clientSecret || "",
        endpoint: existingProvider.endpoint,
        scopes: existingProvider.scopes || [],
      })

      // Load custom fields from metadata
      if (existingProvider.metadata) {
        const fields = Object.entries(existingProvider.metadata).map(([key, value], index) => ({
          key,
          value,
          id: `field-${index}`
        }))
        setCustomFields(fields)
      }
    } else {
      // Generate identifier for new providers
      setFormData(prev => ({ ...prev, identifier: generateIdentifier() }))
    }
  }, [isEditing, existingProvider])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Display Name validation
    if (!formData.displayName.trim()) {
      newErrors.displayName = "Display name is required"
    } else if (formData.displayName.length < 2) {
      newErrors.displayName = "Display name must be at least 2 characters"
    } else if (formData.displayName.length > 50) {
      newErrors.displayName = "Display name must be less than 50 characters"
    }

    // Name validation
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

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters"
    } else if (formData.description.length > 200) {
      newErrors.description = "Description must be less than 200 characters"
    }

    // Client ID validation
    if (!formData.clientId.trim()) {
      newErrors.clientId = "Client ID is required"
    }

    // Client Secret validation (optional for some providers)
    if (formData.type !== 'apple' && !formData.clientSecret.trim()) {
      newErrors.clientSecret = "Client Secret is required"
    }

    // Endpoint validation
    if (!formData.endpoint.trim()) {
      newErrors.endpoint = "Authorization endpoint is required"
    } else if (!isValidUrl(formData.endpoint)) {
      newErrors.endpoint = "Please enter a valid URL"
    }

    // Scopes validation
    if (formData.scopes.length === 0) {
      newErrors.scopes = "At least one scope is required"
    }

    // Check for duplicate provider name (excluding current provider if editing)
    const duplicateProvider = MOCK_SOCIAL_PROVIDERS.find(p =>
      p.name.toLowerCase() === formData.name.toLowerCase() &&
      (!isEditing || p.id !== providerId)
    )
    if (duplicateProvider) {
      newErrors.name = "A provider with this name already exists"
    }

    // Check for duplicate provider identifier (excluding current provider if editing)
    const duplicateIdentifier = MOCK_SOCIAL_PROVIDERS.find(p =>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Convert custom fields to metadata object
      const metadata = customFields.reduce((acc, field) => {
        if (field.key.trim() && field.value.trim()) {
          acc[field.key] = field.value
        }
        return acc
      }, {} as Record<string, string>)

      const providerData = {
        ...formData,
        metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      console.log(isEditing ? 'Updating provider:' : 'Creating provider:', providerData)
      
      // Navigate back to providers list
      navigate(`/${tenantId}/providers/social`)
    } catch (error) {
      console.error('Error saving provider:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this social provider? This action cannot be undone.')) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Deleting provider:', providerId)
      
      // Navigate back to providers list
      navigate(`/${tenantId}/providers/social`)
    } catch (error) {
      console.error('Error deleting provider:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addCustomField = () => {
    const newField = {
      key: "",
      value: "",
      id: `field-${Date.now()}`
    }
    setCustomFields([...customFields, newField])
  }

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter(field => field.id !== id))
  }

  const updateCustomField = (id: string, key: string, value: string) => {
    setCustomFields(customFields.map(field => 
      field.id === id ? { ...field, key, value } : field
    ))
  }

  const addScope = () => {
    const scope = prompt("Enter OAuth scope:")
    if (scope && scope.trim() && !formData.scopes.includes(scope.trim())) {
      setFormData(prev => ({ ...prev, scopes: [...prev.scopes, scope.trim()] }))
    }
  }

  const removeScope = (scope: string) => {
    setFormData(prev => ({ ...prev, scopes: prev.scopes.filter(s => s !== scope) }))
  }

  const getProviderSpecificFields = (type: SocialProviderType) => {
    const suggestions: Record<SocialProviderType, Array<{ key: string; description: string }>> = {
      google: [
        { key: "project_id", description: "Google Cloud Project ID" },
        { key: "auth_uri", description: "Authorization URI" },
        { key: "token_uri", description: "Token URI" },
        { key: "auth_provider_x509_cert_url", description: "Auth Provider Certificate URL" }
      ],
      facebook: [
        { key: "app_id", description: "Facebook App ID" },
        { key: "app_secret", description: "Facebook App Secret" },
        { key: "graph_api_version", description: "Graph API Version (e.g., v18.0)" }
      ],
      github: [
        { key: "access_token_url", description: "Access Token URL" },
        { key: "user_api_url", description: "User API URL" },
        { key: "organization", description: "GitHub Organization (optional)" }
      ],
      twitter: [
        { key: "api_version", description: "Twitter API Version" },
        { key: "bearer_token", description: "Bearer Token" }
      ],
      linkedin: [
        { key: "access_token_url", description: "Access Token URL" },
        { key: "profile_api_url", description: "Profile API URL" }
      ],
      apple: [
        { key: "team_id", description: "Apple Team ID" },
        { key: "key_id", description: "Key ID" },
        { key: "private_key", description: "Private Key" }
      ],
      microsoft: [
        { key: "tenant_id", description: "Azure Tenant ID" },
        { key: "authority", description: "Authority URL" },
        { key: "graph_api_url", description: "Microsoft Graph API URL" }
      ],
      discord: [
        { key: "api_endpoint", description: "Discord API Endpoint" },
        { key: "bot_token", description: "Bot Token (optional)" }
      ],
      custom: [
        { key: "token_url", description: "Token Endpoint URL" },
        { key: "userinfo_url", description: "User Info Endpoint URL" },
        { key: "revoke_url", description: "Token Revocation URL (optional)" }
      ]
    }

    return suggestions[type] || []
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-6">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate(`/${tenantId}/providers/social`)}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Social Providers
      </Button>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {isEditing ? 'Edit Social Provider' : 'Create Social Provider'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditing
              ? 'Update the social provider configuration and settings.'
              : 'Configure a new OAuth 2.0 social authentication provider.'
            }
          </p>
        </div>
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
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
                  placeholder="e.g., Google OAuth, Facebook Login"
                  disabled={isLoading}
                />
                {errors.displayName && <p className="text-sm text-red-600">{errors.displayName}</p>}
                <p className="text-xs text-muted-foreground">
                  This will be the display name shown to users
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">System Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., google-oauth, facebook-login"
                  disabled={isLoading}
                  className="font-mono"
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
                    disabled={isLoading}
                    className="font-mono"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, identifier: generateIdentifier() }))}
                    disabled={isLoading}
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
                placeholder="Describe the purpose and usage of this social provider..."
                rows={3}
                disabled={isLoading}
              />
              {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Provider Type *</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value: SocialProviderType) => setFormData(prev => ({ ...prev, type: value }))}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVIDER_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex flex-col items-start">
                          <span>{type.label}</span>
                          <span className="text-xs text-muted-foreground">{type.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SOCIAL_PROVIDER_STATUSES.map((status) => (
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

        {/* OAuth Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>OAuth Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="clientId">Client ID *</Label>
                <Input
                  id="clientId"
                  value={formData.clientId}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientId: e.target.value }))}
                  placeholder="OAuth client ID"
                  disabled={isLoading}
                  className="font-mono"
                />
                {errors.clientId && <p className="text-sm text-red-600">{errors.clientId}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientSecret">
                  Client Secret {formData.type === 'apple' ? '(Optional)' : '*'}
                </Label>
                <Input
                  id="clientSecret"
                  type="password"
                  value={formData.clientSecret}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientSecret: e.target.value }))}
                  placeholder="OAuth client secret"
                  disabled={isLoading}
                  className="font-mono"
                />
                {errors.clientSecret && <p className="text-sm text-red-600">{errors.clientSecret}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endpoint">Authorization Endpoint *</Label>
              <Input
                id="endpoint"
                value={formData.endpoint}
                onChange={(e) => setFormData(prev => ({ ...prev, endpoint: e.target.value }))}
                placeholder="https://provider.com/oauth/authorize"
                disabled={isLoading}
                className="font-mono"
              />
              {errors.endpoint && <p className="text-sm text-red-600">{errors.endpoint}</p>}
            </div>

            <div className="space-y-2">
              <Label>OAuth Scopes *</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.scopes.map((scope) => (
                  <div key={scope} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded text-sm">
                    <span className="font-mono">{scope}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeScope(scope)}
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addScope}
                disabled={isLoading}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Scope
              </Button>
              {errors.scopes && <p className="text-sm text-red-600">{errors.scopes}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Custom Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Configuration</CardTitle>
            <p className="text-sm text-muted-foreground">
              Add provider-specific configuration fields as key-value pairs.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Provider-specific field suggestions */}
            {getProviderSpecificFields(formData.type).length > 0 && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="text-sm font-medium mb-2">Common fields for {PROVIDER_TYPES.find(t => t.value === formData.type)?.label}:</h4>
                <div className="grid gap-2 text-sm">
                  {getProviderSpecificFields(formData.type).map((field) => (
                    <div key={field.key} className="flex justify-between">
                      <code className="text-xs bg-background px-1 rounded">{field.key}</code>
                      <span className="text-muted-foreground text-xs">{field.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Existing custom fields */}
            {customFields.map((field) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  placeholder="Field name"
                  value={field.key}
                  onChange={(e) => updateCustomField(field.id, e.target.value, field.value)}
                  disabled={isLoading}
                  className="font-mono"
                />
                <Input
                  placeholder="Field value"
                  value={field.value}
                  onChange={(e) => updateCustomField(field.id, field.key, e.target.value)}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeCustomField(field.id)}
                  disabled={isLoading}
                  className="px-3"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {/* Add new field button */}
            <Button
              type="button"
              variant="outline"
              onClick={addCustomField}
              disabled={isLoading}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Custom Field
            </Button>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div>
            {isEditing && (
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
              onClick={() => navigate(`/${tenantId}/providers/social`)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isLoading ? "Saving..." : isEditing ? "Update Provider" : "Create Provider"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
