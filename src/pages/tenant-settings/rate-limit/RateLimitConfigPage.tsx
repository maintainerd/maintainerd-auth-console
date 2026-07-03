import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@/components/ui/button'
import { DetailsContainer } from '@/components/container'
import { Save } from 'lucide-react'
import { FormSwitchField, FormInputField } from '@/components/form'
import { SettingsCard } from '@/components/card'
import { useRateLimitConfig, useUpdateRateLimitConfig } from '@/hooks/useRateLimitConfig'
import { useToast } from '@/hooks/useToast'
import { rateLimitConfigSchema, type RateLimitConfigFormData } from '@/lib/validations'

export default function RateLimitConfigPage() {
  const { showSuccess, showError } = useToast()
  const { data: savedConfig, isLoading, isError } = useRateLimitConfig()
  const updateMutation = useUpdateRateLimitConfig()

  const { handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<RateLimitConfigFormData>({
    resolver: yupResolver(rateLimitConfigSchema),
    defaultValues: { enabled: false, requests_per_window: 100, window_duration_seconds: 60, per_ip: true, per_api_key: true },
    mode: 'onSubmit',
  })

  const formValues = watch()

  useEffect(() => {
    if (savedConfig) reset({
      enabled: savedConfig.enabled ?? false, requests_per_window: savedConfig.requests_per_window ?? 100,
      window_duration_seconds: savedConfig.window_duration_seconds ?? 60, per_ip: savedConfig.per_ip ?? true,
      per_api_key: savedConfig.per_api_key ?? true,
    })
  }, [savedConfig, reset])

  const handleUpdate = (updates: Partial<RateLimitConfigFormData>) => {
    Object.entries(updates).forEach(([key, value]) => {
      setValue(key as keyof RateLimitConfigFormData, value, { shouldValidate: false, shouldDirty: true })
    })
  }

  const onSubmit = async (data: RateLimitConfigFormData) => {
    try { await updateMutation.mutateAsync(data); showSuccess('Rate limit config saved successfully') }
    catch (error) { showError(error) }
  }

  if (isLoading) {
    return (
      <DetailsContainer>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-muted-foreground">Loading rate limit configuration...</p>
        </div>
      </DetailsContainer>
    )
  }

  if (isError) {
    return (
      <DetailsContainer>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-sm text-destructive">Failed to load rate limit configuration.</p>
        </div>
      </DetailsContainer>
    )
  }

  return (
    <DetailsContainer>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Rate Limit Config</h1>
          <p className="text-muted-foreground">
            Control API request throttling — set global limits, per-IP caps, and per-endpoint overrides.
          </p>
        </div>

        <div className="grid gap-6">
          <SettingsCard title="General" description="Enable or disable rate limiting.">
            <FormSwitchField
              label="Enabled"
              description="When enabled, requests exceeding configured limits will be rejected."
              checked={formValues.enabled}
              onCheckedChange={(v) => handleUpdate({ enabled: v })}
            />
          </SettingsCard>

          <SettingsCard title="Thresholds" description="Define the rate limiting window and request cap.">
            <div className="grid gap-4 md:grid-cols-2">
              <FormInputField
                label="Requests per Window"
                type="number"
                value={formValues.requests_per_window.toString()}
                onChange={(e) => handleUpdate({ requests_per_window: parseInt(e.target.value) || 1 })}
                error={errors.requests_per_window?.message}
              />
              <FormInputField
                label="Window Duration (seconds)"
                type="number"
                value={formValues.window_duration_seconds.toString()}
                onChange={(e) => handleUpdate({ window_duration_seconds: parseInt(e.target.value) || 1 })}
                error={errors.window_duration_seconds?.message}
              />
            </div>
          </SettingsCard>

          <SettingsCard title="Scope" description="Apply rate limits per IP address and/or per API key.">
            <div className="space-y-4">
              <FormSwitchField
                label="Per IP"
                description="Track and limit requests per unique IP address."
                checked={formValues.per_ip}
                onCheckedChange={(v) => handleUpdate({ per_ip: v })}
              />
              <FormSwitchField
                label="Per API Key"
                description="Track and limit requests per API key."
                checked={formValues.per_api_key}
                onCheckedChange={(v) => handleUpdate({ per_api_key: v })}
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
