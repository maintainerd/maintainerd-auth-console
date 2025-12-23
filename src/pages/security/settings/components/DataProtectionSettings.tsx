import { SettingsCard } from "@/components/card"
import { FormSwitchField, FormSelectField, type SelectOption } from "@/components/form"
import { Database } from "lucide-react"
import type { BaseSettingsProps } from "./types"
import type { SecuritySettingsFormData } from "@/lib/validations"
import { Controller } from "react-hook-form"
import type { Control } from "react-hook-form"

interface DataProtectionSettingsProps extends BaseSettingsProps {
  settings: SecuritySettingsFormData
  control: Control<SecuritySettingsFormData>
}

const DATA_RETENTION_OPTIONS: SelectOption[] = [
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
  { value: "180", label: "180 days" },
  { value: "365", label: "1 year" },
  { value: "1095", label: "3 years" },
  { value: "2555", label: "7 years" },
]

export function DataProtectionSettings({ settings, control, onUpdate, errors }: DataProtectionSettingsProps) {
  return (
    <SettingsCard
      title="Data Protection"
      description="Configure encryption and data retention policies"
      icon={Database}
      contentClassName="space-y-4"
    >
      <FormSwitchField
          label="Encryption at rest"
          description="Encrypt stored data using AES-256 encryption"
          checked={settings.encryptionAtRest ?? true}
          onCheckedChange={(checked) => onUpdate({ encryptionAtRest: checked })}
        />

        <FormSwitchField
          label="Encryption in transit"
          description="Enforce TLS 1.3 for all data transmission"
          checked={settings.encryptionInTransit ?? true}
          onCheckedChange={(checked) => onUpdate({ encryptionInTransit: checked })}
        />

        <Controller
          name="dataRetentionDays"
          control={control}
          render={({ field }) => (
            <FormSelectField
              key={`dataRetentionDays-${field.value || 'empty'}`}
              label="Data retention period (days)"
              description="Automatically delete user data and logs after this period"
              options={DATA_RETENTION_OPTIONS}
              value={field.value?.toString()}
              onValueChange={(value) => field.onChange(parseInt(value))}
              error={errors?.dataRetentionDays?.message}
              className="w-48"
            />
          )}
        />

        <FormSwitchField
          label="Automatic backups"
          description="Create encrypted backups of critical data daily"
          checked={settings.automaticBackups ?? true}
          onCheckedChange={(checked) => onUpdate({ automaticBackups: checked })}
        />

        {settings.automaticBackups && (
          <div className="pl-4 border-l-2 border-muted">
            <FormSwitchField
              label="Backup encryption"
              description="Encrypt backup files with separate encryption keys"
              checked={settings.backupEncryption ?? true}
              onCheckedChange={(checked) => onUpdate({ backupEncryption: checked })}
            />
          </div>
        )}
    </SettingsCard>
  )
}
