import { useState, useEffect } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft, Save, Trash2, Server, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MOCK_APIS } from "../constants"
import { MOCK_SERVICES } from "../../services/constants"
import type { Api, ApiStatus } from "../components/ApiColumns"

export default function ApiAddOrUpdateForm() {
  const { tenantId, apiId } = useParams<{ tenantId: string; apiId?: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isEditing = !!apiId
  const isCreating = !isEditing

  // Find existing API if editing
  const existingApi = isEditing ? MOCK_APIS.find(a => a.id === apiId) : null

  // Get pre-selected service from query params
  const preSelectedServiceId = searchParams.get('serviceId')

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    identifier: "",
    description: "",
    serviceId: preSelectedServiceId || "",
    status: "active" as ApiStatus,
    version: "1.0",
    isPublic: false,
    isSystem: false,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load existing API data if editing
  useEffect(() => {
    if (isEditing && existingApi) {
      setFormData({
        name: existingApi.name,
        displayName: existingApi.displayName,
        identifier: existingApi.identifier,
        description: existingApi.description,
        serviceId: existingApi.serviceId,
        status: existingApi.status,
        version: existingApi.version,
        isPublic: existingApi.isPublic,
        isSystem: existingApi.isSystem,
      })
    }
  }, [isEditing, existingApi])

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.displayName.trim()) {
      newErrors.displayName = "Display name is required"
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (!/^[a-z0-9-]+$/.test(formData.name)) {
      newErrors.name = "Name must contain only lowercase letters, numbers, and hyphens"
    }

    if (!formData.identifier.trim()) {
      newErrors.identifier = "Identifier is required"
    } else if (!/^[A-Z0-9]+$/.test(formData.identifier)) {
      newErrors.identifier = "Identifier must contain only uppercase letters and numbers"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.serviceId) {
      newErrors.serviceId = "Service selection is required"
    }

    if (!formData.version.trim()) {
      newErrors.version = "Version is required"
    } else if (!/^\d+\.\d+(\.\d+)?$/.test(formData.version)) {
      newErrors.version = "Version must be in format X.Y or X.Y.Z"
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
      
      if (isCreating) {
        console.log("Creating API:", formData)
      } else {
        console.log("Updating API:", apiId, formData)
      }
      
      // Navigate back to APIs list
      navigate(`/${tenantId}/apis`)
    } catch (error) {
      console.error("Error saving API:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this API? This action cannot be undone.")) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log("Deleting API:", apiId)
      
      // Navigate back to APIs list
      navigate(`/${tenantId}/apis`)
    } catch (error) {
      console.error("Error deleting API:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const pageTitle = isCreating ? "Create New API" : "Edit API"
  const submitButtonText = isCreating ? "Create API" : "Update API"

  // Get selected service info
  const selectedService = MOCK_SERVICES.find(s => s.id === formData.serviceId)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-6">
        {/* Back Button */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/${tenantId}/apis`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to APIs
          </Button>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{pageTitle}</h1>
            {isEditing && existingApi && (
              <Badge className={
                existingApi.status === "active" ? "bg-green-100 text-green-800" :
                existingApi.status === "maintenance" ? "bg-yellow-100 text-yellow-800" :
                existingApi.status === "deprecated" ? "bg-orange-100 text-orange-800" :
                "bg-gray-100 text-gray-800"
              }>
                {existingApi.status}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            {isCreating 
              ? "Create a new API group to organize related endpoints under a service."
              : "Update API settings and configuration."
            }
          </p>
        </div>

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
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    placeholder="e.g., User Management API, Payment Processing API"
                  />
                  <p className="text-xs text-muted-foreground">
                    Human-readable name displayed in the interface
                  </p>
                  {errors.displayName && <p className="text-sm text-destructive">{errors.displayName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., user-management, payment-processing"
                  />
                  <p className="text-xs text-muted-foreground">
                    Unique name used to identify the API (lowercase, hyphens)
                  </p>
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="identifier">Identifier</Label>
                  <Input
                    id="identifier"
                    value={formData.identifier}
                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                    placeholder="e.g., USR7X9K2M, PAY3K8L9P"
                  />
                  <p className="text-xs text-muted-foreground">
                    Unique alphanumeric identifier for internal communications
                  </p>
                  {errors.identifier && <p className="text-sm text-destructive">{errors.identifier}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="e.g., 1.0, 2.1.3"
                  />
                  <p className="text-xs text-muted-foreground">
                    API version in semantic versioning format
                  </p>
                  {errors.version && <p className="text-sm text-destructive">{errors.version}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what this API does and its main functionality..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Detailed description of the API's purpose and functionality
                </p>
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Service & Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Service & Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="serviceId">Parent Service</Label>
                  <Select
                    value={formData.serviceId}
                    onValueChange={(value) => setFormData({ ...formData, serviceId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_SERVICES.filter(s => s.status === "active").map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          <div className="flex items-center gap-2">
                            <Server className="h-4 w-4" />
                            {service.displayName}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    The service this API belongs to
                  </p>
                  {errors.serviceId && <p className="text-sm text-destructive">{errors.serviceId}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: ApiStatus) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="deprecated">Deprecated</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Current operational status of the API
                  </p>
                </div>
              </div>

              {selectedService && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Server className="h-4 w-4" />
                    <span className="font-medium">Selected Service</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedService.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Access Control */}
          <Card>
            <CardHeader>
              <CardTitle>Access Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <Label htmlFor="isPublic">Public API</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Allow public access to this API without authentication
                  </p>
                </div>
                <Switch
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <Label htmlFor="isSystem">System API</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Mark as system API (cannot be deleted by regular users)
                  </p>
                </div>
                <Switch
                  id="isSystem"
                  checked={formData.isSystem}
                  onCheckedChange={(checked) => setFormData({ ...formData, isSystem: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div>
              {isEditing && !formData.isSystem && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete API
                </Button>
              )}
              {isEditing && formData.isSystem && (
                <p className="text-sm text-muted-foreground">
                  System APIs cannot be deleted
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/${tenantId}/apis`)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="gap-2">
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
