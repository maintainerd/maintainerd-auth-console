/**
 * Threat Detection Settings Page
 */

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@/components/ui/button'
import { DetailsContainer } from '@/components/container'
import { useThreatDetectionSettings, useUpdateThreatDetectionSettings } from '@/hooks/useThreatDetectionSettings'
import { useToast } from '@/hooks/useToast'
import { threatDetectionSettingsSchema, type ThreatDetectionSettingsFormData } from '@/lib/validations/threatDetectionSettingsSchema'
import { BruteForceProtection } from './components/BruteForceProtection'
import { AnomalyDetection } from './components/AnomalyDetection'
import { BotProtection } from './components/BotProtection'
import { RealTimeMonitoring } from './components/RealTimeMonitoring'
import { MachineLearning } from './components/MachineLearning'
import { ResponseActions } from './components/ResponseActions'

export default function ThreatDetectionPage() {
  const { data: savedSettings, isLoading, error } = useThreatDetectionSettings()
  const { mutateAsync: updateSettings, isPending } = useUpdateThreatDetectionSettings()
  const { showSuccess, showError } = useToast()

  const { control, handleSubmit, watch, formState, reset } = useForm<ThreatDetectionSettingsFormData>({
    resolver: yupResolver(threatDetectionSettingsSchema),
    defaultValues: {
      bruteForceEnabled: true,
      maxFailedAttempts: 5,
      bruteForceWindow: 15,
      accountLockoutDuration: 30,
      anomalyDetectionEnabled: true,
      behaviorAnalysis: true,
      velocityChecking: true,
      geoAnomalyDetection: true,
      deviceAnomalyDetection: true,
      botProtectionEnabled: true,
      captchaEnabled: true,
      userAgentFiltering: true,
      honeypotEnabled: false,
      realTimeAlertsEnabled: true,
      suspiciousActivityThreshold: 'medium',
      autoBlockSuspiciousIPs: false,
      alertAdminsEnabled: true,
      logSuspiciousActivity: true,
      mlThreatDetection: true,
      adaptiveLearning: true,
      riskScoring: true,
      behaviorBaselines: true,
      autoResponseEnabled: true,
      escalationEnabled: true,
      quarantineEnabled: false,
      notificationChannels: ['email', 'webhook'],
    },
  })

  // Load saved settings when data is fetched
  useEffect(() => {
    if (savedSettings) {
      const formData: ThreatDetectionSettingsFormData = {
        bruteForceEnabled: savedSettings.bruteForceEnabled ?? true,
        maxFailedAttempts: savedSettings.maxFailedAttempts ?? 5,
        bruteForceWindow: savedSettings.bruteForceWindow ?? 15,
        accountLockoutDuration: savedSettings.accountLockoutDuration ?? 30,
        anomalyDetectionEnabled: savedSettings.anomalyDetectionEnabled ?? true,
        behaviorAnalysis: savedSettings.behaviorAnalysis ?? true,
        velocityChecking: savedSettings.velocityChecking ?? true,
        geoAnomalyDetection: savedSettings.geoAnomalyDetection ?? true,
        deviceAnomalyDetection: savedSettings.deviceAnomalyDetection ?? true,
        botProtectionEnabled: savedSettings.botProtectionEnabled ?? true,
        captchaEnabled: savedSettings.captchaEnabled ?? true,
        userAgentFiltering: savedSettings.userAgentFiltering ?? true,
        honeypotEnabled: savedSettings.honeypotEnabled ?? false,
        realTimeAlertsEnabled: savedSettings.realTimeAlertsEnabled ?? true,
        suspiciousActivityThreshold: savedSettings.suspiciousActivityThreshold ?? 'medium',
        autoBlockSuspiciousIPs: savedSettings.autoBlockSuspiciousIPs ?? false,
        alertAdminsEnabled: savedSettings.alertAdminsEnabled ?? true,
        logSuspiciousActivity: savedSettings.logSuspiciousActivity ?? true,
        mlThreatDetection: savedSettings.mlThreatDetection ?? true,
        adaptiveLearning: savedSettings.adaptiveLearning ?? true,
        riskScoring: savedSettings.riskScoring ?? true,
        behaviorBaselines: savedSettings.behaviorBaselines ?? true,
        autoResponseEnabled: savedSettings.autoResponseEnabled ?? true,
        escalationEnabled: savedSettings.escalationEnabled ?? true,
        quarantineEnabled: savedSettings.quarantineEnabled ?? false,
        notificationChannels: savedSettings.notificationChannels ?? ['email', 'webhook'],
      }
      
      reset(formData)
    }
  }, [savedSettings, reset])

  const onSubmit = async (data: ThreatDetectionSettingsFormData) => {
    try {
      await updateSettings({
        brute_force_enabled: data.bruteForceEnabled,
        max_failed_attempts: data.maxFailedAttempts,
        brute_force_window: data.bruteForceWindow,
        account_lockout_duration: data.accountLockoutDuration,
        anomaly_detection_enabled: data.anomalyDetectionEnabled,
        behavior_analysis: data.behaviorAnalysis,
        velocity_checking: data.velocityChecking,
        geo_anomaly_detection: data.geoAnomalyDetection,
        device_anomaly_detection: data.deviceAnomalyDetection,
        bot_protection_enabled: data.botProtectionEnabled,
        captcha_enabled: data.captchaEnabled,
        user_agent_filtering: data.userAgentFiltering,
        honeypot_enabled: data.honeypotEnabled,
        real_time_alerts_enabled: data.realTimeAlertsEnabled,
        suspicious_activity_threshold: data.suspiciousActivityThreshold,
        auto_block_suspicious_ips: data.autoBlockSuspiciousIPs,
        alert_admins_enabled: data.alertAdminsEnabled,
        log_suspicious_activity: data.logSuspiciousActivity,
        ml_threat_detection: data.mlThreatDetection,
        adaptive_learning: data.adaptiveLearning,
        risk_scoring: data.riskScoring,
        behavior_baselines: data.behaviorBaselines,
        auto_response_enabled: data.autoResponseEnabled,
        escalation_enabled: data.escalationEnabled,
        quarantine_enabled: data.quarantineEnabled,
        notification_channels: data.notificationChannels,
      })
      showSuccess('Threat detection settings updated successfully')
    } catch {
      showError('Failed to update threat detection settings')
    }
  }

  if (isLoading) {
    return (
      <DetailsContainer>
        <div className="flex h-64 items-center justify-center">
          <p className="text-muted-foreground">Loading threat detection settings...</p>
        </div>
      </DetailsContainer>
    )
  }

  if (error) {
    return (
      <DetailsContainer>
        <div className="flex h-64 items-center justify-center">
          <p className="text-destructive">Failed to load threat detection settings</p>
        </div>
      </DetailsContainer>
    )
  }

  return (
    <DetailsContainer>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Threat Detection</h1>
          <p className="text-muted-foreground">
            Configure advanced threat detection, anomaly monitoring, and automated response systems to protect against security attacks.
          </p>
        </div>

        <div className="grid gap-6">
          <BruteForceProtection control={control} watch={watch} />
          <AnomalyDetection control={control} watch={watch} />
          <BotProtection control={control} watch={watch} />
          <RealTimeMonitoring control={control} watch={watch} />
          <MachineLearning control={control} watch={watch} />
          <ResponseActions control={control} watch={watch} />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
            disabled={isPending || formState.isSubmitting}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isPending || formState.isSubmitting}>
            {isPending || formState.isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </DetailsContainer>
  )
}
