/**
 * Real-time Monitoring Component
 */

import { Controller } from 'react-hook-form'
import { FormSelectField } from '@/components/form'
import { FormSwitchField } from '@/components/form/FormSwitchField'
import { SettingsCard } from '@/components/card/SettingsCard'
import { Activity } from 'lucide-react'
import type { BaseThreatDetectionSettingsProps } from './types'

export function RealTimeMonitoring({ control }: BaseThreatDetectionSettingsProps) {
  return (
    <SettingsCard
      icon={Activity}
      title="Real-time Monitoring"
      description="Configure real-time threat monitoring and alert systems"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Controller
          name="realTimeAlertsEnabled"
          control={control}
          render={({ field }) => (
            <FormSwitchField
              label="Real-time alerts"
              description="Instant threat notifications"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />

        <Controller
          name="autoBlockSuspiciousIPs"
          control={control}
          render={({ field }) => (
            <FormSwitchField
              label="Auto-block suspicious IPs"
              description="Automatically block threat sources"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />

        <Controller
          name="alertAdminsEnabled"
          control={control}
          render={({ field }) => (
            <FormSwitchField
              label="Alert administrators"
              description="Notify admins of threats"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />

        <Controller
          name="logSuspiciousActivity"
          control={control}
          render={({ field }) => (
            <FormSwitchField
              label="Log suspicious activity"
              description="Record all threat events"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>

      <Controller
        name="suspiciousActivityThreshold"
        control={control}
        render={({ field }) => (
          <FormSelectField
            key={`suspiciousActivityThreshold-${field.value || 'empty'}`}
            label="Suspicious activity threshold"
            value={field.value || ''}
            onValueChange={(value) => field.onChange(value)}
            options={[
              { label: 'Low sensitivity', value: 'low' },
              { label: 'Medium sensitivity', value: 'medium' },
              { label: 'High sensitivity', value: 'high' },
              { label: 'Critical only', value: 'critical' },
            ]}
          />
        )}
      />
    </SettingsCard>
  )
}
