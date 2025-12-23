import { Button } from "@/components/ui/button"
import { DetailsContainer } from "@/components/container"
import { usePasswordPolicies, useUpdatePasswordPolicies } from "@/hooks/usePasswordPolicies"
import { useToast } from "@/hooks/useToast"
import { Save } from "lucide-react"
import * as React from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { passwordPoliciesSchema, type PasswordPoliciesFormData } from "@/lib/validations"
import type { PasswordPoliciesPayload } from "@/services/api/password-policies/types"
import {
  BasicRequirements,
  AdvancedRequirements,
  ExpirationSettings,
  ResetSettings,
  StrengthRequirements
} from "./components"

export default function PasswordPoliciesPage() {
  const { showSuccess, showError } = useToast()
  const { data: savedPolicies, isLoading, isError } = usePasswordPolicies()
  const updatePoliciesMutation = useUpdatePasswordPolicies()

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting }
  } = useForm<PasswordPoliciesFormData>({
    resolver: yupResolver(passwordPoliciesSchema),
    defaultValues: {
      // Basic Requirements
      minLength: 8,
      maxLength: 128,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      allowedSpecialChars: "!@#$%^&*()_+-=[]{}|;:,.<>?",
      
      // Advanced Requirements
      preventCommonPasswords: true,
      preventUserInfoInPassword: true,
      preventSequentialChars: true,
      preventRepeatingChars: true,
      maxRepeatingChars: 3,
      
      // Expiration & History
      passwordExpiration: true,
      expirationDays: 90,
      expirationWarningDays: 14,
      passwordHistory: true,
      historyCount: 12,
      
      // Reset & Recovery
      allowSelfReset: true,
      resetTokenExpiry: 24,
      maxResetAttempts: 3,
      resetCooldown: 15,
      
      // Strength Requirements
      minimumStrengthScore: 3,
      showStrengthMeter: true,
      blockWeakPasswords: true
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })

  // Watch all form values
  const formValues = watch()

  // Load saved policies when data is fetched
  React.useEffect(() => {
    if (savedPolicies) {
      const formData = {
        minLength: savedPolicies.minLength ?? 8,
        maxLength: savedPolicies.maxLength ?? 128,
        requireUppercase: savedPolicies.requireUppercase ?? true,
        requireLowercase: savedPolicies.requireLowercase ?? true,
        requireNumbers: savedPolicies.requireNumbers ?? true,
        requireSpecialChars: savedPolicies.requireSpecialChars ?? true,
        allowedSpecialChars: savedPolicies.allowedSpecialChars ?? "!@#$%^&*()_+-=[]{}|;:,.<>?",
        preventCommonPasswords: savedPolicies.preventCommonPasswords ?? true,
        preventUserInfoInPassword: savedPolicies.preventUserInfoInPassword ?? true,
        preventSequentialChars: savedPolicies.preventSequentialChars ?? true,
        preventRepeatingChars: savedPolicies.preventRepeatingChars ?? true,
        maxRepeatingChars: savedPolicies.maxRepeatingChars ?? 3,
        passwordExpiration: savedPolicies.passwordExpiration ?? true,
        expirationDays: savedPolicies.expirationDays ?? 90,
        expirationWarningDays: savedPolicies.expirationWarningDays ?? 14,
        passwordHistory: savedPolicies.passwordHistory ?? true,
        historyCount: savedPolicies.historyCount ?? 12,
        allowSelfReset: savedPolicies.allowSelfReset ?? true,
        resetTokenExpiry: savedPolicies.resetTokenExpiry ?? 24,
        maxResetAttempts: savedPolicies.maxResetAttempts ?? 3,
        resetCooldown: savedPolicies.resetCooldown ?? 15,
        minimumStrengthScore: savedPolicies.minimumStrengthScore ?? 3,
        showStrengthMeter: savedPolicies.showStrengthMeter ?? true,
        blockWeakPasswords: savedPolicies.blockWeakPasswords ?? true
      }
      
      reset(formData)
    }
  }, [savedPolicies, reset])

  const handleUpdate = (updates: Partial<PasswordPoliciesFormData>) => {
    Object.entries(updates).forEach(([key, value]) => {
      setValue(key as keyof PasswordPoliciesFormData, value, { 
        shouldValidate: false,
        shouldDirty: true 
      })
    })
  }

  const onSubmit = async (data: PasswordPoliciesFormData) => {
    try {
      // Explicitly map fields to snake_case for backend
      const payload: PasswordPoliciesPayload = {
        min_length: data.minLength,
        max_length: data.maxLength,
        require_uppercase: data.requireUppercase,
        require_lowercase: data.requireLowercase,
        require_numbers: data.requireNumbers,
        require_special_chars: data.requireSpecialChars,
        allowed_special_chars: data.allowedSpecialChars,
        prevent_common_passwords: data.preventCommonPasswords,
        prevent_user_info_in_password: data.preventUserInfoInPassword,
        prevent_sequential_chars: data.preventSequentialChars,
        prevent_repeating_chars: data.preventRepeatingChars,
        max_repeating_chars: data.maxRepeatingChars,
        password_expiration: data.passwordExpiration,
        expiration_days: data.expirationDays,
        expiration_warning_days: data.expirationWarningDays,
        password_history: data.passwordHistory,
        history_count: data.historyCount,
        allow_self_reset: data.allowSelfReset,
        reset_token_expiry: data.resetTokenExpiry,
        max_reset_attempts: data.maxResetAttempts,
        reset_cooldown: data.resetCooldown,
        minimum_strength_score: data.minimumStrengthScore,
        show_strength_meter: data.showStrengthMeter,
        block_weak_passwords: data.blockWeakPasswords
      }
      
      await updatePoliciesMutation.mutateAsync(payload)
      showSuccess('Password policies saved successfully')
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
              Fetching password policies
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
            <h2 className="text-2xl font-semibold">Error Loading Policies</h2>
            <p className="text-muted-foreground mt-2">
              Failed to load password policies. Please try again.
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
          <h1 className="text-3xl font-semibold tracking-tight">Password Policies</h1>
          <p className="text-muted-foreground">
            Configure password requirements and validation rules for all users.
          </p>
        </div>

        <div className="grid gap-6">
          <BasicRequirements settings={formValues} onUpdate={handleUpdate} errors={errors} />
          <AdvancedRequirements settings={formValues} onUpdate={handleUpdate} errors={errors} />
          <ExpirationSettings settings={formValues} onUpdate={handleUpdate} errors={errors} />
          <ResetSettings settings={formValues} onUpdate={handleUpdate} errors={errors} />
          <StrengthRequirements settings={formValues} control={control} onUpdate={handleUpdate} errors={errors} />

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              type="submit"
              className="min-w-[140px] px-6"
              disabled={updatePoliciesMutation.isPending || isSubmitting}
            >
              <Save className="mr-2 h-4 w-4" />
              {updatePoliciesMutation.isPending || isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </DetailsContainer>
  )
}
