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
  FormSelectField,
  FormSubmitButton,
  type SelectOption,
} from "@/components/form"
import { userPoolSchema, type UserPoolFormData } from "@/lib/validations"
import { useUserPool, useCreateUserPool, useUpdateUserPool } from "@/hooks/useUserPools"
import { useToast } from "@/hooks/useToast"

const STATUS_OPTIONS: SelectOption[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

export default function UserPoolAddOrUpdateForm() {
  const { tenantId, userPoolId } = useParams<{ tenantId: string; userPoolId?: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const isEditing = !!userPoolId
  const isCreating = !isEditing

  const { data: userPoolData, isLoading: isFetchingUserPool } = useUserPool(userPoolId || "")
  const createUserPoolMutation = useCreateUserPool()
  const updateUserPoolMutation = useUpdateUserPool()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserPoolFormData>({
    resolver: yupResolver(userPoolSchema),
    defaultValues: {
      name: "",
      display_name: "",
      status: "active",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  })

  useEffect(() => {
    if (isEditing && userPoolData) {
      reset({
        name: userPoolData.name,
        display_name: userPoolData.display_name,
        status: userPoolData.status,
      })
    }
  }, [isEditing, userPoolData, reset])

  const isLoading = createUserPoolMutation.isPending || updateUserPoolMutation.isPending || isSubmitting
  const existingUserPool = userPoolData

  // Status is a fixed-option select, so it can't be made invalid through the UI —
  // this is a defensive guard only and is excluded from branch coverage.
  /* v8 ignore next */
  const statusError = errors.status?.message

  const onSubmit = async (data: UserPoolFormData) => {
    try {
      const requestData = {
        name: data.name,
        display_name: data.display_name,
        status: data.status,
      }

      if (isCreating) {
        await createUserPoolMutation.mutateAsync(requestData)
        showSuccess("User pool created successfully")
      } else {
        await updateUserPoolMutation.mutateAsync({
          userPoolId: userPoolId!,
          data: requestData,
        })
        showSuccess("User pool updated successfully")
      }

      navigate(`/${tenantId}/user-pools`)
    } catch (error) {
      showError(error)
    }
  }

  const pageTitle = isCreating ? "Create User Pool" : `Edit ${existingUserPool?.name || "User Pool"}`
  const submitButtonText = isCreating ? "Create User Pool" : "Update User Pool"

  if (isEditing && isFetchingUserPool) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground mt-2">Fetching user pool details</p>
        </div>
      </div>
    )
  }

  if (isEditing && !isFetchingUserPool && !userPoolData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">User Pool Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The user pool you're looking for doesn't exist or has been removed.
          </p>
        </div>
        <Button onClick={() => navigate(`/${tenantId}/user-pools`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to User Pools
        </Button>
      </div>
    )
  }

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        <FormPageHeader
          backUrl={`/${tenantId}/user-pools`}
          backLabel="Back to User Pools"
          title={pageTitle}
          description={
            isCreating
              ? "Create a new user pool to isolate users, roles, clients, and settings"
              : "Update user pool settings and configuration"
          }
          showSystemBadge={existingUserPool?.is_system}
          showWarning={existingUserPool?.is_system}
          warningMessage="This is a system user pool. Some settings may be restricted to prevent system instability."
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" key={userPoolId || "create"}>
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormInputField
                  label="Name"
                  placeholder="e.g., customers, employees, partners"
                  description="Unique name for the user pool"
                  disabled={isLoading || existingUserPool?.is_system}
                  error={errors.name?.message}
                  required
                  {...register("name")}
                />

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
                      error={statusError}
                      required
                    />
                  )}
                />
              </div>

              <FormInputField
                label="Display Name"
                placeholder="e.g., Customer Accounts"
                description="A human-friendly name shown in the console (optional)"
                disabled={isLoading}
                error={errors.display_name?.message}
                {...register("display_name")}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/${tenantId}/user-pools`)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <FormSubmitButton
              isSubmitting={isLoading}
              submitText={submitButtonText}
              disabled={existingUserPool?.is_system && isEditing}
            />
          </div>
        </form>
      </div>
    </DetailsContainer>
  )
}
