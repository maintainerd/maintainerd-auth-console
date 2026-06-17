import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@/components/ui/button'
import { DetailsContainer } from '@/components/container'
import { Save } from 'lucide-react'
import { FormSwitchField, FormInputField } from '@/components/form'
import { SettingsCard } from '@/components/card'
import { useAuditConfig, useUpdateAuditConfig } from '@/hooks/useAuditConfig'
import { useToast } from '@/hooks/useToast'
import { auditConfigSchema, type AuditConfigFormData } from '@/lib/validations'

const LOG_LEVELS = [{ value: 'debug', label: 'Debug' }, { value: 'info', label: 'Info' }, { value: 'warn', label: 'Warn' }, { value: 'error', label: 'Error' }]
const EXPORT_FORMATS = [{ value: 'json', label: 'JSON' }, { value: 'csv', label: 'CSV' }, { value: 'pdf', label: 'PDF' }]

export default function AuditConfigPage() {
  const { showSuccess, showError } = useToast()
  const { data: savedConfig, isLoading } = useAuditConfig()
  const updateMutation = useUpdateAuditConfig()

  const { handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<AuditConfigFormData>({
    resolver: yupResolver(auditConfigSchema),
    defaultValues: { enabled: false, retention_days: 90, gdpr_mode: false, pii_masking: false, log_level: 'info', export_format: 'json' },
    mode: 'onSubmit',
  })

  const formValues = watch()

  useEffect(() => {
    if (savedConfig) reset({
      enabled: savedConfig.enabled ?? false, retention_days: savedConfig.retention_days ?? 90,
      gdpr_mode: savedConfig.gdpr_mode ?? false, pii_masking: savedConfig.pii_masking ?? false,
      log_level: savedConfig.log_level ?? 'info', export_format: savedConfig.export_format ?? 'json',
    })
  }, [savedConfig, reset])

  const handleUpdate = (updates: Partial<AuditConfigFormData>) => {
    Object.entries(updates).forEach(([key, value]) => {
      setValue(key as keyof AuditConfigFormData, value, { shouldValidate: false, shouldDirty: true })
    })
  }

  const onSubmit = async (data: AuditConfigFormData) => {
    try { await updateMutation.mutateAsync(data); showSuccess('Audit config saved successfully') }
    catch (error) { showError(error) }
  }

  if (isLoading) {
    return (
      <DetailsContainer>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-muted-foreground">Loading audit configuration...</p>
        </div>
      </DetailsContainer>
    )
  }

  return (
    <DetailsContainer>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Audit Config</h1>
          <p className="text-muted-foreground">
            Configure audit logging behavior — retention period, GDPR mode, PII masking, and log level.
          </p>
        </div>

        <div className="grid gap-6">
          <SettingsCard title="General" description="Enable or disable audit logging.">
            <FormSwitchField
              label="Enabled"
              description="When enabled, audit events will be recorded."
              checked={formValues.enabled}
              onCheckedChange={(v) => handleUpdate({ enabled: v })}
            />
          </SettingsCard>

          <SettingsCard title="Retention & Privacy" description="Configure audit log retention and privacy settings.">
            <div className="grid gap-4 md:grid-cols-2">
              <FormInputField
                label="Retention (days)"
                type="number"
                value={formValues.retention_days.toString()}
                onChange={(e) => handleUpdate({ retention_days: parseInt(e.target.value) || 1 })}
                error={errors.retention_days?.message}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">Log Level</label>
                <select
                  value={formValues.log_level}
                  onChange={(e) => handleUpdate({ log_level: e.target.value })}
                  className="flex h-11 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {LOG_LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
                {errors.log_level && <p className="text-sm text-destructive">{errors.log_level.message}</p>}
              </div>
            </div>
            <div className="space-y-4 mt-4">
              <FormSwitchField
                label="GDPR Mode"
                description="Restrict logging to comply with GDPR requirements."
                checked={formValues.gdpr_mode}
                onCheckedChange={(v) => handleUpdate({ gdpr_mode: v })}
              />
              <FormSwitchField
                label="PII Masking"
                description="Mask personally identifiable information in audit logs."
                checked={formValues.pii_masking}
                onCheckedChange={(v) => handleUpdate({ pii_masking: v })}
              />
            </div>
          </SettingsCard>

          <SettingsCard title="Export" description="Configure audit log export format.">
            <div className="space-y-2">
              <label className="text-sm font-medium">Export Format</label>
              <select
                value={formValues.export_format}
                onChange={(e) => handleUpdate({ export_format: e.target.value })}
                className="flex h-11 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {EXPORT_FORMATS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
              {errors.export_format && <p className="text-sm text-destructive">{errors.export_format.message}</p>}
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
