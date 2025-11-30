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
  FormCheckboxField,
  FormSubmitButton,
  type SelectOption
} from "@/components/form"
import { serviceSchema, type ServiceFormData } from "@/lib/validations"
import { useService, useCreateService, useUpdateService } from "@/hooks/useServices"
import { useToast } from "@/hooks/useToast"

// Status options for the select field
const STATUS_OPTIONS: SelectOption[] = [
  { value: "active", label: "Active" },
  { value: "maintenance", label: "Maintenance" },
  { value: "deprecated", label: "Deprecated" },
  { value: "inactive", label: "Inactive" },
]

export default function ServiceAddOrUpdateForm() {
  const { tenantId, serviceId } = useParams<{ tenantId: string; serviceId?: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const isEditing = !!serviceId
  const isCreating = !isEditing

  // Fetch existing service if editing
  const { data: serviceData, isLoading: isFetchingService } = useService(serviceId || '')
  const createServiceMutation = useCreateService()
  const updateServiceMutation = useUpdateService()

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ServiceFormData>({
    resolver: yupResolver(serviceSchema),
    defaultValues: {
      name: "",
      displayName: "",
      description: "",
      version: "v0.1.0",
      status: "active",
      isPublic: false,
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })

  // Load existing service data if editing
  useEffect(() => {
    if (isEditing && serviceData) {
      reset({
        name: serviceData.name,
        displayName: serviceData.display_name,
        description: serviceData.description,
        version: serviceData.version,
        status: serviceData.status,
        isPublic: serviceData.is_public,
      })
    }
  }, [isEditing, serviceData, reset])

  const isLoading = createServiceMutation.isPending || updateServiceMutation.isPending || isSubmitting
  const existingService = serviceData

  const onSubmit = async (data: ServiceFormData) => {
    try {
      const requestData = {
        name: data.name,
        display_name: data.displayName,
        description: data.description,
        version: data.version,
        status: data.status,
        is_public: data.isPublic,
      }

      if (isCreating) {
        await createServiceMutation.mutateAsync(requestData)
        showSuccess("Service created successfully")
      } else {
        await updateServiceMutation.mutateAsync({
          serviceId: serviceId!,
          data: requestData
        })
        showSuccess("Service updated successfully")
      }

      // Navigate back to services list
      navigate(`/${tenantId}/services`)
    } catch (error) {
      showError(error)
    }
  }

  const pageTitle = isCreating ? "Create Service" : `Edit ${existingService?.display_name || "Service"}`
  const submitButtonText = isCreating ? "Create Service" : "Update Service"

  // Show loading state while fetching service data
  if (isEditing && isFetchingService) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground mt-2">
            Fetching service details
          </p>
        </div>
      </div>
    )
  }

  // Show error if service not found
  if (isEditing && !isFetchingService && !serviceData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Service Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The service you're looking for doesn't exist or has been removed.
          </p>
        </div>
        <Button onClick={() => navigate(`/${tenantId}/services`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Button>
      </div>
    )
  }

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        <FormPageHeader
          backUrl={`/${tenantId}/services`}
          backLabel="Back to Services"
          title={pageTitle}
          description={
            isCreating
              ? "Create a new microservice to manage APIs, permissions, and policies"
              : "Update service settings and configuration"
          }
          showSystemBadge={existingService?.is_system}
          showWarning={existingService?.is_system}
          warningMessage="This is a system service. Some settings may be restricted to prevent system instability."
        />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormInputField
                  label="Service Name"
                  placeholder="e.g., core, auth, payment"
                  description="Used for communications and events (lowercase, numbers, hyphens only)"
                  disabled={existingService?.is_system || isLoading}
                  error={errors.name?.message}
                  required
                  {...register("name")}
                />

                <FormInputField
                  label="Display Name"
                  placeholder="e.g., Core Service, Authentication Service"
                  description="Human-readable name shown in the interface"
                  disabled={isLoading}
                  error={errors.displayName?.message}
                  required
                  {...register("displayName")}
                />
              </div>

              <FormTextareaField
                label="Description"
                placeholder="Enter service description"
                rows={3}
                disabled={isLoading}
                error={errors.description?.message}
                required
                {...register("description")}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormInputField
                  label="Version"
                  placeholder="e.g., v0.1.0, v1.0.0"
                  description="Service version number"
                  disabled={isLoading}
                  error={errors.version?.message}
                  required
                  {...register("version")}
                />

                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormSelectField
                      key={`status-${field.value || 'empty'}`}
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

              <Controller
                name="isPublic"
                control={control}
                render={({ field }) => (
                  <FormCheckboxField
                    label="Make this service publicly accessible"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                )}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/${tenantId}/services`)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <FormSubmitButton
              isSubmitting={isLoading}
              submitText={submitButtonText}
              disabled={existingService?.is_system && isEditing}
            />
          </div>
        </form>
      </div>
    </DetailsContainer>
  )
}
