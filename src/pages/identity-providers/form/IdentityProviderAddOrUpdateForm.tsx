import { useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
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
import { ProviderConfigSection, useProviderConfig, PROVIDER_SELECT_OPTIONS, getProviderKind } from "@/components/provider-config"
import { identityProviderSchema, type IdentityProviderFormData } from "@/lib/validations"
import { useAppSelector } from "@/store/hooks"
import { useIdentityProvider, useCreateIdentityProvider, useUpdateIdentityProvider } from "@/hooks/useIdentityProviders"
import { useToast } from "@/hooks/useToast"
import type { ProviderOption, IdentityProviderStatus } from "@/services/api/identity-providers/types"

const PROVIDER_OPTIONS: SelectOption[] = PROVIDER_SELECT_OPTIONS

const STATUS_OPTIONS: SelectOption[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

export default function IdentityProviderAddOrUpdateForm() {
  const { tenantId, providerId } = useParams<{ tenantId: string; providerId?: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { showSuccess, showError } = useToast()
  const currentTenant = useAppSelector((state) => state.tenant.currentTenant)

  const isEditing = Boolean(providerId)

  // Honour where we came from (e.g. the details page) so the back button,
  // cancel, and post-save all return there. Falls back to the listing.
  const navState = location.state as { from?: string; backLabel?: string } | null
  const backTo = navState?.from ?? `/${tenantId}/providers/identity`
  const backLabel = navState?.backLabel ?? "Back to Identity Providers"

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
  } = useForm<IdentityProviderFormData>({
    resolver: yupResolver(identityProviderSchema),
    defaultValues: {
      name: "",
      displayName: "",
      provider: "internal",
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
        provider: providerData.provider,
        status: providerData.status as 'active' | 'inactive',
      })

      providerConfig.load(providerData.config, providerData.provider)
    }
    // providerConfig.load is stable; intentionally keyed to the fetched record
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, providerData, reset])

  const onSubmit = async (formData: IdentityProviderFormData) => {
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

      const providerType = getProviderKind(formData.provider)

      if (isEditing && providerId) {
        const updateData = {
          name: formData.name,
          display_name: formData.displayName,
          provider: formData.provider as ProviderOption,
          provider_type: providerType,
          config,
          status: formData.status as IdentityProviderStatus,
        }
        await updateProviderMutation.mutateAsync({
          identityProviderId: providerId,
          data: updateData
        })
        showSuccess("Identity provider updated successfully")
      } else {
        const createData = {
          name: formData.name,
          display_name: formData.displayName,
          provider: formData.provider as ProviderOption,
          provider_type: providerType,
          config,
          status: formData.status as IdentityProviderStatus,
          tenant_id: currentTenant.tenant_id
        }
        await createProviderMutation.mutateAsync(createData)
        showSuccess("Identity provider created successfully")
      }

      // Navigate back to wherever we came from
      navigate(backTo)
    } catch (error) {
      showError(error, "Failed to save identity provider")
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
              Fetching identity provider details
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
          title={isEditing ? "Edit Identity Provider" : "Create Identity Provider"}
          description={
            isEditing
              ? "Update the identity provider configuration and settings."
              : "Configure a new identity provider to handle user authentication for your application."
          }
          backUrl={backTo}
          backLabel={backLabel}
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
                placeholder="e.g., corporate-auth0, aws-cognito"
                description="Lowercase letters, numbers, and hyphens only"
                disabled={fieldsDisabled}
                error={errors.name?.message}
                required
                {...register("name")}
              />

              <FormInputField
                label="Display Name"
                placeholder="e.g., Corporate Auth0, AWS Cognito"
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
              onClick={() => navigate(backTo)}
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
