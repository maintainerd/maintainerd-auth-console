import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DetailsContainer } from "@/components/container"
import { FormPageHeader } from "@/components/header"
import {
  FormInputField,
  FormSelectField,
  FormSubmitButton,
  type SelectOption
} from "@/components/form"
import { ProviderConfigSection, useProviderConfig } from "@/components/provider-config"
import { socialProviderSchema, type SocialProviderFormData } from "@/lib/validations"
import { useAppSelector } from "@/store/hooks"
import { useIdentityProvider, useCreateIdentityProvider, useUpdateIdentityProvider } from "@/hooks/useIdentityProviders"
import { useToast } from "@/hooks/useToast"
import type { ProviderOption, IdentityProviderStatus } from "@/services/api/identity-providers/types"

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

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
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

  // Dynamic, provider-aware configuration. Re-renders its fields whenever the
  // selected provider changes; both the well-known and additional fields are
  // merged into a single `config` JSON on save.
  const selectedProvider = watch("provider")
  const providerConfig = useProviderConfig(selectedProvider)

  // Load existing provider data if editing
  useEffect(() => {
    if (isEditing && providerData) {
      reset({
        name: providerData.name,
        displayName: providerData.display_name,
        provider: providerData.provider as 'google' | 'facebook' | 'github',
        status: providerData.status as 'active' | 'inactive',
      })

      providerConfig.load(providerData.config, providerData.provider)
    }
    // providerConfig.load is stable; intentionally keyed to the fetched record
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, providerData, reset])

  const onSubmit = async (formData: SocialProviderFormData) => {
    if (!currentTenant) {
      showError("Tenant information not available")
      return
    }

    if (!providerConfig.validate()) {
      showError("Please complete the required provider configuration fields.")
      return
    }

    try {
      const config = providerConfig.buildConfig()

      if (isEditing && providerId) {
        const updateData = {
          name: formData.name,
          display_name: formData.displayName,
          provider: formData.provider as ProviderOption,
          provider_type: 'social' as const,
          config,
          status: formData.status as IdentityProviderStatus,
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
          status: formData.status as IdentityProviderStatus,
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
  const fieldsDisabled = providerData?.is_system || isLoading

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
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="text-base">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormInputField
                label="Name"
                placeholder="e.g., google-workspace, github-oauth"
                description="Lowercase letters, numbers, and hyphens only"
                disabled={fieldsDisabled}
                error={errors.name?.message}
                required
                {...register("name")}
              />

              <FormInputField
                label="Display Name"
                placeholder="e.g., Sign in with Google, GitHub"
                description="This will be the display name shown to users"
                disabled={fieldsDisabled}
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
                      disabled={fieldsDisabled}
                      error={errors.provider?.message}
                      description="Changing the provider updates the configuration fields below"
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
                      disabled={fieldsDisabled}
                      error={errors.status?.message}
                      required
                    />
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Provider-aware configuration */}
          <ProviderConfigSection
            provider={selectedProvider}
            controller={providerConfig}
            disabled={fieldsDisabled}
          />

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
