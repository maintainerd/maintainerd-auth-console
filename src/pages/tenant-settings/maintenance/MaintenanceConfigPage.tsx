import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@/components/ui/button'
import { DetailsContainer } from '@/components/container'
import { Save } from 'lucide-react'
import { FormSwitchField, FormInputField } from '@/components/form'
import { SettingsCard } from '@/components/card'
import { useMaintenanceConfig, useUpdateMaintenanceConfig } from '@/hooks/useMaintenanceConfig'
import { useToast } from '@/hooks/useToast'
import { maintenanceConfigSchema, type MaintenanceConfigFormData } from '@/lib/validations'

export default function MaintenanceConfigPage() {
  const { showSuccess, showError } = useToast()
  const { data: savedConfig, isLoading } = useMaintenanceConfig()
  const updateMutation = useUpdateMaintenanceConfig()

  const { handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<MaintenanceConfigFormData>({
    resolver: yupResolver(maintenanceConfigSchema),
    defaultValues: { enabled: false, message: 'The system is currently undergoing maintenance. Please try again later.', scheduled_start: null, scheduled_end: null },
    mode: 'onSubmit',
  })

  const formValues = watch()

  useEffect(() => {
    if (savedConfig) reset({
      enabled: savedConfig.enabled ?? false, message: savedConfig.message ?? '',
      scheduled_start: savedConfig.scheduled_start ?? null, scheduled_end: savedConfig.scheduled_end ?? null,
    })
  }, [savedConfig, reset])

  const handleUpdate = (updates: Partial<MaintenanceConfigFormData>) => {
    Object.entries(updates).forEach(([key, value]) => {
      setValue(key as keyof MaintenanceConfigFormData, value, { shouldValidate: false, shouldDirty: true })
    })
  }

  const onSubmit = async (data: MaintenanceConfigFormData) => {
    try { await updateMutation.mutateAsync(data); showSuccess('Maintenance config saved successfully') }
    catch (error) { showError(error) }
  }

  if (isLoading) {
    return (
      <DetailsContainer>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-muted-foreground">Loading maintenance configuration...</p>
        </div>
      </DetailsContainer>
    )
  }

  return (
    <DetailsContainer>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Maintenance Config</h1>
          <p className="text-muted-foreground">
            Manage maintenance mode — toggle on/off, set a custom message, and define bypass IPs.
          </p>
        </div>

        <div className="grid gap-6">
          <SettingsCard title="Maintenance Mode" description="Toggle maintenance mode on or off.">
            <FormSwitchField
              label="Enabled"
              description="When enabled, users will see the maintenance message and be unable to access the application."
              checked={formValues.enabled}
              onCheckedChange={(v) => handleUpdate({ enabled: v })}
            />
          </SettingsCard>

          <SettingsCard title="Message" description="The message shown to users during maintenance.">
            <FormInputField
              label="Maintenance Message"
              value={formValues.message}
              onChange={(e) => handleUpdate({ message: e.target.value })}
              error={errors.message?.message}
            />
          </SettingsCard>

          <SettingsCard title="Schedule (optional)" description="Set scheduled start and end times for maintenance.">
            <div className="grid gap-4 md:grid-cols-2">
              <FormInputField
                label="Scheduled Start"
                type="datetime-local"
                value={formValues.scheduled_start ?? ''}
                onChange={(e) => handleUpdate({ scheduled_start: e.target.value || null })}
                error={errors.scheduled_start?.message}
              />
              <FormInputField
                label="Scheduled End"
                type="datetime-local"
                value={formValues.scheduled_end ?? ''}
                onChange={(e) => handleUpdate({ scheduled_end: e.target.value || null })}
                error={errors.scheduled_end?.message}
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
