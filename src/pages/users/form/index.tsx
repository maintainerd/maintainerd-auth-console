import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { ArrowLeft, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DetailsContainer } from "@/components/container"
import { FormPageHeader } from "@/components/header"
import {
  FormInputField,
  FormPasswordField,
  FormSelectField,
  FormSubmitButton,
  type SelectOption
} from "@/components/form"
import { userSchema } from "@/lib/validations"
import { useAppSelector } from "@/store/hooks"
import { useUser, useCreateUser, useUpdateUser } from "@/hooks/useUsers"
import { useToast } from "@/hooks/useToast"
import type { UserStatusType } from "@/services/api/user/types"

// Status options for the select field
const STATUS_OPTIONS: SelectOption[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
  { value: "suspended", label: "Suspended" },
]

export default function UserAddOrUpdateForm() {
  const { tenantId, userId } = useParams<{ tenantId: string; userId?: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const currentTenant = useAppSelector((state) => state.tenant.currentTenant)

  const isEditing = Boolean(userId)
  const isCreating = !isEditing

  // Fetch existing user if editing
  const { data: userData, isLoading: isFetchingUser } = useUser(userId || '')
  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()

  // Custom metadata state
  const [customFields, setCustomFields] = useState<Array<{ key: string; value: string; id: string }>>([])
  const [metadataError, setMetadataError] = useState<string>("")

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(userSchema, { context: { isCreating } }),
    defaultValues: {
      username: "",
      fullname: "",
      email: "",
      phone: undefined,
      password: undefined,
      status: "active" as const,
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  // Load existing user data if editing
  useEffect(() => {
    if (isEditing && userData) {
      reset({
        username: userData.username,
        fullname: userData.fullname,
        email: userData.email,
        phone: userData.phone || undefined,
        password: undefined,
        status: userData.status,
      })

      // Load metadata
      if (userData.metadata) {
        const metadataFields = Object.entries(userData.metadata).map(([key, value], index) => ({
          id: `metadata-${index}`,
          key,
          value: String(value)
        }))
        setCustomFields(metadataFields)
      }
    }
  }, [isEditing, userData, reset])

  // Check for duplicate keys whenever custom fields change
  useEffect(() => {
    const keys = customFields.map(field => field.key.trim()).filter(key => key !== '')
    const duplicateKeys = keys.filter((key, index) => keys.indexOf(key) !== index)

    if (duplicateKeys.length > 0) {
      const uniqueDuplicates = [...new Set(duplicateKeys)]
      setMetadataError(`Duplicate metadata keys: ${uniqueDuplicates.join(', ')}`)
    } else {
      setMetadataError("")
    }
  }, [customFields])

  const isLoading = createUserMutation.isPending || updateUserMutation.isPending || isSubmitting
  const existingUser = userData

  // Custom metadata handlers
  const addCustomField = () => {
    setCustomFields([...customFields, { id: Date.now().toString(), key: "", value: "" }])
  }

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter(field => field.id !== id))
  }

  const updateCustomField = (id: string, key: string, value: string) => {
    setCustomFields(customFields.map(field =>
      field.id === id ? { ...field, key, value } : field
    ))
  }

  const onSubmit = async (data: yup.InferType<typeof userSchema>) => {
    // Check for duplicate metadata keys
    if (metadataError) {
      showError(metadataError)
      return
    }

    try {
      // Build metadata object
      const metadata: Record<string, string> = {}
      customFields.forEach(field => {
        if (field.key.trim() && field.value.trim()) {
          metadata[field.key.trim()] = field.value.trim()
        }
      })

      if (isCreating) {
        const requestData = {
          username: data.username,
          fullname: data.fullname,
          email: data.email,
          phone: data.phone || undefined,
          password: data.password!,
          status: data.status as UserStatusType,
          metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
          tenant_id: currentTenant?.tenant_id,
        }

        await createUserMutation.mutateAsync(requestData)
        showSuccess("User created successfully")
      } else {
        const requestData = {
          username: data.username,
          fullname: data.fullname,
          email: data.email,
          phone: data.phone || undefined,
          status: data.status as UserStatusType,
          metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
        }

        await updateUserMutation.mutateAsync({
          userId: userId!,
          data: requestData
        })
        showSuccess("User updated successfully")
      }

      // Navigate back to users list
      navigate(`/${tenantId}/users`)
    } catch (error) {
      showError(error)
    }
  }

  const pageTitle = isCreating ? "Create User" : `Edit ${existingUser?.fullname || "User"}`
  const submitButtonText = isCreating ? "Create User" : "Update User"

  // Show loading state while fetching user data
  if (isEditing && isFetchingUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground mt-2">
            Fetching user details
          </p>
        </div>
      </div>
    )
  }

  // Show error if user not found
  if (isEditing && !isFetchingUser && !userData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">User Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The user you're looking for doesn't exist or has been removed.
          </p>
        </div>
        <Button onClick={() => navigate(`/${tenantId}/users`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Button>
      </div>
    )
  }

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        <FormPageHeader
          backUrl={`/${tenantId}/users`}
          backLabel="Back to Users"
          title={pageTitle}
          description={
            isCreating
              ? "Create a new user account with credentials and basic information"
              : "Update user account information and settings"
          }
        />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" key={userId || 'create'}>
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Username */}
                <FormInputField
                  label="Username"
                  placeholder="e.g., john.doe"
                  description="Unique username for login"
                  disabled={isLoading}
                  error={errors.username?.message}
                  required
                  {...register("username")}
                />

                {/* Full Name */}
                <FormInputField
                  label="Full Name"
                  placeholder="e.g., John Doe"
                  description="User's full name"
                  disabled={isLoading}
                  error={errors.fullname?.message}
                  required
                  {...register("fullname")}
                />

                {/* Email */}
                <FormInputField
                  label="Email"
                  type="email"
                  placeholder="e.g., john.doe@example.com"
                  description="User's email address"
                  disabled={isLoading}
                  error={errors.email?.message}
                  required
                  {...register("email")}
                />

                {/* Phone */}
                <FormInputField
                  label="Phone"
                  type="tel"
                  placeholder="e.g., +1234567890"
                  description="User's phone number (optional)"
                  disabled={isLoading}
                  error={errors.phone?.message}
                  {...register("phone")}
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

              {/* Password (only for create) */}
              {isCreating && (
                <FormPasswordField
                  label="Password"
                  placeholder="Enter a strong password"
                  description="Must contain at least 8 characters with uppercase, lowercase, number, and special character"
                  disabled={isLoading}
                  error={errors.password?.message}
                  required
                  {...register("password")}
                />
              )}
            </CardContent>
          </Card>

          {/* Custom Metadata */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Custom Metadata</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1.5">
                    Add custom key-value pairs for additional user information
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCustomField}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Field
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {metadataError && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  {metadataError}
                </div>
              )}

              {customFields.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No custom metadata fields added yet. Click "Add Field" to get started.
                </p>
              ) : (
                <div className="space-y-3">
                  {customFields.map((field) => (
                    <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-start">
                      <div>
                        <Label htmlFor={`key-${field.id}`}>Key</Label>
                        <Input
                          id={`key-${field.id}`}
                          placeholder="e.g., department"
                          value={field.key}
                          onChange={(e) => updateCustomField(field.id, e.target.value, field.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`value-${field.id}`}>Value</Label>
                        <Input
                          id={`value-${field.id}`}
                          placeholder="e.g., Engineering"
                          value={field.value}
                          onChange={(e) => updateCustomField(field.id, field.key, e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomField(field.id)}
                        disabled={isLoading}
                        className="mt-8 h-9 w-9 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/${tenantId}/users`)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <FormSubmitButton
              isSubmitting={isLoading}
              submitText={submitButtonText}
            />
          </div>
        </form>
      </div>
    </DetailsContainer>
  )
}
