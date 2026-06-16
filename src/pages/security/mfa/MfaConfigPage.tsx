import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@/components/ui/button'
import { DetailsContainer } from '@/components/container'
import { Save, Smartphone } from 'lucide-react'
import { FormSwitchField, FormInputField, FormSelectField, FormCheckboxField } from '@/components/form'
import { SettingsCard } from '@/components/card'
import { useMfaConfig, useUpdateMfaConfig } from '@/hooks/useMfaConfig'
import { useToast } from '@/hooks/useToast'
import * as yup from 'yup'
import type { MfaConfigPayload } from '@/services/api/mfa-config/types'


const ALL_METHODS = [
  { value: 'totp', label: 'Authenticator App (TOTP)' },
  { value: 'webauthn', label: 'Passkeys (WebAuthn)' },
  { value: 'sms', label: 'SMS' },
  { value: 'email_otp', label: 'Email OTP' },
  { value: 'recovery_code', label: 'Recovery Codes' },
] as const

const MODE_OPTIONS = [
  { value: 'disabled', label: 'Disabled' },
  { value: 'optional', label: 'Optional' },
  { value: 'enforced', label: 'Enforced' },
]

const DIGITS_OPTIONS = [
  { value: '6', label: '6 digits' },
  { value: '8', label: '8 digits' },
]

const mfaConfigSchema = yup.object({
  mode: yup.string().oneOf(['disabled', 'optional', 'enforced']).required(),
  allowed_methods: yup.array().of(yup.string().defined()).min(1, 'Select at least one method').required(),
  preferred_method: yup.string().required(),
  totp_issuer: yup.string().required(),
  totp_digits: yup.number().oneOf([6, 8]).required(),
  totp_period_seconds: yup.number().min(30).max(90).required(),
  trusted_device_period_days: yup.number().min(0).required(),
  grace_period_days: yup.number().min(0).required(),
  recovery_codes_count: yup.number().min(0).max(16).required(),
  admin_grace_period_days: yup.number().min(0).required(),
  allow_sms: yup.boolean().required(),
  require_mfa_for_sensitive_actions: yup.boolean().required(),
  step_up_ttl_minutes: yup.number().min(1).max(60).required(),
})

type MfaConfigFormData = yup.InferType<typeof mfaConfigSchema>

export default function MfaConfigPage() {
  const { showSuccess, showError } = useToast()
  const { data: savedConfig, isLoading } = useMfaConfig()
  const updateMutation = useUpdateMfaConfig()

  const { handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<MfaConfigFormData>({
    resolver: yupResolver(mfaConfigSchema),
    defaultValues: {
      mode: 'optional',
      allowed_methods: ['totp', 'webauthn', 'recovery_code'],
      preferred_method: 'webauthn',
      totp_issuer: 'Lula',
      totp_digits: 6,
      totp_period_seconds: 30,
      trusted_device_period_days: 14,
      grace_period_days: 30,
      recovery_codes_count: 10,
      admin_grace_period_days: 0,
      allow_sms: false,
      require_mfa_for_sensitive_actions: true,
      step_up_ttl_minutes: 5,
    },
    mode: 'onSubmit',
  })

  const formValues = watch()
  const allowedMethods = formValues.allowed_methods || []

  useEffect(() => {
    if (savedConfig) {
      reset({
        mode: (savedConfig.mode ?? 'optional') as MfaConfigFormData['mode'],
        allowed_methods: savedConfig.allowed_methods ?? ['totp', 'webauthn', 'recovery_code'],
        preferred_method: savedConfig.preferred_method ?? 'webauthn',
        totp_issuer: savedConfig.totp_issuer ?? 'Lula',
        totp_digits: savedConfig.totp_digits ?? 6,
        totp_period_seconds: savedConfig.totp_period_seconds ?? 30,
        trusted_device_period_days: savedConfig.trusted_device_period_days ?? 14,
        grace_period_days: savedConfig.grace_period_days ?? 30,
        recovery_codes_count: savedConfig.recovery_codes_count ?? 10,
        admin_grace_period_days: savedConfig.admin_grace_period_days ?? 0,
        allow_sms: savedConfig.allow_sms ?? false,
        require_mfa_for_sensitive_actions: savedConfig.require_mfa_for_sensitive_actions ?? true,
        step_up_ttl_minutes: savedConfig.step_up_ttl_minutes ?? 5,
      })
    }
  }, [savedConfig, reset])

  const handleUpdate = (updates: Partial<MfaConfigFormData>) => {
    Object.entries(updates).forEach(([key, value]) => {
      setValue(key as keyof MfaConfigFormData, value, { shouldValidate: false, shouldDirty: true })
    })
  }

  const toggleMethod = (method: string, checked: boolean) => {
    const updated = checked
      ? [...allowedMethods, method]
      : allowedMethods.filter((m) => m !== method)
    handleUpdate({ allowed_methods: updated })

    if (!checked && formValues.preferred_method === method) {
      const next = updated[0] || 'totp'
      handleUpdate({ preferred_method: next })
    }
  }

  const preferredMethods = ALL_METHODS.filter((m) => allowedMethods.includes(m.value))
    .map((m) => ({ value: m.value, label: m.label }))

  const onSubmit = async (data: MfaConfigFormData) => {
    try {
      const payload: MfaConfigPayload = { ...data }
      await updateMutation.mutateAsync(payload)
      showSuccess('MFA configuration saved successfully')
    } catch (error) {
      showError(error)
    }
  }

  if (isLoading) {
    return (
      <DetailsContainer>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-muted-foreground">Loading MFA configuration...</p>
        </div>
      </DetailsContainer>
    )
  }

  return (
    <DetailsContainer>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">MFA</h1>
          <p className="text-muted-foreground">
            Configure multi-factor authentication enforcement, allowed methods, and device trust policies.
          </p>
        </div>

        <div className="grid gap-6">
          <SettingsCard
            title="Enforcement"
            description="Set the global MFA requirement level for all users."
            icon={Smartphone}
          >
            <FormSelectField
              label="Mode"
              options={MODE_OPTIONS}
              value={formValues.mode}
              onValueChange={(v) => handleUpdate({ mode: v as MfaConfigFormData['mode'] })}
              error={errors.mode?.message}
            />
          </SettingsCard>

          <SettingsCard
            title="Allowed Methods"
            description="Select which MFA factors users may enroll and use."
          >
            <div className="space-y-2">
              {errors.allowed_methods?.message && (
                <p className="text-sm text-red-600">{errors.allowed_methods.message}</p>
              )}
              <div className="grid gap-2 sm:grid-cols-2">
                {ALL_METHODS.map((method) => (
                  <FormCheckboxField
                    key={method.value}
                    label={method.label}
                    checked={allowedMethods.includes(method.value)}
                    onCheckedChange={(checked) => toggleMethod(method.value, checked)}
                  />
                ))}
              </div>
            </div>
            <div className="mt-4">
              <FormSelectField
                label="Preferred Method"
                description="Default MFA method offered to users"
                options={preferredMethods.length > 0 ? preferredMethods : [{ value: '', label: '—' }]}
                value={formValues.preferred_method}
                onValueChange={(v) => handleUpdate({ preferred_method: v })}
                error={errors.preferred_method?.message}
                disabled={preferredMethods.length === 0}
              />
            </div>
          </SettingsCard>

          <SettingsCard
            title="TOTP Parameters"
            description="Time-based One-Time Password configuration."
          >
            <div className="grid gap-4 md:grid-cols-3">
              <FormInputField
                label="Issuer"
                value={formValues.totp_issuer}
                onChange={(e) => handleUpdate({ totp_issuer: e.target.value })}
                error={errors.totp_issuer?.message}
              />
              <FormSelectField
                label="Digits"
                options={DIGITS_OPTIONS}
                value={String(formValues.totp_digits)}
                onValueChange={(v) => handleUpdate({ totp_digits: Number(v) })}
                error={errors.totp_digits?.message}
              />
              <FormInputField
                label="Period (seconds)"
                type="number"
                value={formValues.totp_period_seconds.toString()}
                onChange={(e) => handleUpdate({ totp_period_seconds: parseInt(e.target.value) || 30 })}
                error={errors.totp_period_seconds?.message}
              />
            </div>
          </SettingsCard>

          <SettingsCard
            title="Trust & Recovery"
            description="Trusted device windows, enrollment grace periods, and backup codes."
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <FormInputField
                label="Trusted Device (days)"
                description="0 disables"
                type="number"
                value={formValues.trusted_device_period_days.toString()}
                onChange={(e) => handleUpdate({ trusted_device_period_days: parseInt(e.target.value) || 0 })}
                error={errors.trusted_device_period_days?.message}
              />
              <FormInputField
                label="Enrollment Grace (days)"
                type="number"
                value={formValues.grace_period_days.toString()}
                onChange={(e) => handleUpdate({ grace_period_days: parseInt(e.target.value) || 0 })}
                error={errors.grace_period_days?.message}
              />
              <FormInputField
                label="Recovery Codes"
                description="0 or 8–16"
                type="number"
                value={formValues.recovery_codes_count.toString()}
                onChange={(e) => handleUpdate({ recovery_codes_count: parseInt(e.target.value) || 0 })}
                error={errors.recovery_codes_count?.message}
              />
              <FormInputField
                label="Admin Grace (days)"
                type="number"
                value={formValues.admin_grace_period_days.toString()}
                onChange={(e) => handleUpdate({ admin_grace_period_days: parseInt(e.target.value) || 0 })}
                error={errors.admin_grace_period_days?.message}
              />
            </div>
          </SettingsCard>

          <SettingsCard
            title="Options"
            description="Additional MFA behavior controls."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <FormSwitchField
                label="Allow SMS"
                description="Permit SMS-based MFA enrollment"
                checked={formValues.allow_sms}
                onCheckedChange={(v) => handleUpdate({ allow_sms: v })}
              />
              <FormSwitchField
                label="Step-Up for Sensitive Actions"
                description="Require fresh MFA for email changes and admin operations"
                checked={formValues.require_mfa_for_sensitive_actions}
                onCheckedChange={(v) => handleUpdate({ require_mfa_for_sensitive_actions: v })}
              />
            </div>
            <div className="mt-4">
              <FormInputField
                label="Step-Up TTL (minutes)"
                description="How long a step-up token remains fresh (1–60)"
                type="number"
                value={formValues.step_up_ttl_minutes.toString()}
                onChange={(e) => handleUpdate({ step_up_ttl_minutes: parseInt(e.target.value) || 5 })}
                error={errors.step_up_ttl_minutes?.message}
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
