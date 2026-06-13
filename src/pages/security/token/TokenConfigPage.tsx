import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@/components/ui/button'
import { DetailsContainer } from '@/components/container'
import { Save, Key } from 'lucide-react'
import { FormSwitchField, FormInputField, FormSelectField, FormCheckboxField } from '@/components/form'
import { SettingsCard } from '@/components/card'
import { useTokenConfig, useUpdateTokenConfig } from '@/hooks/useTokenConfig'
import { useToast } from '@/hooks/useToast'
import { tokenConfigSchema, type TokenConfigFormData } from '@/lib/validations'

const SWITCH_CLASS = 'data-[state=checked]:bg-blue-600'

const SIGNING_OPTIONS = [
  { value: 'RS256', label: 'RS256' },
  { value: 'ES256', label: 'ES256' },
  { value: 'PS256', label: 'PS256' },
]

const KNOWN_CLAIMS = [
  { value: 'roles', label: 'roles' },
  { value: 'tenant_id', label: 'tenant_id' },
  { value: 'permissions', label: 'permissions' },
  { value: 'email', label: 'email' },
  { value: 'email_verified', label: 'email_verified' },
  { value: 'phone', label: 'phone' },
  { value: 'phone_verified', label: 'phone_verified' },
  { value: 'name', label: 'name' },
  { value: 'fullname', label: 'fullname' },
]

export default function TokenConfigPage() {
  const { showSuccess, showError } = useToast()
  const { data: savedConfig, isLoading } = useTokenConfig()
  const updateMutation = useUpdateTokenConfig()

  const { handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<TokenConfigFormData>({
    resolver: yupResolver(tokenConfigSchema),
    defaultValues: {
      clock_skew_leeway_seconds: 30,
      signing_algorithm: 'RS256',
      require_pkce: true,
      additional_id_token_claims: ['roles', 'tenant_id'],
      additional_access_token_claims: ['roles', 'tenant_id'],
    },
    mode: 'onSubmit',
  })

  const formValues = watch()

  useEffect(() => {
    if (savedConfig) {
      reset({
        clock_skew_leeway_seconds: savedConfig.clock_skew_leeway_seconds ?? 30,
        signing_algorithm: savedConfig.signing_algorithm ?? 'RS256',
        require_pkce: savedConfig.require_pkce ?? true,
        additional_id_token_claims: savedConfig.additional_id_token_claims ?? ['roles', 'tenant_id'],
        additional_access_token_claims: savedConfig.additional_access_token_claims ?? ['roles', 'tenant_id'],
      })
    }
  }, [savedConfig, reset])

  const handleUpdate = (updates: Partial<TokenConfigFormData>) => {
    Object.entries(updates).forEach(([key, value]) => {
      setValue(key as keyof TokenConfigFormData, value, { shouldValidate: false, shouldDirty: true })
    })
  }

  const toggleClaim = (claims: string[], claim: string, checked: boolean) => {
    const updated = checked ? [...claims, claim] : claims.filter((c) => c !== claim)
    return updated
  }

  const onSubmit = async (data: TokenConfigFormData) => {
    try {
      await updateMutation.mutateAsync(data)
      showSuccess('Token config saved successfully')
    } catch (error) {
      showError(error)
    }
  }

  if (isLoading) {
    return (
      <DetailsContainer>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-muted-foreground">Loading token configuration...</p>
        </div>
      </DetailsContainer>
    )
  }

  return (
    <DetailsContainer>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Token Configuration</h1>
          <p className="text-muted-foreground">
            Configure JWT signing algorithm, clock skew, PKCE, and additional token claims.
          </p>
        </div>

        <div className="grid gap-6">
          <SettingsCard
            title="JWT Settings"
            description="Signing algorithm and clock skew tolerance."
            icon={Key}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormSelectField
                label="Signing Algorithm"
                options={SIGNING_OPTIONS}
                value={formValues.signing_algorithm}
                onValueChange={(v) => handleUpdate({ signing_algorithm: v as TokenConfigFormData['signing_algorithm'] })}
                error={errors.signing_algorithm?.message}
              />
              <FormInputField
                label="Clock Skew Leeway (seconds)"
                description="0–300 seconds"
                type="number"
                value={formValues.clock_skew_leeway_seconds.toString()}
                onChange={(e) => handleUpdate({ clock_skew_leeway_seconds: parseInt(e.target.value) || 0 })}
                error={errors.clock_skew_leeway_seconds?.message}
              />
            </div>
          </SettingsCard>

          <SettingsCard
            title="PKCE"
            description="Proof Key for Code Exchange enforcement."
          >
            <FormSwitchField
              label="Require PKCE"
              description="Enforce S256 PKCE for all OAuth authorization code flows"
              checked={formValues.require_pkce}
              onCheckedChange={(v) => handleUpdate({ require_pkce: v })}
              switchClassName={SWITCH_CLASS}
            />
          </SettingsCard>

          <SettingsCard
            title="Additional ID Token Claims"
            description="Extra claims injected into the ID token. Defaults: roles, tenant_id."
          >
            <div className="space-y-1">
              {errors.additional_id_token_claims?.message && (
                <p className="text-sm text-red-600">{errors.additional_id_token_claims.message}</p>
              )}
              <div className="grid gap-2 sm:grid-cols-3">
                {KNOWN_CLAIMS.map((claim) => (
                  <FormCheckboxField
                    key={`id-${claim.value}`}
                    label={claim.label}
                    checked={formValues.additional_id_token_claims.includes(claim.value)}
                    onCheckedChange={(checked) =>
                      handleUpdate({
                        additional_id_token_claims: toggleClaim(
                          formValues.additional_id_token_claims,
                          claim.value,
                          checked,
                        ),
                      })
                    }
                  />
                ))}
              </div>
            </div>
          </SettingsCard>

          <SettingsCard
            title="Additional Access Token Claims"
            description="Extra claims injected into the access token. Defaults: roles, tenant_id."
          >
            <div className="space-y-1">
              {errors.additional_access_token_claims?.message && (
                <p className="text-sm text-red-600">{errors.additional_access_token_claims.message}</p>
              )}
              <div className="grid gap-2 sm:grid-cols-3">
                {KNOWN_CLAIMS.map((claim) => (
                  <FormCheckboxField
                    key={`access-${claim.value}`}
                    label={claim.label}
                    checked={formValues.additional_access_token_claims.includes(claim.value)}
                    onCheckedChange={(checked) =>
                      handleUpdate({
                        additional_access_token_claims: toggleClaim(
                          formValues.additional_access_token_claims,
                          claim.value,
                          checked,
                        ),
                      })
                    }
                  />
                ))}
              </div>
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
