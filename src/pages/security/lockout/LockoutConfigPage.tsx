import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@/components/ui/button'
import { DetailsContainer } from '@/components/container'
import { Save } from 'lucide-react'
import { FormSwitchField, FormInputField } from '@/components/form'
import { SettingsCard } from '@/components/card'
import { useLockoutConfig, useUpdateLockoutConfig } from '@/hooks/useLockoutConfig'
import { useToast } from '@/hooks/useToast'
import { lockoutConfigSchema, type LockoutConfigFormData } from '@/lib/validations'


export default function LockoutConfigPage() {
  const { showSuccess, showError } = useToast()
  const { data: savedConfig, isLoading } = useLockoutConfig()
  const updateMutation = useUpdateLockoutConfig()

  const { handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<LockoutConfigFormData>({
    resolver: yupResolver(lockoutConfigSchema),
    defaultValues: {
      enabled: true,
      max_failed_attempts: 5,
      lockout_duration_minutes: 30,
      progressive_lockout: true,
      auto_unlock: true,
      reset_count_on_success: true,
      observation_window_minutes: 15,
      max_lockout_duration_minutes: 60,
      progression_reset_hours: 24,
      notify_user_on_lockout: true,
    },
    mode: 'onSubmit',
  })

  const formValues = watch()

  useEffect(() => {
    if (savedConfig) {
      reset({
        enabled: savedConfig.enabled ?? true,
        max_failed_attempts: savedConfig.max_failed_attempts ?? 5,
        lockout_duration_minutes: savedConfig.lockout_duration_minutes ?? 30,
        progressive_lockout: savedConfig.progressive_lockout ?? true,
        auto_unlock: savedConfig.auto_unlock ?? true,
        reset_count_on_success: savedConfig.reset_count_on_success ?? true,
        observation_window_minutes: savedConfig.observation_window_minutes ?? 15,
        max_lockout_duration_minutes: savedConfig.max_lockout_duration_minutes ?? 60,
        progression_reset_hours: savedConfig.progression_reset_hours ?? 24,
        notify_user_on_lockout: savedConfig.notify_user_on_lockout ?? true,
      })
    }
  }, [savedConfig, reset])

  const handleUpdate = (updates: Partial<LockoutConfigFormData>) => {
    Object.entries(updates).forEach(([key, value]) => {
      setValue(key as keyof LockoutConfigFormData, value, { shouldValidate: false, shouldDirty: true })
    })
  }

  const onSubmit = async (data: LockoutConfigFormData) => {
    try {
      await updateMutation.mutateAsync(data)
      showSuccess('Lockout config saved successfully')
    } catch (error) {
      showError(error)
    }
  }

  if (isLoading) {
    return (
      <DetailsContainer>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-muted-foreground">Loading lockout configuration...</p>
        </div>
      </DetailsContainer>
    )
  }

  return (
    <DetailsContainer>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Account Lockout</h1>
          <p className="text-muted-foreground">
            Configure failed-login lockout policies, progressive escalation, and auto-unlock behavior.
          </p>
        </div>

        <div className="grid gap-6">
          <SettingsCard
            title="Lockout Policy"
            description="Set thresholds and duration for account lockouts."
          >
            <div className="space-y-4">
              <FormSwitchField
                label="Enable Lockout"
                description="Enable account lockout after repeated failed login attempts"
                checked={formValues.enabled}
                onCheckedChange={(checked) => handleUpdate({ enabled: checked })}
                error={errors.enabled?.message}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <FormInputField
                  label="Max Failed Attempts"
                  type="number"
                  value={formValues.max_failed_attempts.toString()}
                  onChange={(e) => handleUpdate({ max_failed_attempts: parseInt(e.target.value) || 1 })}
                  error={errors.max_failed_attempts?.message}
                />
                <FormInputField
                  label="Lockout Duration (minutes)"
                  type="number"
                  value={formValues.lockout_duration_minutes.toString()}
                  onChange={(e) => handleUpdate({ lockout_duration_minutes: parseInt(e.target.value) || 1 })}
                  error={errors.lockout_duration_minutes?.message}
                />
                <FormInputField
                  label="Observation Window (minutes)"
                  type="number"
                  value={formValues.observation_window_minutes.toString()}
                  onChange={(e) => handleUpdate({ observation_window_minutes: parseInt(e.target.value) || 1 })}
                  error={errors.observation_window_minutes?.message}
                />
                <FormInputField
                  label="Max Lockout Duration (minutes)"
                  type="number"
                  value={formValues.max_lockout_duration_minutes.toString()}
                  onChange={(e) => handleUpdate({ max_lockout_duration_minutes: parseInt(e.target.value) || 1 })}
                  error={errors.max_lockout_duration_minutes?.message}
                />
              </div>
            </div>
          </SettingsCard>

          <SettingsCard
            title="Progressive Lockout"
            description="Escalate lockout duration on repeated lockouts."
          >
            <div className="space-y-4">
              <FormSwitchField
                label="Progressive Lockout"
                description="Increase lockout duration with each successive lockout"
                checked={formValues.progressive_lockout}
                onCheckedChange={(checked) => handleUpdate({ progressive_lockout: checked })}
              />
              <FormInputField
                label="Progression Reset (hours)"
                type="number"
                value={formValues.progression_reset_hours.toString()}
                onChange={(e) => handleUpdate({ progression_reset_hours: parseInt(e.target.value) || 1 })}
                error={errors.progression_reset_hours?.message}
              />
            </div>
          </SettingsCard>

          <SettingsCard
            title="Behavior"
            description="Additional lockout behavior settings."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <FormSwitchField
                label="Auto Unlock After Duration"
                description="Automatically unlock after the lockout duration expires"
                checked={formValues.auto_unlock}
                onCheckedChange={(checked) => handleUpdate({ auto_unlock: checked })}
              />
              <FormSwitchField
                label="Reset Count On Success"
                description="Reset failed attempt counter on successful login"
                checked={formValues.reset_count_on_success}
                onCheckedChange={(checked) => handleUpdate({ reset_count_on_success: checked })}
              />
              <FormSwitchField
                label="Notify User On Lockout"
                description="Send notification to the user when their account is locked"
                checked={formValues.notify_user_on_lockout}
                onCheckedChange={(checked) => handleUpdate({ notify_user_on_lockout: checked })}
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
