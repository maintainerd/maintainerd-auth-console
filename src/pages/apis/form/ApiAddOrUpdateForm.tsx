import { useMemo, useEffect } from "react"
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
import { apiSchema, type ApiFormData } from "@/lib/validations"
import { useApi, useCreateApi, useUpdateApi } from "@/hooks/useApis"
import { useServices } from "@/hooks/useServices"
import { useToast } from "@/hooks/useToast"

// Status options for the select field
const STATUS_OPTIONS: SelectOption[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

// API Type options
const API_TYPE_OPTIONS: SelectOption[] = [
  { value: "rest", label: "REST" },
  { value: "grpc", label: "gRPC" },
  { value: "graphql", label: "GraphQL" },
  { value: "soap", label: "SOAP" },
  { value: "webhook", label: "Webhook" },
  { value: "websocket", label: "WebSocket" },
  { value: "rpc", label: "RPC" },
]

export default function ApiAddOrUpdateForm() {
  const { tenantId, apiId } = useParams<{ tenantId: string; apiId?: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const isEditing = !!apiId
  const isCreating = !isEditing

  // Fetch existing API if editing
  const { data: apiData, isLoading: isFetchingApi } = useApi(apiId || '')
  const createApiMutation = useCreateApi()
  const updateApiMutation = useUpdateApi()

  // Fetch services for dropdown
  const { data: servicesData, isLoading: isFetchingServices } = useServices({
    page: 1,
    limit: 100,
    sort_by: 'display_name',
    sort_order: 'asc'
  })

  // Convert services to select options
  const serviceOptions: SelectOption[] = useMemo(() => {
    if (!servicesData?.rows) return []
    return servicesData.rows.map(service => ({
      value: service.service_id,
      label: service.display_name,
    }))
  }, [servicesData])

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ApiFormData>({
    resolver: yupResolver(apiSchema),
    defaultValues: {
      name: "",
      displayName: "",
      description: "",
      apiType: "rest",
      status: "active",
      serviceId: "",
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })

  // Reset form with API data when both API and services are loaded
  useEffect(() => {
    if (!isEditing) return
    if (!apiData) return
    if (!servicesData?.rows?.length) return

    // Ensure the service exists in the options before setting it
    const serviceId = apiData.service?.service_id || ""

    reset({
      name: apiData.name,
      displayName: apiData.display_name,
      description: apiData.description,
      apiType: apiData.api_type,
      status: apiData.status,
      serviceId: serviceId,
    })
  }, [isEditing, apiData, servicesData, reset])

  const isLoading = createApiMutation.isPending || updateApiMutation.isPending || isSubmitting
  const existingApi = apiData

  const onSubmit = async (data: ApiFormData) => {
    try {
      const requestData = {
        name: data.name,
        display_name: data.displayName,
        description: data.description,
        api_type: data.apiType,
        status: data.status,
        service_id: data.serviceId,
      }

      if (isCreating) {
        await createApiMutation.mutateAsync(requestData)
        showSuccess("API created successfully")
      } else {
        await updateApiMutation.mutateAsync({
          apiId: apiId!,
          data: requestData
        })
        showSuccess("API updated successfully")
      }

      // Navigate back to APIs list
      navigate(`/${tenantId}/apis`)
    } catch (error) {
      showError(error)
    }
  }

  const pageTitle = isCreating ? "Create API" : `Edit ${existingApi?.display_name || "API"}`
  const submitButtonText = isCreating ? "Create API" : "Update API"

  // Show loading state while fetching API data or services (needed for dropdown)
  if ((isEditing && isFetchingApi) || isFetchingServices) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground mt-2">
            {isEditing && isFetchingApi ? "Fetching API details" : "Loading services"}
          </p>
        </div>
      </div>
    )
  }

  // Show error if API not found
  if (isEditing && !isFetchingApi && !apiData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">API Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The API you're looking for doesn't exist or has been removed.
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
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        <FormPageHeader
          backUrl={`/${tenantId}/apis`}
          backLabel="Back to APIs"
          title={pageTitle}
          description={
            isCreating
              ? "Create a new API to manage permissions and access control"
              : "Update API settings and configuration"
          }
          showSystemBadge={existingApi?.is_system}
          showWarning={existingApi?.is_system}
          warningMessage="This is a system API. Some settings may be restricted to prevent system instability."
        />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" key={apiId || 'create'}>
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormInputField
                  label="API Name"
                  placeholder="e.g., auth, users, payments"
                  description="Used for communications and events (lowercase, numbers, hyphens only)"
                  disabled={existingApi?.is_system || isLoading}
                  error={errors.name?.message}
                  required
                  {...register("name")}
                />

                <FormInputField
                  label="Display Name"
                  placeholder="e.g., Auth API, Users API"
                  description="Human-readable name shown in the interface"
                  disabled={isLoading}
                  error={errors.displayName?.message}
                  required
                  {...register("displayName")}
                />
              </div>

              <FormTextareaField
                label="Description"
                placeholder="Enter API description"
                rows={3}
                disabled={isLoading}
                error={errors.description?.message}
                required
                {...register("description")}
              />

              <div className="grid gap-4 md:grid-cols-3">
                <Controller
                  name="serviceId"
                  control={control}
                  render={({ field }) => (
                    <FormSelectField
                      key={`service-${field.value || 'empty'}`}
                      label="Service"
                      placeholder={isFetchingServices ? "Loading services..." : "Select service"}
                      options={serviceOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading || isFetchingServices || (existingApi?.is_system && isEditing)}
                      error={errors.serviceId?.message}
                      required
                    />
                  )}
                />

                <Controller
                  name="apiType"
                  control={control}
                  render={({ field }) => (
                    <FormSelectField
                      label="API Type"
                      placeholder="Select API type"
                      options={API_TYPE_OPTIONS}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading || (existingApi?.is_system && isEditing)}
                      error={errors.apiType?.message}
                      required
                    />
                  )}
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
                      error={errors.status?.message}
                      required
                    />
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/${tenantId}/apis`)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <FormSubmitButton
              isSubmitting={isLoading}
              submitText={submitButtonText}
              disabled={existingApi?.is_system && isEditing}
            />
          </div>
        </form>
      </div>
    </DetailsContainer>
  )
}

