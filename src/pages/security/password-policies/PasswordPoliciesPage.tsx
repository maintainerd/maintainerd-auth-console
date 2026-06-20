import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@/components/ui/button'
import { DetailsContainer } from '@/components/container'
import { AlertCircle, RefreshCw, Save } from 'lucide-react'
import { FormSwitchField, FormInputField, FormSelectField } from '@/components/form'
import { SettingsCard } from '@/components/card'
import { usePasswordPolicies, useUpdatePasswordPolicies } from '@/hooks/usePasswordPolicies'
import { useToast } from '@/hooks/useToast'
import {
  PASSWORD_POLICY_LIMITS,
  passwordPoliciesSchema,
  type PasswordPoliciesFormData,
} from '@/lib/validations'


const HASH_OPTIONS = [
  { value: 'argon2id', label: 'Argon2id' },
  { value: 'bcrypt', label: 'Bcrypt' },
  { value: 'scrypt', label: 'Scrypt' },
  { value: 'pbkdf2', label: 'PBKDF2' },
]

export default function PasswordPoliciesPage() {
  const { showSuccess, showError } = useToast()
  const {
    data: savedPolicies,
    error: loadError,
    isError,
    isLoading,
    refetch,
  } = usePasswordPolicies()
  const updateMutation = useUpdatePasswordPolicies()

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<PasswordPoliciesFormData>({
    resolver: yupResolver(passwordPoliciesSchema),
    defaultValues: {
      min_length: 12,
      max_length: 128,
      require_uppercase: false,
      require_lowercase: false,
      require_number: false,
      require_symbol: false,
      reject_common_passwords: true,
      check_hibp: true,
      password_history_count: 5,
      max_age_days: 0,
      temporary_password_validity_hours: 72,
      hash_algorithm: 'argon2id',
      min_strength_score: 2,
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  const formValues = watch()

  useEffect(() => {
    if (savedPolicies) {
      reset({
        min_length: savedPolicies.min_length ?? 12,
        max_length: savedPolicies.max_length ?? 128,
        require_uppercase: savedPolicies.require_uppercase ?? false,
        require_lowercase: savedPolicies.require_lowercase ?? false,
        require_number: savedPolicies.require_number ?? false,
        require_symbol: savedPolicies.require_symbol ?? false,
        reject_common_passwords: savedPolicies.reject_common_passwords ?? true,
        check_hibp: savedPolicies.check_hibp ?? true,
        password_history_count: savedPolicies.password_history_count ?? 5,
        max_age_days: savedPolicies.max_age_days ?? 0,
        temporary_password_validity_hours: savedPolicies.temporary_password_validity_hours ?? 72,
        hash_algorithm: savedPolicies.hash_algorithm ?? 'argon2id',
        min_strength_score: savedPolicies.min_strength_score ?? 2,
      })
    }
  }, [savedPolicies, reset])

  const handleUpdate = (updates: Partial<PasswordPoliciesFormData>) => {
    Object.entries(updates).forEach(([key, value]) => {
      setValue(key as keyof PasswordPoliciesFormData, value, {
        shouldValidate: true,
        shouldDirty: true,
      })
    })
    void trigger()
  }

  const onSubmit = async (data: PasswordPoliciesFormData) => {
    try {
      await updateMutation.mutateAsync(data)
      showSuccess('Password policies saved successfully')
    } catch (error) {
      showError(error)
    }
  }

  if (isLoading) {
    return (
      <DetailsContainer>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-muted-foreground">Loading password policies...</p>
        </div>
      </DetailsContainer>
    )
  }

  if (isError || !savedPolicies) {
    return (
      <DetailsContainer>
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="size-6 text-destructive" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Unable to load password policy</h2>
            <p className="max-w-md text-sm text-muted-foreground">
              {loadError instanceof Error
                ? loadError.message
                : 'The saved policy could not be retrieved. No settings have been changed.'}
            </p>
          </div>
          <Button type="button" variant="outline" onClick={() => void refetch()}>
            <RefreshCw className="mr-2 size-4" />
            Try again
          </Button>
        </div>
      </DetailsContainer>
    )
  }

  return (
    <DetailsContainer>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Password Policy</h1>
          <p className="text-muted-foreground">
            Configure password length, complexity, breach screening, history, expiry, and hashing
            algorithm.
          </p>
        </div>

        <div className="grid gap-6">
          <SettingsCard
            title="Complexity Requirements"
            description="Set the minimum character types each password must contain."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormInputField
                label="Minimum Length"
                type="number"
                min={1}
                max={PASSWORD_POLICY_LIMITS.maxLength}
                value={formValues.min_length.toString()}
                onChange={(e) =>
                  handleUpdate({ min_length: parseInt(e.target.value) || 1 })
                }
                error={errors.min_length?.message}
                required
              />
              <FormInputField
                label="Maximum Length"
                type="number"
                min={64}
                max={PASSWORD_POLICY_LIMITS.maxLength}
                value={formValues.max_length.toString()}
                onChange={(e) =>
                  handleUpdate({ max_length: parseInt(e.target.value) || 64 })
                }
                error={errors.max_length?.message}
                required
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 mt-4">
              <FormSwitchField
                label="Require Uppercase"
                description="At least one A–Z character"
                checked={formValues.require_uppercase}
                onCheckedChange={(v) => handleUpdate({ require_uppercase: v })}
              />
              <FormSwitchField
                label="Require Lowercase"
                description="At least one a–z character"
                checked={formValues.require_lowercase}
                onCheckedChange={(v) => handleUpdate({ require_lowercase: v })}
              />
              <FormSwitchField
                label="Require Number"
                description="At least one 0–9 digit"
                checked={formValues.require_number}
                onCheckedChange={(v) => handleUpdate({ require_number: v })}
              />
              <FormSwitchField
                label="Require Symbol"
                description="At least one special character"
                checked={formValues.require_symbol}
                onCheckedChange={(v) => handleUpdate({ require_symbol: v })}
              />
            </div>
          </SettingsCard>

          <SettingsCard
            title="Breach & History"
            description="Block commonly used passwords, check breach databases, and enforce password history."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <FormSwitchField
                label="Reject Common Passwords"
                description="Block passwords from known common-password lists"
                checked={formValues.reject_common_passwords}
                onCheckedChange={(v) => handleUpdate({ reject_common_passwords: v })}
              />
              <FormSwitchField
                label="Check HIBP"
                description="Screen against Have I Been Pwned breach database"
                checked={formValues.check_hibp}
                onCheckedChange={(v) => handleUpdate({ check_hibp: v })}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <FormInputField
                label="Password History Count"
                description="Number of previous passwords to remember (0 = disabled)"
                type="number"
                min={0}
                max={PASSWORD_POLICY_LIMITS.maxHistoryCount}
                value={formValues.password_history_count.toString()}
                onChange={(e) =>
                  handleUpdate({ password_history_count: parseInt(e.target.value) || 0 })
                }
                error={errors.password_history_count?.message}
              />
              <FormInputField
                label="Minimum Strength Score"
                description="0–4 zxcvbn-like threshold (2 = good)"
                type="number"
                min={0}
                max={4}
                value={formValues.min_strength_score.toString()}
                onChange={(e) =>
                  handleUpdate({ min_strength_score: parseInt(e.target.value) || 0 })
                }
                error={errors.min_strength_score?.message}
              />
            </div>
          </SettingsCard>

          <SettingsCard
            title="Expiry & Hashing"
            description="Configure password expiration, temporary password validity, and hashing algorithm."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormInputField
                label="Max Age (days)"
                description="Days until password expires (0 = never)"
                type="number"
                min={0}
                max={PASSWORD_POLICY_LIMITS.maxAgeDays}
                value={formValues.max_age_days.toString()}
                onChange={(e) =>
                  handleUpdate({ max_age_days: parseInt(e.target.value) || 0 })
                }
                error={errors.max_age_days?.message}
              />
              <FormInputField
                label="Temporary Password Validity (hours)"
                type="number"
                min={1}
                max={PASSWORD_POLICY_LIMITS.maxTemporaryPasswordValidityHours}
                value={formValues.temporary_password_validity_hours.toString()}
                onChange={(e) =>
                  handleUpdate({
                    temporary_password_validity_hours: parseInt(e.target.value) || 1,
                  })
                }
                error={errors.temporary_password_validity_hours?.message}
              />
              <FormSelectField
                label="Hashing Algorithm"
                options={HASH_OPTIONS}
                value={formValues.hash_algorithm}
                onValueChange={(v) =>
                  handleUpdate({ hash_algorithm: v as PasswordPoliciesFormData['hash_algorithm'] })
                }
                error={errors.hash_algorithm?.message}
              />
            </div>
          </SettingsCard>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="min-w-[140px] px-6"
              disabled={updateMutation.isPending || isSubmitting}
            >
              <Save className="mr-2 h-4 w-4" />
              {updateMutation.isPending || isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </DetailsContainer>
  )
}
