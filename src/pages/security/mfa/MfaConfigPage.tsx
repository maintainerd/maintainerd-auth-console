import { useParams, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { DetailsContainer } from '@/components/container'
import { FormPageHeader } from '@/components/header'
import { FormSwitchField, FormInputField, FormSelectField, FormCheckboxField, FormSubmitButton } from '@/components/form'
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
  allow_email_otp: yup.boolean().required(),
  require_mfa_for_sensitive_actions: yup.boolean().required(),
  step_up_ttl_minutes: yup.number().min(1).max(60).required(),
})

type MfaConfigFormData = yup.InferType<typeof mfaConfigSchema>

export default function MfaConfigPage() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const backTo = `/${tenantId}/security/mfa`

  const { data: savedConfig, isLoading } = useMfaConfig()
  const updateMutation = useUpdateMfaConfig()

  const { handleSubmit, watch, setValue, control, formState: { errors, isSubmitting } } = useForm<MfaConfigFormData>({
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
      allow_email_otp: false,
      require_mfa_for_sensitive_actions: true,
      step_up_ttl_minutes: 5,
    },
    values: savedConfig ? {
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
      allow_email_otp: savedConfig.allow_email_otp ?? false,
      require_mfa_for_sensitive_actions: savedConfig.require_mfa_for_sensitive_actions ?? true,
      step_up_ttl_minutes: savedConfig.step_up_ttl_minutes ?? 5,
    } : undefined,
    mode: 'onSubmit',
  })

  const formValues = watch()
  const allowedMethods = formValues.allowed_methods || []

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

    if (method === 'sms') {
      handleUpdate({ allow_sms: checked })
    }
    if (method === 'email_otp') {
      handleUpdate({ allow_email_otp: checked })
    }

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
      navigate(backTo)
    } catch (error) {
      showError(error)
    }
  }

  const isBusy = isSubmitting || updateMutation.isPending

  if (isLoading) {
    return (
      <DetailsContainer>
        <div className="flex flex-col gap-6">
          <FormPageHeader backUrl={backTo} backLabel="Back to Multi-Factor Auth" title="Configure MFA" description="Set MFA enforcement, methods, and policies." />
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

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        <FormPageHeader
          backUrl={backTo}
          backLabel="Back to Multi-Factor Auth"
          title="Configure MFA"
          description="Configure multi-factor authentication enforcement, allowed methods, and device trust policies."
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="text-base">Enforcement & Methods</CardTitle>
              <p className="text-sm text-muted-foreground">Set the global MFA requirement level and which factors users may enroll.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Controller
                name="mode"
                control={control}
                render={({ field }) => (
                  <FormSelectField
                    label="Mode"
                    options={MODE_OPTIONS}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={errors.mode?.message}
                    disabled={isBusy}
                  />
                )}
              />
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
                      disabled={isBusy}
                    />
                  ))}
                </div>
              </div>
              <Controller
                name="preferred_method"
                control={control}
                render={({ field }) => (
                  <FormSelectField
                    label="Preferred Method"
                    description="Default MFA method offered to users"
                    options={preferredMethods.length > 0 ? preferredMethods : [{ value: '', label: '—' }]}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={errors.preferred_method?.message}
                    disabled={isBusy || preferredMethods.length === 0}
                  />
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="text-base">TOTP Parameters</CardTitle>
              <p className="text-sm text-muted-foreground">Time-based One-Time Password configuration.</p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <FormInputField
                  label="Issuer"
                  value={formValues.totp_issuer}
                  onChange={(e) => handleUpdate({ totp_issuer: e.target.value })}
                  error={errors.totp_issuer?.message}
                  disabled={isBusy}
                />
                <Controller
                  name="totp_digits"
                  control={control}
                  render={({ field }) => (
                    <FormSelectField
                      label="Digits"
                      options={DIGITS_OPTIONS}
                      value={String(field.value)}
                      onValueChange={(v) => field.onChange(Number(v))}
                      error={errors.totp_digits?.message}
                      disabled={isBusy}
                    />
                  )}
                />
                <FormInputField
                  label="Period (seconds)"
                  type="number"
                  value={formValues.totp_period_seconds.toString()}
                  onChange={(e) => handleUpdate({ totp_period_seconds: parseInt(e.target.value) || 30 })}
                  error={errors.totp_period_seconds?.message}
                  disabled={isBusy}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="text-base">Trust, Recovery & Options</CardTitle>
              <p className="text-sm text-muted-foreground">Trusted device windows, enrollment grace periods, backup codes, and behavior controls.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <FormInputField
                  label="Trusted Device (days)"
                  description="0 disables"
                  type="number"
                  value={formValues.trusted_device_period_days.toString()}
                  onChange={(e) => handleUpdate({ trusted_device_period_days: parseInt(e.target.value) || 0 })}
                  error={errors.trusted_device_period_days?.message}
                  disabled={isBusy}
                />
                <FormInputField
                  label="Enrollment Grace (days)"
                  type="number"
                  value={formValues.grace_period_days.toString()}
                  onChange={(e) => handleUpdate({ grace_period_days: parseInt(e.target.value) || 0 })}
                  error={errors.grace_period_days?.message}
                  disabled={isBusy}
                />
                <FormInputField
                  label="Recovery Codes"
                  description="0 or 8–16"
                  type="number"
                  value={formValues.recovery_codes_count.toString()}
                  onChange={(e) => handleUpdate({ recovery_codes_count: parseInt(e.target.value) || 0 })}
                  error={errors.recovery_codes_count?.message}
                  disabled={isBusy}
                />
                <FormInputField
                  label="Admin Grace (days)"
                  type="number"
                  value={formValues.admin_grace_period_days.toString()}
                  onChange={(e) => handleUpdate({ admin_grace_period_days: parseInt(e.target.value) || 0 })}
                  error={errors.admin_grace_period_days?.message}
                  disabled={isBusy}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <FormSwitchField label="Allow SMS" description="Permit SMS-based MFA enrollment" checked={formValues.allow_sms} onCheckedChange={(v) => handleUpdate({ allow_sms: v })} disabled={isBusy} />
                <FormSwitchField label="Allow Email OTP" description="Permit email OTP-based MFA enrollment" checked={formValues.allow_email_otp} onCheckedChange={(v) => handleUpdate({ allow_email_otp: v })} disabled={isBusy} />
                <FormSwitchField label="Step-Up for Sensitive Actions" description="Require fresh MFA for email changes and admin operations" checked={formValues.require_mfa_for_sensitive_actions} onCheckedChange={(v) => handleUpdate({ require_mfa_for_sensitive_actions: v })} disabled={isBusy} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <FormInputField
                  label="Step-Up TTL (minutes)"
                  description="How long a step-up token remains fresh (1–60)"
                  type="number"
                  value={formValues.step_up_ttl_minutes.toString()}
                  onChange={(e) => handleUpdate({ step_up_ttl_minutes: parseInt(e.target.value) || 5 })}
                  error={errors.step_up_ttl_minutes?.message}
                  disabled={isBusy}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate(backTo)} disabled={isBusy}>
              Cancel
            </Button>
            <FormSubmitButton isSubmitting={isBusy} submitText="Save Changes" />
          </div>
        </form>
      </div>
    </DetailsContainer>
  )
}
