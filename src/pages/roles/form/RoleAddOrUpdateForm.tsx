import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DetailsContainer } from "@/components/container"
import { FormPageHeader } from "@/components/header"
import {
  FormInputField,
  FormTextareaField,
  FormSelectField,
  FormSubmitButton,
  type SelectOption
} from "@/components/form"
import { roleSchema, type RoleFormData } from "@/lib/validations"
import { useRole, useCreateRole, useUpdateRole } from "@/hooks/useRoles"
import { useToast } from "@/hooks/useToast"

// Status options for the select field
const STATUS_OPTIONS: SelectOption[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

export default function RoleAddOrUpdateForm() {
  const { tenantId, roleId } = useParams<{ tenantId: string; roleId?: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const isEditing = !!roleId
  const isCreating = !isEditing

  // Fetch existing role if editing
  const { data: roleData, isLoading: isFetchingRole } = useRole(roleId || '')
  const createRoleMutation = useCreateRole()
  const updateRoleMutation = useUpdateRole()

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<RoleFormData>({
    resolver: yupResolver(roleSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "active",
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })

  // Load existing role data if editing
  useEffect(() => {
    if (isEditing && roleData) {
      reset({
        name: roleData.name,
        description: roleData.description,
        status: roleData.status,
      })
    }
  }, [isEditing, roleData, reset])

  const isLoading = createRoleMutation.isPending || updateRoleMutation.isPending || isSubmitting
  const existingRole = roleData

  const onSubmit = async (data: RoleFormData) => {
    try {
      const requestData = {
        name: data.name,
        description: data.description,
        status: data.status,
      }

      if (isCreating) {
        await createRoleMutation.mutateAsync(requestData)
        showSuccess("Role created successfully")
      } else {
        await updateRoleMutation.mutateAsync({
          roleId: roleId!,
          data: requestData
        })
        showSuccess("Role updated successfully")
      }

      // Navigate back to roles list
      navigate(`/${tenantId}/roles`)
    } catch (error) {
      showError(error)
    }
  }

  const pageTitle = isCreating ? "Create Role" : `Edit ${existingRole?.name || "Role"}`
  const submitButtonText = isCreating ? "Create Role" : "Update Role"

  // Show loading state while fetching role data
  if (isEditing && isFetchingRole) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground mt-2">
            Fetching role details
          </p>
        </div>
      </div>
    )
  }

  // Show error if role not found
  if (isEditing && !isFetchingRole && !roleData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Role Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The role you're looking for doesn't exist or has been removed.
          </p>
        </div>
        <Button onClick={() => navigate(`/${tenantId}/roles`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Roles
        </Button>
      </div>
    )
  }

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        <FormPageHeader
          backUrl={`/${tenantId}/roles`}
          backLabel="Back to Roles"
          title={pageTitle}
          description={
            isCreating
              ? "Create a new role to manage user permissions and access control"
              : "Update role settings and configuration"
          }
          showSystemBadge={existingRole?.is_system}
          showWarning={existingRole?.is_system}
          warningMessage="This is a system role. Some settings may be restricted to prevent system instability."
        />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" key={roleId || 'create'}>
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Name */}
                <FormInputField
                  label="Name"
                  placeholder="e.g., admin, developer, viewer"
                  description="Unique identifier for the role (lowercase, numbers, hyphens, and underscores only)"
                  disabled={isLoading || existingRole?.is_system}
                  error={errors.name?.message}
                  required
                  {...register("name")}
                />

                {/* Status */}
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormSelectField
                      label="Status"
                      placeholder="Select status"
                      options={STATUS_OPTIONS}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading}
                      error={errors.status?.message}
                      required
                    />
                  )}
                />
              </div>

              {/* Description */}
              <FormTextareaField
                label="Description"
                placeholder="Provide a detailed description of the role and its purpose"
                rows={4}
                disabled={isLoading}
                error={errors.description?.message}
                required
                {...register("description")}
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/${tenantId}/roles`)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <FormSubmitButton
              isSubmitting={isLoading}
              submitText={submitButtonText}
              disabled={existingRole?.is_system && isEditing}
            />
          </div>
        </form>
      </div>
    </DetailsContainer>
  )
}
