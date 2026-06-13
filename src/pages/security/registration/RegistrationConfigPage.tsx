import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@/components/ui/button'
import { DetailsContainer } from '@/components/container'
import { Save } from 'lucide-react'
import { FormSwitchField, FormInputField, FormTextareaField } from '@/components/form'
import { SettingsCard } from '@/components/card'
import { useRegistrationConfig, useUpdateRegistrationConfig } from '@/hooks/useRegistrationConfig'
import { useToast } from '@/hooks/useToast'
import { registrationConfigSchema, type RegistrationConfigFormData } from '@/lib/validations'

const SWITCH_CLASS = 'data-[state=checked]:bg-blue-600'

export default function RegistrationConfigPage() {
  const { showSuccess, showError } = useToast()
  const { data: savedConfig, isLoading } = useRegistrationConfig()
  const updateMutation = useUpdateRegistrationConfig()

  const { handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<RegistrationConfigFormData>({
    resolver: yupResolver(registrationConfigSchema),
    defaultValues: {
      self_registration_enabled: true,
      require_email_verification: true,
      require_phone_verification: false,
      auto_confirm_enabled: false,
      verification_token_ttl_hours: 24,
      default_role: 'registered',
      captcha_on_signup: true,
      registration_rate_limit_per_ip_per_hour: 10,
      allowed_email_domains: [],
      blocked_email_domains: [],
    },
    mode: 'onSubmit',
  })

  const formValues = watch()

  useEffect(() => {
    if (savedConfig) {
      reset({
        self_registration_enabled: savedConfig.self_registration_enabled ?? true,
        require_email_verification: savedConfig.require_email_verification ?? true,
        require_phone_verification: savedConfig.require_phone_verification ?? false,
        auto_confirm_enabled: savedConfig.auto_confirm_enabled ?? false,
        verification_token_ttl_hours: savedConfig.verification_token_ttl_hours ?? 24,
        default_role: savedConfig.default_role ?? 'member',
        captcha_on_signup: savedConfig.captcha_on_signup ?? true,
        registration_rate_limit_per_ip_per_hour: savedConfig.registration_rate_limit_per_ip_per_hour ?? 10,
        allowed_email_domains: savedConfig.allowed_email_domains ?? [],
        blocked_email_domains: savedConfig.blocked_email_domains ?? [],
      })
    }
  }, [savedConfig, reset])

  const handleUpdate = (updates: Partial<RegistrationConfigFormData>) => {
    Object.entries(updates).forEach(([key, value]) => {
      setValue(key as keyof RegistrationConfigFormData, value, { shouldValidate: false, shouldDirty: true })
    })
  }

  const parseDomains = (text: string): string[] =>
    text
      .split(/[\n,]/)
      .map((d) => d.trim().toLowerCase())
      .filter(Boolean)

  const domainsToText = (domains: string[]): string =>
    (domains || []).join('\n')

  const onSubmit = async (data: RegistrationConfigFormData) => {
    try {
      await updateMutation.mutateAsync(data)
      showSuccess('Registration config saved successfully')
    } catch (error) {
      showError(error)
    }
  }

  if (isLoading) {
    return (
      <DetailsContainer>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-muted-foreground">Loading registration configuration...</p>
        </div>
      </DetailsContainer>
    )
  }

  return (
    <DetailsContainer>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Registration</h1>
          <p className="text-muted-foreground">
            Configure self-registration, verification, domain rules, and rate limiting.
          </p>
        </div>

        <div className="grid gap-6">
          <SettingsCard
            title="Registration Settings"
            description="Control how users can register and the default role assigned."
          >
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <FormSwitchField
                  label="Self Registration"
                  description="Allow users to register themselves"
                  checked={formValues.self_registration_enabled}
                  onCheckedChange={(v) => handleUpdate({ self_registration_enabled: v })}
                  switchClassName={SWITCH_CLASS}
                />
                <FormSwitchField
                  label="CAPTCHA on Signup"
                  description="Require reCAPTCHA verification during registration"
                  checked={formValues.captcha_on_signup}
                  onCheckedChange={(v) => handleUpdate({ captcha_on_signup: v })}
                  switchClassName={SWITCH_CLASS}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <FormInputField
                  label="Rate Limit (per IP per hour)"
                  type="number"
                  value={formValues.registration_rate_limit_per_ip_per_hour.toString()}
                  onChange={(e) => handleUpdate({ registration_rate_limit_per_ip_per_hour: parseInt(e.target.value) || 1 })}
                  error={errors.registration_rate_limit_per_ip_per_hour?.message}
                />
                <FormInputField
                  label="Default Role"
                  description="System role assigned to all newly registered users"
                  value={formValues.default_role}
                  disabled
                  readOnly
                />
              </div>
            </div>
          </SettingsCard>

          <SettingsCard
            title="Domain Rules"
            description="Restrict registration to specific email domains. One domain per line. Supports wildcard patterns like *.example.com."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormTextareaField
                label="Allowed Email Domains"
                description="Leave empty to allow all domains"
                value={domainsToText(formValues.allowed_email_domains)}
                onChange={(e) => handleUpdate({ allowed_email_domains: parseDomains(e.target.value) })}
                error={errors.allowed_email_domains?.message}
                rows={5}
              />
              <FormTextareaField
                label="Blocked Email Domains"
                description="Domains explicitly denied (takes precedence over allowed)"
                value={domainsToText(formValues.blocked_email_domains)}
                onChange={(e) => handleUpdate({ blocked_email_domains: parseDomains(e.target.value) })}
                error={errors.blocked_email_domains?.message}
                rows={5}
              />
            </div>
          </SettingsCard>

          <SettingsCard
            title="Verification"
            description="Configure email and phone verification requirements."
          >
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <FormSwitchField
                  label="Require Email Verification"
                  description="Users must verify email before full access"
                  checked={formValues.require_email_verification}
                  onCheckedChange={(v) => handleUpdate({ require_email_verification: v })}
                  switchClassName={SWITCH_CLASS}
                />
                <FormSwitchField
                  label="Require Phone Verification"
                  description="Users must verify phone before full access"
                  checked={formValues.require_phone_verification}
                  onCheckedChange={(v) => handleUpdate({ require_phone_verification: v })}
                  switchClassName={SWITCH_CLASS}
                />
                <FormSwitchField
                  label="Auto-Confirm Accounts"
                  description="Skip verification and immediately activate new accounts"
                  checked={formValues.auto_confirm_enabled}
                  onCheckedChange={(v) => handleUpdate({ auto_confirm_enabled: v })}
                  switchClassName={SWITCH_CLASS}
                />
              </div>
              <FormInputField
                label="Verification Token TTL (hours)"
                type="number"
                value={formValues.verification_token_ttl_hours.toString()}
                onChange={(e) => handleUpdate({ verification_token_ttl_hours: parseInt(e.target.value) || 1 })}
                error={errors.verification_token_ttl_hours?.message}
              />
            </div>
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
