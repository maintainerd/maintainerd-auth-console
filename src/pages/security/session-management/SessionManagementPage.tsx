import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@/components/ui/button'
import { DetailsContainer } from '@/components/container'
import { Save, Clock } from 'lucide-react'
import { FormSwitchField, FormInputField, FormSelectField } from '@/components/form'
import { SettingsCard } from '@/components/card'
import { useSessionSettings, useUpdateSessionSettings } from '@/hooks/useSessionSettings'
import { useToast } from '@/hooks/useToast'
import { sessionSettingsSchema, type SessionSettingsFormData } from '@/lib/validations'

const SWITCH_CLASS = 'data-[state=checked]:bg-blue-600'

const SAME_SITE_OPTIONS = [
  { value: 'Strict', label: 'Strict' },
  { value: 'Lax', label: 'Lax' },
  { value: 'None', label: 'None (requires Secure)' },
]

export default function SessionManagementPage() {
  const { showSuccess, showError } = useToast()
  const { data: saved, isLoading } = useSessionSettings()
  const updateMutation = useUpdateSessionSettings()

  const { handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<SessionSettingsFormData>({
    resolver: yupResolver(sessionSettingsSchema),
    defaultValues: {
      access_token_ttl_minutes: 15,
      refresh_token_ttl_days: 30,
      max_concurrent_sessions: 5,
      idle_timeout_minutes: 30,
      absolute_timeout_hours: 24,
      rotate_refresh_tokens: true,
      refresh_token_reuse_interval_seconds: 10,
      cookie_secure: true,
      cookie_http_only: true,
      cookie_same_site: 'Lax',
      revoke_sessions_on_password_change: true,
    },
    mode: 'onSubmit',
  })

  const formValues = watch()

  useEffect(() => {
    if (saved) {
      reset({
        access_token_ttl_minutes: saved.access_token_ttl_minutes ?? 15,
        refresh_token_ttl_days: saved.refresh_token_ttl_days ?? 30,
        max_concurrent_sessions: saved.max_concurrent_sessions ?? 5,
        idle_timeout_minutes: saved.idle_timeout_minutes ?? 30,
        absolute_timeout_hours: saved.absolute_timeout_hours ?? 24,
        rotate_refresh_tokens: saved.rotate_refresh_tokens ?? true,
        refresh_token_reuse_interval_seconds: saved.refresh_token_reuse_interval_seconds ?? 10,
        cookie_secure: saved.cookie_secure ?? true,
        cookie_http_only: saved.cookie_http_only ?? true,
        cookie_same_site: saved.cookie_same_site ?? 'Lax',
        revoke_sessions_on_password_change: saved.revoke_sessions_on_password_change ?? true,
      })
    }
  }, [saved, reset])

  const handleUpdate = (updates: Partial<SessionSettingsFormData>) => {
    Object.entries(updates).forEach(([key, value]) => {
      setValue(key as keyof SessionSettingsFormData, value, { shouldValidate: false, shouldDirty: true })
    })
  }

  const onSubmit = async (data: SessionSettingsFormData) => {
    try {
      await updateMutation.mutateAsync(data)
      showSuccess('Session settings saved successfully')
    } catch (error) {
      showError(error)
    }
  }

  if (isLoading) {
    return (
      <DetailsContainer>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-muted-foreground">Loading session settings...</p>
        </div>
      </DetailsContainer>
    )
  }

  return (
    <DetailsContainer>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Sessions</h1>
          <p className="text-muted-foreground">
            Configure token lifetimes, idle/absolute timeouts, concurrency, refresh rotation, and cookie flags.
          </p>
        </div>

        <div className="grid gap-6">
          <SettingsCard
            title="Token Lifetimes"
            description="Set how long access and refresh tokens remain valid."
            icon={Clock}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormInputField
                label="Access Token TTL (minutes)"
                description="1–60 minutes"
                type="number"
                value={formValues.access_token_ttl_minutes.toString()}
                onChange={(e) => handleUpdate({ access_token_ttl_minutes: parseInt(e.target.value) || 1 })}
                error={errors.access_token_ttl_minutes?.message}
              />
              <FormInputField
                label="Refresh Token TTL (days)"
                description="1–365 days"
                type="number"
                value={formValues.refresh_token_ttl_days.toString()}
                onChange={(e) => handleUpdate({ refresh_token_ttl_days: parseInt(e.target.value) || 1 })}
                error={errors.refresh_token_ttl_days?.message}
              />
            </div>
          </SettingsCard>

          <SettingsCard
            title="Timeouts & Concurrency"
            description="Idle and absolute session limits. Set concurrency to 0 for unlimited."
          >
            <div className="grid gap-4 md:grid-cols-3">
              <FormInputField
                label="Idle Timeout (minutes)"
                type="number"
                value={formValues.idle_timeout_minutes.toString()}
                onChange={(e) => handleUpdate({ idle_timeout_minutes: parseInt(e.target.value) || 1 })}
                error={errors.idle_timeout_minutes?.message}
              />
              <FormInputField
                label="Absolute Timeout (hours)"
                type="number"
                value={formValues.absolute_timeout_hours.toString()}
                onChange={(e) => handleUpdate({ absolute_timeout_hours: parseInt(e.target.value) || 1 })}
                error={errors.absolute_timeout_hours?.message}
              />
              <FormInputField
                label="Max Concurrent Sessions"
                description="0 = unlimited"
                type="number"
                value={formValues.max_concurrent_sessions.toString()}
                onChange={(e) => handleUpdate({ max_concurrent_sessions: parseInt(e.target.value) || 0 })}
                error={errors.max_concurrent_sessions?.message}
              />
            </div>
          </SettingsCard>

          <SettingsCard
            title="Refresh Rotation"
            description="Single-use refresh tokens with reuse detection and family revocation."
          >
            <div className="space-y-4">
              <FormSwitchField
                label="Rotate Refresh Tokens"
                description="Issue a new refresh token on every refresh; replaying a consumed token revokes the entire token family"
                checked={formValues.rotate_refresh_tokens}
                onCheckedChange={(v) => handleUpdate({ rotate_refresh_tokens: v })}
                switchClassName={SWITCH_CLASS}
              />
              <FormInputField
                label="Reuse Grace (seconds)"
                description="Replay window before family revocation (0 = instant)"
                type="number"
                value={formValues.refresh_token_reuse_interval_seconds.toString()}
                onChange={(e) => handleUpdate({ refresh_token_reuse_interval_seconds: parseInt(e.target.value) || 0 })}
                error={errors.refresh_token_reuse_interval_seconds?.message}
              />
            </div>
          </SettingsCard>

          <SettingsCard
            title="Cookie Settings"
            description="Security flags applied to authentication cookies."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <FormSwitchField
                label="Secure"
                description="Only transmit cookies over HTTPS"
                checked={formValues.cookie_secure}
                onCheckedChange={(v) => handleUpdate({ cookie_secure: v })}
                switchClassName={SWITCH_CLASS}
              />
              <FormSwitchField
                label="HttpOnly"
                description="Block JavaScript access to cookies"
                checked={formValues.cookie_http_only}
                onCheckedChange={(v) => handleUpdate({ cookie_http_only: v })}
                switchClassName={SWITCH_CLASS}
              />
              <FormSwitchField
                label="Revoke on Password Change"
                description="Terminate all other sessions when password is changed"
                checked={formValues.revoke_sessions_on_password_change}
                onCheckedChange={(v) => handleUpdate({ revoke_sessions_on_password_change: v })}
                switchClassName={SWITCH_CLASS}
              />
              <FormSelectField
                label="SameSite"
                options={SAME_SITE_OPTIONS}
                value={formValues.cookie_same_site}
                onValueChange={(v) => handleUpdate({ cookie_same_site: v as SessionSettingsFormData['cookie_same_site'] })}
                error={errors.cookie_same_site?.message}
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
