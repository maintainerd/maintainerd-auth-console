import { Button } from "@/components/ui/button"
import { DetailsContainer } from "@/components/container"
import { useGeneralSecuritySettings, useUpdateGeneralSecuritySettings } from "@/hooks/useSecuritySettings"
import { useToast } from "@/hooks/useToast"
import { Save } from "lucide-react"
import * as React from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { securitySettingsSchema, type SecuritySettingsFormData } from "@/lib/validations"
import type { GeneralSecuritySettingsPayload } from "@/services/api/security-settings/types"
import {
  MfaSettings,
  LoginMethodsSettings,
  DataProtectionSettings,
  ComplianceSettings,
  AdvancedSecuritySettings,
  NotificationSettings
} from "./components"

export default function SecuritySettingsPage() {
  const { showSuccess, showError } = useToast()
  const { data: savedSettings, isLoading, isError } = useGeneralSecuritySettings()
  const updateSettingsMutation = useUpdateGeneralSecuritySettings()

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting }
  } = useForm<SecuritySettingsFormData>({
    resolver: yupResolver(securitySettingsSchema),
    defaultValues: {
      // Multi-Factor Authentication
      mfaRequired: true,
      mfaMethods: ["authenticator", "sms"],
      
      // Login Methods
      passwordlessLogin: false,
      socialLoginEnabled: true,
      requireEmailVerification: true,
      allowPasswordReset: true,
      
      // Notifications
      securityNotifications: true,
      suspiciousActivityAlerts: true,
      
      // Data Protection
      encryptionAtRest: true,
      encryptionInTransit: true,
      dataRetentionDays: 365,
      automaticBackups: true,
      backupEncryption: true,
      
      // Compliance
      complianceMode: "standard",
      
      // Advanced Security
      deviceTrustEnabled: false,
      anonymousAnalytics: true
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })

  // Watch all form values
  const formValues = watch()

  // Load saved settings when data is fetched
  React.useEffect(() => {
    if (savedSettings) {
      console.log('Loading saved settings:', savedSettings)
      console.log('complianceMode from savedSettings:', savedSettings.complianceMode)
      
      const formData = {
        // Multi-Factor Authentication
        mfaRequired: savedSettings.mfaRequired ?? true,
        mfaMethods: savedSettings.mfaMethods ?? ["authenticator", "sms"],
        
        // Login Methods
        passwordlessLogin: savedSettings.passwordlessLogin ?? false,
        socialLoginEnabled: savedSettings.socialLoginEnabled ?? true,
        requireEmailVerification: savedSettings.requireEmailVerification ?? true,
        allowPasswordReset: savedSettings.allowPasswordReset ?? true,
        
        // Notifications
        securityNotifications: savedSettings.securityNotifications ?? true,
        suspiciousActivityAlerts: savedSettings.suspiciousActivityAlerts ?? true,
        
        // Data Protection
        encryptionAtRest: savedSettings.encryptionAtRest ?? true,
        encryptionInTransit: savedSettings.encryptionInTransit ?? true,
        dataRetentionDays: savedSettings.dataRetentionDays ?? 365,
        automaticBackups: savedSettings.automaticBackups ?? true,
        backupEncryption: savedSettings.backupEncryption ?? true,
        
        // Compliance
        complianceMode: savedSettings.complianceMode ?? "standard",
        
        // Advanced Security
        deviceTrustEnabled: savedSettings.deviceTrustEnabled ?? false,
        anonymousAnalytics: savedSettings.anonymousAnalytics ?? true
      }
      
      console.log('Form data to reset:', formData)
      console.log('complianceMode in formData:', formData.complianceMode)
      reset(formData)
    }
  }, [savedSettings, reset])

  const handleUpdate = (updates: Partial<SecuritySettingsFormData>) => {
    console.log('handleUpdate called with:', updates)
    Object.entries(updates).forEach(([key, value]) => {
      console.log(`Setting ${key} to:`, value)
      setValue(key as keyof SecuritySettingsFormData, value, { 
        shouldValidate: false,
        shouldDirty: true 
      })
    })
  }

  const onSubmit = async (data: SecuritySettingsFormData) => {
    try {
      console.log('Form data before submit:', data)
      console.log('complianceMode before submit:', data.complianceMode)
      
      // Explicitly map fields to snake_case for backend
      const payload: GeneralSecuritySettingsPayload = {
        mfa_required: data.mfaRequired,
        mfa_methods: data.mfaMethods,
        passwordless_login: data.passwordlessLogin,
        social_login_enabled: data.socialLoginEnabled,
        require_email_verification: data.requireEmailVerification,
        allow_password_reset: data.allowPasswordReset,
        security_notifications: data.securityNotifications,
        suspicious_activity_alerts: data.suspiciousActivityAlerts,
        encryption_at_rest: data.encryptionAtRest,
        encryption_in_transit: data.encryptionInTransit,
        data_retention_days: data.dataRetentionDays,
        automatic_backups: data.automaticBackups,
        backup_encryption: data.backupEncryption,
        compliance_mode: data.complianceMode,
        device_trust_enabled: data.deviceTrustEnabled,
        anonymous_analytics: data.anonymousAnalytics
      }
      
      console.log('Payload to send:', payload)
      console.log('compliance_mode in payload:', payload.compliance_mode)
      
      await updateSettingsMutation.mutateAsync(payload)
      showSuccess('Security settings saved successfully')
    } catch (error) {
      showError(error)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <DetailsContainer>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Loading...</h2>
            <p className="text-muted-foreground mt-2">
              Fetching security settings
            </p>
          </div>
        </div>
      </DetailsContainer>
    )
  }

  // Error state
  if (isError) {
    return (
      <DetailsContainer>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Error Loading Settings</h2>
            <p className="text-muted-foreground mt-2">
              Failed to load security settings. Please try again.
            </p>
          </div>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </DetailsContainer>
    )
  }

  return (
    <DetailsContainer>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Security Settings</h1>
          <p className="text-muted-foreground">
            Configure global security settings and authentication requirements for your application.
          </p>
        </div>

        <div className="grid gap-6">
          <MfaSettings settings={formValues} onUpdate={handleUpdate} errors={errors} />
          <LoginMethodsSettings settings={formValues} onUpdate={handleUpdate} errors={errors} />
          <DataProtectionSettings settings={formValues} control={control} onUpdate={handleUpdate} errors={errors} />
          <ComplianceSettings settings={formValues} control={control} onUpdate={handleUpdate} errors={errors} />
          <AdvancedSecuritySettings settings={formValues} onUpdate={handleUpdate} errors={errors} />
          <NotificationSettings settings={formValues} onUpdate={handleUpdate} errors={errors} />

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            type="submit"
            className="min-w-[140px] px-6"
            disabled={updateSettingsMutation.isPending || isSubmitting}
          >
            <Save className="mr-2 h-4 w-4" />
            {updateSettingsMutation.isPending || isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
        </div>
      </form>
    </DetailsContainer>
  )
}
