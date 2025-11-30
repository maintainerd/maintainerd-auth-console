import { useState, useEffect } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useApi } from "@/hooks/useApis"
import { MOCK_PERMISSIONS } from "../../../permissions/constants"

export type Permission = {
  name: string
  description: string
  apiId: string
  apiName: string
  isSystem: boolean
  roleCount: number
  createdAt: string
  createdBy: string
  updatedAt: string
}

export default function AddOrUpdatePermissionPage() {
  const { tenantId, apiId, permissionName } = useParams<{ 
    tenantId: string
    apiId: string
    permissionName?: string
  }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const isEditing = !!permissionName
  const { data: apiData } = useApi(apiId || '')
  const existingPermission = isEditing
    ? MOCK_PERMISSIONS.find(p => p.name === permissionName && p.apiId === apiId)
    : null

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isSystem: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (existingPermission) {
      setFormData({
        name: existingPermission.name,
        description: existingPermission.description,
        isSystem: existingPermission.isSystem,
      })
    }
  }, [existingPermission])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Permission name is required"
    } else if (!/^[a-z0-9-]+:[a-z0-9-]+:[a-z0-9-]+$/.test(formData.name)) {
      newErrors.name = "Permission name must follow format: resource:action:scope (e.g., users:read:all)"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    // Check for duplicate permission names (only when creating or changing name)
    if (!isEditing || (existingPermission && formData.name !== existingPermission.name)) {
      const isDuplicate = MOCK_PERMISSIONS.some(p => 
        p.name === formData.name && p.apiId === apiId
      )
      if (isDuplicate) {
        newErrors.name = "A permission with this name already exists for this API"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    // TODO: Implement actual API call
    console.log(isEditing ? "Updating permission:" : "Creating permission:", {
      ...formData,
      apiId,
      apiName: apiData?.display_name,
    })

    // Navigate back to API details
    navigate(`/${tenantId}/apis/${apiId}`)
  }

  const handleCancel = () => {
    navigate(`/${tenantId}/apis/${apiId}`)
  }

  if (!apiData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">API Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The API you're trying to add a permission to doesn't exist.
          </p>
        </div>
        <Button onClick={() => navigate(`/${tenantId}/apis`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to APIs
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
            onClick={handleCancel}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {apiData.display_name}
          </Button>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {isEditing ? "Edit Permission" : "Add Permission"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing
              ? `Update the permission "${existingPermission?.name}" for ${apiData.display_name}`
              : `Create a new permission for ${apiData.display_name}`
            }
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Permission Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6">
                {/* Permission Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Permission Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., users:read:all, posts:write:own"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use format: resource:action:scope (lowercase, hyphens allowed)
                  </p>
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what this permission allows users to do..."
                    rows={3}
                  />
                  {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                </div>

                {/* System Permission */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isSystem">System Permission</Label>
                    <p className="text-sm text-muted-foreground">
                      System permissions are critical and cannot be deleted by regular users
                    </p>
                  </div>
                  <Switch
                    id="isSystem"
                    checked={formData.isSystem}
                    onCheckedChange={(checked) => setFormData({ ...formData, isSystem: checked })}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" />
                  {isEditing ? "Update Permission" : "Create Permission"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
