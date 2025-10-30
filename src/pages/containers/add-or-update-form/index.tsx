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
import { MOCK_CONTAINERS } from "../constants"
import type { Container, ContainerStatus } from "../components/ContainerColumns"

export default function ContainerAddOrUpdateForm() {
  const { containerId, targetContainerId } = useParams<{ containerId: string; targetContainerId?: string }>()
  const navigate = useNavigate()
  const isEditing = !!targetContainerId
  const isCreating = !isEditing

  // Find existing container if editing
  const existingContainer = isEditing ? MOCK_CONTAINERS.find(c => c.id === targetContainerId) : null

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active" as ContainerStatus,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load existing container data if editing
  useEffect(() => {
    if (existingContainer) {
      setFormData({
        name: existingContainer.name,
        description: existingContainer.description,
        status: existingContainer.status,
      })
    }
  }, [existingContainer])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }



  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Container name is required"
    } else if (formData.name.length < 2) {
      newErrors.name = "Container name must be at least 2 characters"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters"
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
        console.log("Creating container:", formData)
        // In real app, this would create the container
      } else {
        console.log("Updating container:", targetContainerId, formData)
        // In real app, this would update the container
      }

      // Navigate back to containers list
      navigate(`/c/${containerId}/containers`)
    } catch (error) {
      console.error("Error saving container:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!existingContainer || existingContainer.isSystem) return

    if (!confirm("Are you sure you want to delete this container? This action cannot be undone.")) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log("Deleting container:", targetContainerId)
      
      // Navigate back to containers list
      navigate(`/c/${containerId}/containers`)
    } catch (error) {
      console.error("Error deleting container:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const pageTitle = isCreating ? "Create Container" : `Edit ${existingContainer?.name || "Container"}`
  const submitButtonText = isCreating ? "Create Container" : "Update Container"

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-6">
        {/* Back Button */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/c/${containerId}/containers`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Containers
          </Button>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">{pageTitle}</h1>
              {existingContainer?.isSystem && (
                <Badge variant="secondary" className="gap-1">
                  <Shield className="h-3 w-3" />
                  System
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              {isCreating 
                ? "Create a new authentication container to manage users and access"
                : "Update container settings and configuration"
              }
            </p>
          </div>
        </div>

        {/* System Container Warning */}
        {existingContainer?.isSystem && (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              This is a system container. Some settings may be restricted to maintain system integrity.
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
              <div className="space-y-2">
                <Label htmlFor="name">Container Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter container name"
                  disabled={existingContainer?.isSystem}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe the purpose and scope of this container"
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: ContainerStatus) => handleInputChange("status", value)}
                  disabled={existingContainer?.isSystem}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div>
              {isEditing && !existingContainer?.isSystem && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Container
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/c/${containerId}/containers`)}
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
