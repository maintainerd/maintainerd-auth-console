import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@/components/ui/button'
import { DetailsContainer } from '@/components/container'
import { Save } from 'lucide-react'
import { FormSwitchField } from '@/components/form'
import { SettingsCard } from '@/components/card'
import { useFeatureFlags, useUpdateFeatureFlags } from '@/hooks/useFeatureFlags'
import { useToast } from '@/hooks/useToast'
import { featureFlagsSchema, type FeatureFlagsFormData } from '@/lib/validations'

export default function FeatureFlagsPage() {
  const { showSuccess, showError } = useToast()
  const { data: savedConfig, isLoading } = useFeatureFlags()
  const updateMutation = useUpdateFeatureFlags()

  const { handleSubmit, reset, watch, setValue, formState: { isSubmitting } } = useForm<FeatureFlagsFormData>({
    resolver: yupResolver(featureFlagsSchema),
    defaultValues: { enable_passwordless_login: false, enable_email_sending: true, enable_sms_sending: false, enable_social_logins: false, enable_audit_export: false, enable_advanced_analytics: false, enable_experimental_features: false },
    mode: 'onSubmit',
  })

  const formValues = watch()

  useEffect(() => {
    if (savedConfig) reset({
      enable_passwordless_login: savedConfig.enable_passwordless_login ?? false, enable_email_sending: savedConfig.enable_email_sending ?? true,
      enable_sms_sending: savedConfig.enable_sms_sending ?? false, enable_social_logins: savedConfig.enable_social_logins ?? false,
      enable_audit_export: savedConfig.enable_audit_export ?? false, enable_advanced_analytics: savedConfig.enable_advanced_analytics ?? false,
      enable_experimental_features: savedConfig.enable_experimental_features ?? false,
    })
  }, [savedConfig, reset])

  const handleUpdate = (updates: Partial<FeatureFlagsFormData>) => {
    Object.entries(updates).forEach(([key, value]) => {
      setValue(key as keyof FeatureFlagsFormData, value, { shouldValidate: false, shouldDirty: true })
    })
  }

  const onSubmit = async (data: FeatureFlagsFormData) => {
    try { await updateMutation.mutateAsync(data); showSuccess('Feature flags saved successfully') }
    catch (error) { showError(error) }
  }

  if (isLoading) {
    return (
      <DetailsContainer>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-muted-foreground">Loading feature flags...</p>
        </div>
      </DetailsContainer>
    )
  }

  return (
    <DetailsContainer>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Feature Flags</h1>
          <p className="text-muted-foreground">
            Toggle runtime features — passwordless login, email/SMS sending, social logins, analytics, and experiments.
          </p>
        </div>

        <div className="grid gap-6">
          <SettingsCard title="Authentication" description="Control login and authentication features.">
            <div className="space-y-4">
              <FormSwitchField
                label="Passwordless Login"
                description="Allow users to sign in via magic link."
                checked={formValues.enable_passwordless_login}
                onCheckedChange={(v) => handleUpdate({ enable_passwordless_login: v })}
              />
              <FormSwitchField
                label="Social Logins"
                description="Allow sign-in via Google, GitHub, and other social providers."
                checked={formValues.enable_social_logins}
                onCheckedChange={(v) => handleUpdate({ enable_social_logins: v })}
              />
            </div>
          </SettingsCard>

          <SettingsCard title="Messaging" description="Control email and SMS sending capabilities.">
            <div className="space-y-4">
              <FormSwitchField
                label="Email Sending"
                description="Enable transactional email delivery (invites, password resets, verification)."
                checked={formValues.enable_email_sending}
                onCheckedChange={(v) => handleUpdate({ enable_email_sending: v })}
              />
              <FormSwitchField
                label="SMS Sending"
                description="Enable SMS OTP delivery and notifications."
                checked={formValues.enable_sms_sending}
                onCheckedChange={(v) => handleUpdate({ enable_sms_sending: v })}
              />
            </div>
          </SettingsCard>

          <SettingsCard title="Data & Analytics" description="Control audit exports and analytics features.">
            <div className="space-y-4">
              <FormSwitchField
                label="Audit Export"
                description="Allow exporting audit logs."
                checked={formValues.enable_audit_export}
                onCheckedChange={(v) => handleUpdate({ enable_audit_export: v })}
              />
              <FormSwitchField
                label="Advanced Analytics"
                description="Enable detailed analytics dashboards."
                checked={formValues.enable_advanced_analytics}
                onCheckedChange={(v) => handleUpdate({ enable_advanced_analytics: v })}
              />
            </div>
          </SettingsCard>

          <SettingsCard title="Experiments" description="Experimental features under development.">
            <FormSwitchField
              label="Experimental Features"
              description="Enable features still under active development. May be unstable."
              checked={formValues.enable_experimental_features}
              onCheckedChange={(v) => handleUpdate({ enable_experimental_features: v })}
            />
          </SettingsCard>

          <div className="flex justify-end">
            <Button type="submit" className="min-w-[140px] px-6" disabled={updateMutation.isPending || isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {updateMutation.isPending || isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </DetailsContainer>
  )
}
