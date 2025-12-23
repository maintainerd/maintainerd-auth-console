/**
 * Machine Learning Component
 */

import { Controller } from 'react-hook-form'
import { FormSwitchField } from '@/components/form/FormSwitchField'
import { SettingsCard } from '@/components/card/SettingsCard'
import { TrendingUp } from 'lucide-react'
import type { BaseThreatDetectionSettingsProps } from './types'

export function MachineLearning({ control }: BaseThreatDetectionSettingsProps) {
  return (
    <SettingsCard
      icon={TrendingUp}
      title="Machine Learning"
      description="Advanced AI-powered threat detection and behavioral analysis"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Controller
          name="mlThreatDetection"
          control={control}
          render={({ field }) => (
            <FormSwitchField
              label="ML threat detection"
              description="AI-powered threat identification"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />

        <Controller
          name="adaptiveLearning"
          control={control}
          render={({ field }) => (
            <FormSwitchField
              label="Adaptive learning"
              description="Learn from new threat patterns"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />

        <Controller
          name="riskScoring"
          control={control}
          render={({ field }) => (
            <FormSwitchField
              label="Risk scoring"
              description="Calculate threat risk levels"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />

        <Controller
          name="behaviorBaselines"
          control={control}
          render={({ field }) => (
            <FormSwitchField
              label="Behavior baselines"
              description="Establish normal user patterns"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>
    </SettingsCard>
  )
}
