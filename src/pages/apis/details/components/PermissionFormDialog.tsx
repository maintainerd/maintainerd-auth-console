import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Key } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FormInputField, FormTextareaField, FormSelectField, FormSubmitButton, type SelectOption } from "@/components/form"
import { useCreatePermission, useUpdatePermission } from "@/hooks/usePermissions"
import { useToast } from "@/hooks/useToast"
import type { PermissionEntity } from "@/services/api/permission/types"

interface PermissionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  apiId: string
  permission?: PermissionEntity
  onSuccess?: () => void
}

interface PermissionFormData {
  name: string
  description: string
  status: "active" | "inactive"
}

const permissionSchema = yup.object({
  name: yup
    .string()
    .required("Permission name is required")
    .matches(
      /^[a-z0-9-]+:[a-z0-9-]+$/,
      "Permission name must follow format: resource:action (e.g., users:read, posts:write)"
    ),
  description: yup.string().required("Description is required"),
  status: yup.string().oneOf(["active", "inactive"]).required("Status is required"),
})

const statusOptions: SelectOption[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

export function PermissionFormDialog({
  open,
  onOpenChange,
  apiId,
  permission,
  onSuccess,
}: PermissionFormDialogProps) {
  const { showSuccess, showError } = useToast()
  const isEditing = !!permission
  const createPermissionMutation = useCreatePermission()
  const updatePermissionMutation = useUpdatePermission()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PermissionFormData>({
    resolver: yupResolver(permissionSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "active",
    },
  })

  // Load existing permission data if editing
  useEffect(() => {
    if (isEditing && permission) {
      reset({
        name: permission.name,
        description: permission.description,
        status: permission.status,
      })
    } else {
      reset({
        name: "",
        description: "",
        status: "active",
      })
    }
  }, [isEditing, permission, reset])

  const isLoading = createPermissionMutation.isPending || updatePermissionMutation.isPending || isSubmitting

  const onSubmit = async (data: PermissionFormData) => {
    try {
      if (isEditing && permission) {
        await updatePermissionMutation.mutateAsync({
          permissionId: permission.permission_id,
          data: {
            name: data.name,
            description: data.description,
            status: data.status,
          },
        })
        showSuccess("Permission updated successfully")
      } else {
        await createPermissionMutation.mutateAsync({
          name: data.name,
          description: data.description,
          status: data.status,
          api_id: apiId,
        })
        showSuccess("Permission created successfully")
      }

      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      showError(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            {isEditing ? "Edit Permission" : "Add Permission"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the permission details."
              : "Create a new permission for this API."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInputField
            label="Permission Name"
            placeholder="e.g., users:read, posts:write"
            description="Use format: resource:action (lowercase, hyphens allowed)"
            disabled={permission?.is_system || isLoading}
            error={errors.name?.message}
            required
            {...register("name")}
          />

          <FormTextareaField
            label="Description"
            placeholder="Describe what this permission allows"
            disabled={isLoading}
            error={errors.description?.message}
            required
            {...register("description")}
          />

          <FormSelectField
            label="Status"
            options={statusOptions}
            disabled={isLoading}
            error={errors.status?.message}
            required
            {...register("status")}
          />

          <FormSubmitButton
            isSubmitting={isLoading}
            submitText={isEditing ? "Update Permission" : "Create Permission"}
          />
        </form>
      </DialogContent>
    </Dialog>
  )
}

