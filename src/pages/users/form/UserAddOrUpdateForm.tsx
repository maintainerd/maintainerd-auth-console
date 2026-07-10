import { useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { ArrowLeft, Plus, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
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
import { useUser, useCreateUser, useUpdateUser } from "@/hooks/useUsers"
import { useToast } from "@/hooks/useToast"
import { useMetadataFields } from "@/hooks/useMetadataFields"
import type { UserStatus } from "@/services/api/users/types"

// Status options for the select field
const STATUS_OPTIONS: SelectOption[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
  { value: "suspended", label: "Suspended" },
]

export default function UserAddOrUpdateForm() {
  const { userId } = useParams<{ userId?: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { showSuccess, showError } = useToast()

  const isEditing = Boolean(userId)
  const isCreating = !isEditing

  // Custom metadata via shared hook
  const {
    customFields,
    metadataError,
    addCustomField,
    removeCustomField,
    updateCustomField,
    buildPayload,
    resetFields,
  } = useMetadataFields()

  // Fetch existing user if editing
  const { data: userData, isLoading: isFetchingUser } = useUser(userId || '')
  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()

  // Honour where the user came from (e.g. the details page) so the back button,
  // Cancel, and post-submit navigation return there. Falls back to the listing.
  const navState = location.state as { from?: string; backLabel?: string } | null
  const backTo = navState?.from ?? `/users`
  const backLabel = navState?.backLabel ?? (backTo === `/users` ? "Back to Users" : "Back")

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(userSchema),
    context: { isCreating },
    defaultValues: {
      username: "",
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
        email: userData.email,
        phone: userData.phone || undefined,
        password: undefined,
        status: userData.status,
      })
      resetFields(userData.metadata)
    }
  }, [isEditing, userData, reset, resetFields])

  const isLoading = createUserMutation.isPending || updateUserMutation.isPending || isSubmitting

  const onSubmit = async (data: yup.InferType<typeof userSchema>) => {
    if (metadataError) {
      showError(metadataError)
      return
    }

    const metadataPayload = buildPayload()

    try {
      if (isCreating) {
        await createUserMutation.mutateAsync({
          username: data.username,
          email: data.email,
          phone: data.phone || undefined,
          password: data.password!,
          status: data.status as UserStatus,
          metadata: metadataPayload,
        })
        showSuccess("User created successfully")
      } else {
        await updateUserMutation.mutateAsync({
          userId: userId!,
          data: {
            username: data.username,
            email: data.email,
            phone: data.phone || undefined,
            status: data.status as UserStatus,
            metadata: metadataPayload,
          },
        })
        showSuccess("User updated successfully")
      }

      navigate(backTo)
    } catch (error) {
      showError(error)
    }
  }

  const pageTitle = isCreating ? "Create User" : `Edit ${userData?.fullname || userData?.username}`
  const submitButtonText = isCreating ? "Create User" : "Update User"

  // Loading state while fetching the user to edit
  if (isEditing && isFetchingUser) {
    return (
      <DetailsContainer>
        <div className="flex flex-col gap-6">
          <FormPageHeader
            backUrl={backTo}
            backLabel={backLabel}
            title="Edit User"
            description="Update user account information and settings"
          />
          <Card className="shadow-xs">
            <CardContent className="space-y-4 pt-6">
              <Skeleton className="h-5 w-40" />
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DetailsContainer>
    )
  }

  // Not-found state
  if (isEditing && !isFetchingUser && !userData) {
    return (
      <DetailsContainer>
        <div className="flex flex-col gap-6">
          <FormPageHeader
            backUrl={backTo}
            backLabel={backLabel}
            title="Edit User"
            description="Update user account information and settings"
          />
          <Card className="shadow-xs">
            <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <AlertCircle className="size-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">User not found</h2>
                <p className="text-sm text-muted-foreground">
                  The user you're trying to edit doesn't exist or may have been removed.
                </p>
              </div>
              <Button variant="outline" onClick={() => navigate(backTo)}>
                <ArrowLeft className="mr-2 size-4" />
                {backLabel}
              </Button>
            </CardContent>
          </Card>
        </div>
      </DetailsContainer>
    )
  }

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        <FormPageHeader
          backUrl={backTo}
          backLabel={backLabel}
          title={pageTitle}
          description={
            isCreating
              ? "Create a new user account with credentials and basic information"
              : "Update user account information and settings"
          }
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" key={userId || 'create'}>
          {/* Account */}
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="text-base">Account</CardTitle>
              <p className="text-sm text-muted-foreground">
                Sign-in credentials and contact details for this user.
              </p>
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
                  placeholder="e.g., +1 555 123 4567"
                  description="Optional — 10 to 20 characters"
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
                      // Status is a constrained select defaulting to "active", so it
                      // cannot produce a validation error — the branch is unreachable.
                      /* v8 ignore next */
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
                  description="At least 8 characters with uppercase, lowercase, number, and special character"
                  disabled={isLoading}
                  error={errors.password?.message}
                  required
                  {...register("password")}
                />
              )}
            </CardContent>
          </Card>

          {/* Custom Metadata */}
          <Card className="shadow-xs">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-base">Custom Metadata</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1.5">
                    Optional key-value pairs stored alongside the user.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCustomField}
                  disabled={isLoading}
                  className="h-9 shrink-0 gap-2"
                >
                  <Plus className="size-4" />
                  Add Field
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {metadataError && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {metadataError}
                </div>
              )}

              {customFields.length === 0 ? (
                <div className="rounded-lg border border-dashed py-10 text-center">
                  <p className="text-sm text-muted-foreground">No custom metadata yet.</p>
                  <Button
                    type="button"
                    variant="link"
                    onClick={addCustomField}
                    disabled={isLoading}
                    className="h-auto p-0 text-sm"
                  >
                    Add your first field
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {customFields.map((field) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Input
                        aria-label="Metadata key"
                        placeholder="Key (e.g., department)"
                        value={field.key}
                        onChange={(e) => updateCustomField(field.id, e.target.value, field.value)}
                        disabled={isLoading}
                      />
                      <Input
                        aria-label="Metadata value"
                        placeholder="Value (e.g., Engineering)"
                        value={field.value}
                        onChange={(e) => updateCustomField(field.id, field.key, e.target.value)}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomField(field.id)}
                        disabled={isLoading}
                        className="size-9 shrink-0 p-0 text-muted-foreground"
                      >
                        <span className="sr-only">Remove field</span>
                        <X className="size-4" />
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
              onClick={() => navigate(backTo)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <FormSubmitButton isSubmitting={isLoading} submitText={submitButtonText} />
          </div>
        </form>
      </div>
    </DetailsContainer>
  )
}
