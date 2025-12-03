import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DetailsContainer } from "@/components/container"
import { FormPageHeader } from "@/components/header"
import {
  FormInputField,
  FormSelectField,
  FormSubmitButton,
  type SelectOption
} from "@/components/form"
import { socialProviderSchema, type SocialProviderFormData } from "@/lib/validations"
import { useAppSelector } from "@/store/hooks"
import { useIdentityProvider, useCreateIdentityProvider, useUpdateIdentityProvider } from "@/hooks/useIdentityProviders"
import { useToast } from "@/hooks/useToast"
import type { ProviderOption, IdentityProviderStatusType } from "@/services/api/identity-provider/types"

const PROVIDER_OPTIONS: SelectOption[] = [
  { value: "google", label: "Google" },
  { value: "facebook", label: "Facebook" },
  { value: "github", label: "GitHub" },
]

const STATUS_OPTIONS: SelectOption[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

export default function SocialProviderAddOrUpdateForm() {
  const { tenantId, providerId } = useParams<{ tenantId: string; providerId?: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const currentTenant = useAppSelector((state) => state.tenant.currentTenant)

  const isEditing = Boolean(providerId)

  // Fetch existing provider if editing
  const { data: providerData, isLoading: isFetchingProvider } = useIdentityProvider(providerId || '')
  const createProviderMutation = useCreateIdentityProvider()
  const updateProviderMutation = useUpdateIdentityProvider()

  // Custom config fields state
  const [customFields, setCustomFields] = useState<Array<{ key: string; value: string; id: string }>>([])
  const [configError, setConfigError] = useState<string>("")

  // Check for duplicate keys whenever custom fields change
  useEffect(() => {
    const keys = customFields.map(field => field.key.trim()).filter(key => key !== '')
    const duplicateKeys = keys.filter((key, index) => keys.indexOf(key) !== index)

    if (duplicateKeys.length > 0) {
      const uniqueDuplicates = [...new Set(duplicateKeys)]
      setConfigError(`Duplicate configuration keys: ${uniqueDuplicates.join(', ')}`)
    } else {
      setConfigError("")
    }
  }, [customFields])

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<SocialProviderFormData>({
    resolver: yupResolver(socialProviderSchema),
    defaultValues: {
      name: "",
      displayName: "",
      provider: "google",
      status: "active",
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })

  // Load existing provider data if editing
  useEffect(() => {
    if (isEditing && providerData) {
      reset({
        name: providerData.name,
        displayName: providerData.display_name,
        provider: providerData.provider as 'google' | 'facebook' | 'github',
        status: providerData.status as 'active' | 'inactive',
      })

      // Load config fields
      if (providerData.config) {
        const fields = Object.entries(providerData.config).map(([key, value], index) => ({
          id: `${Date.now()}-${index}`,
          key,
          value: String(value)
        }))
        setCustomFields(fields)
      }
    }
  }, [isEditing, providerData, reset])

  // Custom config field management functions
  const addCustomField = () => {
    const newField = {
      id: Date.now().toString(),
      key: "",
      value: ""
    }
    setCustomFields([...customFields, newField])
  }

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter(field => field.id !== id))
  }

  const updateCustomField = (id: string, key: string, value: string) => {
    setCustomFields(customFields.map(field =>
      field.id === id ? { ...field, key, value } : field
    ))
  }

  const onSubmit = async (formData: SocialProviderFormData) => {
    if (!currentTenant) {
      showError("Tenant information not available")
      return
    }

    // Check for duplicate keys in custom fields
    if (configError) {
      showError(configError)
      return
    }

    try {
      // Build config object from custom fields
      const config = customFields.reduce((acc, field) => {
        if (field.key.trim()) {
          acc[field.key] = field.value
        }
        return acc
      }, {} as Record<string, string>)

      if (isEditing && providerId) {
        const updateData = {
          name: formData.name,
          display_name: formData.displayName,
          provider: formData.provider as ProviderOption,
          provider_type: 'social' as const,
          config,
          status: formData.status as IdentityProviderStatusType,
        }
        await updateProviderMutation.mutateAsync({
          identityProviderId: providerId,
          data: updateData
        })
        showSuccess("Social provider updated successfully")
      } else {
        const createData = {
          name: formData.name,
          display_name: formData.displayName,
          provider: formData.provider as ProviderOption,
          provider_type: 'social' as const,
          config,
          status: formData.status as IdentityProviderStatusType,
          tenant_id: currentTenant.tenant_id
        }
        await createProviderMutation.mutateAsync(createData)
        showSuccess("Social provider created successfully")
      }

      // Navigate back to providers list
      navigate(`/${tenantId}/providers/social`)
    } catch (error) {
      showError(error, "Failed to save social provider")
    }
  }

  const isLoading = createProviderMutation.isPending || updateProviderMutation.isPending || isFetchingProvider

  // Loading state
  if (isEditing && isFetchingProvider) {
    return (
      <DetailsContainer>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Loading...</h2>
            <p className="text-muted-foreground mt-2">
              Fetching social provider details
            </p>
          </div>
        </div>
      </DetailsContainer>
    )
  }

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <FormPageHeader
          title={isEditing ? "Edit Social Provider" : "Create Social Provider"}
          description={
            isEditing
              ? "Update the social provider configuration and settings."
              : "Configure a new social provider to handle OAuth authentication for your application."
          }
          backUrl={`/${tenantId}/providers/social`}
        />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormInputField
                label="Name"
                placeholder="e.g., corporate-auth0, aws-cognito"
                description="Lowercase letters, numbers, and hyphens only"
                disabled={providerData?.is_system || isLoading}
                error={errors.name?.message}
                required
                {...register("name")}
              />

              <FormInputField
                label="Display Name"
                placeholder="e.g., Corporate Auth0, AWS Cognito"
                description="This will be the display name shown to users"
                disabled={providerData?.is_system || isLoading}
                error={errors.displayName?.message}
                required
                {...register("displayName")}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <Controller
                  name="provider"
                  control={control}
                  render={({ field }) => (
                    <FormSelectField
                      key={`provider-${field.value || 'empty'}`}
                      label="Provider"
                      placeholder="Select provider"
                      options={PROVIDER_OPTIONS}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={providerData?.is_system || isLoading}
                      error={errors.provider?.message}
                      required
                    />
                  )}
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
                      disabled={providerData?.is_system || isLoading}
                      error={errors.status?.message}
                      required
                    />
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Custom Configuration Fields */}
          <Card>
            <CardHeader>
              <CardTitle>Custom Configuration</CardTitle>
              <p className="text-sm text-muted-foreground">
                Add provider-specific configuration fields (e.g., Client ID, Client Secret, Redirect URI, Scopes)
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Error Message for Duplicate Keys */}
              {configError && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {configError}
                </div>
              )}

              {/* Existing Custom Fields */}
              {customFields.length > 0 && (
                <div className="space-y-3">
                  {customFields.map((field) => (
                    <div key={field.id} className="flex gap-3 items-start">
                      <div className="flex-1 grid gap-3 md:grid-cols-2">
                        <Input
                          value={field.key}
                          onChange={(e) => updateCustomField(field.id, e.target.value, field.value)}
                          placeholder="Field name (e.g., client_id, client_secret, redirect_uri)"
                          disabled={providerData?.is_system || isLoading}
                        />
                        <Input
                          value={field.value}
                          onChange={(e) => updateCustomField(field.id, field.key, e.target.value)}
                          placeholder="Field value"
                          disabled={providerData?.is_system || isLoading}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomField(field.id)}
                        className="text-destructive hover:text-destructive"
                        disabled={providerData?.is_system || isLoading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Custom Field Button */}
              <Button
                type="button"
                variant="outline"
                onClick={addCustomField}
                disabled={providerData?.is_system || isLoading}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Custom Field
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/${tenantId}/providers/social`)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <FormSubmitButton
              isSubmitting={isLoading || isSubmitting}
              disabled={providerData?.is_system}
              submittingText="Saving..."
              submitText={isEditing ? "Update Provider" : "Create Provider"}
            />
          </div>
        </form>
      </div>
    </DetailsContainer>
  )
}
