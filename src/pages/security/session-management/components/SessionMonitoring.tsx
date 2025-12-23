/**
 * Session Monitoring Component
 */

import { Controller } from 'react-hook-form'
import { FormSwitchField } from '@/components/form/FormSwitchField'
import { SettingsCard } from '@/components/card/SettingsCard'
import { Monitor } from 'lucide-react'
import type { BaseSessionSettingsProps } from './types'

export function SessionMonitoring({ control }: BaseSessionSettingsProps) {
  return (
    <SettingsCard
      icon={Monitor}
      title="Session Monitoring"
      description="Configure session tracking and suspicious activity detection"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Controller
          name="sessionLoggingEnabled"
          control={control}
          render={({ field }) => (
            <FormSwitchField
              label="Session logging"
              description="Log session events"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />

        <Controller
          name="suspiciousSessionDetection"
          control={control}
          render={({ field }) => (
            <FormSwitchField
              label="Suspicious session detection"
              description="Detect unusual patterns"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />

        <Controller
          name="geoLocationTracking"
          control={control}
          render={({ field }) => (
            <FormSwitchField
              label="Geo-location tracking"
              description="Track login locations"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />

        <Controller
          name="deviceFingerprintingEnabled"
          control={control}
          render={({ field }) => (
            <FormSwitchField
              label="Device fingerprinting"
              description="Track device characteristics"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>
    </SettingsCard>
  )
}
