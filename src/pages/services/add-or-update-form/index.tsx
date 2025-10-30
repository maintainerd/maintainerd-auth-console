import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Save, Trash2, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MOCK_SERVICES } from "../constants"
import type { Service, ServiceStatus } from "../components/ServiceColumns"

export default function ServiceAddOrUpdateForm() {
  const { containerId, serviceId } = useParams<{ containerId: string; serviceId?: string }>()
  const navigate = useNavigate()
  const isEditing = !!serviceId
  const isCreating = !isEditing

  // Find existing service if editing
  const existingService = isEditing ? MOCK_SERVICES.find(s => s.id === serviceId) : null

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    description: "",
    status: "active" as ServiceStatus,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load existing service data if editing
  useEffect(() => {
    if (isEditing && existingService) {
      setFormData({
        name: existingService.name,
        displayName: existingService.displayName,
        description: existingService.description,
        status: existingService.status,
      })
    }
  }, [isEditing, existingService])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Service name is required"
    } else if (formData.name.length < 2) {
      newErrors.name = "Service name must be at least 2 characters"
    } else if (!/^[a-z0-9-]+$/.test(formData.name)) {
      newErrors.name = "Service name must contain only lowercase letters, numbers, and hyphens"
    }

    if (!formData.displayName.trim()) {
      newErrors.displayName = "Display name is required"
    } else if (formData.displayName.length < 2) {
      newErrors.displayName = "Display name must be at least 2 characters"
    }



    if (!formData.description.trim()) {
      newErrors.description = "Service description is required"
    } else if (formData.description.length < 10) {
      newErrors.description = "Service description must be at least 10 characters"
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
        console.log("Creating service:", formData)
      } else {
        console.log("Updating service:", serviceId, formData)
      }
      
      // Navigate back to services list
      navigate(`/c/${containerId}/services`)
    } catch (error) {
      console.error("Error saving service:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!existingService || existingService.isSystem) return

    if (!confirm("Are you sure you want to delete this service? This action cannot be undone.")) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log("Deleting service:", serviceId)
      
      // Navigate back to services list
      navigate(`/c/${containerId}/services`)
    } catch (error) {
      console.error("Error deleting service:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const pageTitle = isCreating ? "Create Service" : `Edit ${existingService?.displayName || "Service"}`
  const submitButtonText = isCreating ? "Create Service" : "Update Service"

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-6">
        {/* Back Button */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/c/${containerId}/services`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Button>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">{pageTitle}</h1>
              {existingService?.isSystem && (
                <Badge variant="secondary" className="gap-1">
                  <Shield className="h-3 w-3" />
                  System
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              {isCreating 
                ? "Create a new microservice to manage APIs, permissions, and policies"
                : "Update service settings and configuration"
              }
            </p>
          </div>
        </div>

        {/* System Service Warning */}
        {existingService?.isSystem && (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              This is a system service. Some settings may be restricted to prevent system instability.
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
                  <Label htmlFor="name">Service Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., core, auth, payment"
                    disabled={existingService?.isSystem}
                  />
                  <p className="text-xs text-muted-foreground">
                    Used for communications and events (lowercase, numbers, hyphens only)
                  </p>
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    placeholder="e.g., Core Service, Authentication Service"
                  />
                  <p className="text-xs text-muted-foreground">
                    Human-readable name shown in the interface
                  </p>
                  {errors.displayName && <p className="text-sm text-destructive">{errors.displayName}</p>}
                </div>
              </div>



              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter service description"
                  rows={3}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: ServiceStatus) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="deprecated">Deprecated</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div>
              {isEditing && !existingService?.isSystem && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Service
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/c/${containerId}/services`)}
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
