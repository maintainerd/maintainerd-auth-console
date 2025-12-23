/**
 * Anomaly Detection Component
 */

import { Controller } from 'react-hook-form'
import { FormSwitchField } from '@/components/form/FormSwitchField'
import { SettingsCard } from '@/components/card/SettingsCard'
import { Eye } from 'lucide-react'
import type { BaseThreatDetectionSettingsProps } from './types'

export function AnomalyDetection({ control, watch }: BaseThreatDetectionSettingsProps) {
  const anomalyDetectionEnabled = watch('anomalyDetectionEnabled')

  return (
    <SettingsCard
      icon={Eye}
      title="Anomaly Detection"
      description="Identify unusual user behavior and suspicious activity patterns"
    >
      <Controller
        name="anomalyDetectionEnabled"
        control={control}
        render={({ field }) => (
          <FormSwitchField
            label="Enable anomaly detection"
            description="Monitor for unusual behavior patterns"
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        )}
      />

      {anomalyDetectionEnabled && (
        <div className="grid gap-3 pl-4 border-l-2 border-muted sm:grid-cols-2">
          <Controller
            name="behaviorAnalysis"
            control={control}
            render={({ field }) => (
              <FormSwitchField
                label="Behavior analysis"
                description="Analyze user behavior patterns"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />

          <Controller
            name="velocityChecking"
            control={control}
            render={({ field }) => (
              <FormSwitchField
                label="Velocity checking"
                description="Detect rapid successive actions"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />

          <Controller
            name="geoAnomalyDetection"
            control={control}
            render={({ field }) => (
              <FormSwitchField
                label="Geo-location anomalies"
                description="Detect impossible travel patterns"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />

          <Controller
            name="deviceAnomalyDetection"
            control={control}
            render={({ field }) => (
              <FormSwitchField
                label="Device anomalies"
                description="Detect unusual device patterns"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>
      )}
    </SettingsCard>
  )
}
