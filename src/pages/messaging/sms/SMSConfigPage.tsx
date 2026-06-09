import { useEffect, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { MessageSquare, Server, KeyRound, Hash, Info, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DetailsContainer } from "@/components/container"
import { FormPageHeader } from "@/components/header"
import {
  FormInputField,
  FormSelectField,
  FormPasswordField,
  FormSwitchField,
  FormSubmitButton,
  type SelectOption,
} from "@/components/form"
import { useToast } from "@/hooks/useToast"
import { fetchSMSConfig, updateSMSConfig, type SMSConfigUpdate } from "@/services/api/notifier"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ConfigStatusBanner } from "../components/ConfigStatusBanner"

// Per-provider field map. The backend stores generic credential fields
// (account_sid + auth_token); each provider relabels them to match its own
// terminology and declares whether it uses a phone number or an alphanumeric
// sender ID. The "log" provider writes messages to logs instead of sending.
type SMSProviderMeta = {
  value: string
  label: string
  accountSidLabel?: string
  authTokenLabel?: string
  showFromNumber: boolean
  showSenderId: boolean
  noCredentials?: boolean
  hint: string
}

const SMS_PROVIDERS: SMSProviderMeta[] = [
  {
    value: "twilio",
    label: "Twilio",
    accountSidLabel: "Account SID",
    authTokenLabel: "Auth Token",
    showFromNumber: true,
    showSenderId: false,
    hint: "Find your Account SID and Auth Token on the Twilio Console dashboard. The From number must be a Twilio-owned number.",
  },
  {
    value: "sns",
    label: "AWS SNS",
    accountSidLabel: "Access Key ID",
    authTokenLabel: "Secret Access Key",
    showFromNumber: false,
    showSenderId: true,
    hint: "Authenticate with an IAM access key that has sns:Publish permission. Sender ID support depends on the destination country.",
  },
  {
    value: "vonage",
    label: "Vonage",
    accountSidLabel: "API Key",
    authTokenLabel: "API Secret",
    showFromNumber: true,
    showSenderId: true,
    hint: "Use the API Key and API Secret from your Vonage dashboard.",
  },
  {
    value: "messagebird",
    label: "MessageBird",
    authTokenLabel: "Access Key",
    showFromNumber: true,
    showSenderId: true,
    hint: "Use a live Access Key from the MessageBird dashboard. Set an originator via the From number or Sender ID.",
  },
  {
    value: "log",
    label: "Log (testing)",
    showFromNumber: false,
    showSenderId: false,
    noCredentials: true,
    hint: "Messages are written to the server logs instead of being delivered. Use this for local development and testing only — never in production.",
  },
]

const PROVIDER_OPTIONS: SelectOption[] = SMS_PROVIDERS.map((p) => ({ value: p.value, label: p.label }))

const schema = yup.object({
  provider: yup.string().required("Provider is required"),
  account_sid: yup.string().max(255, "Must not exceed 255 characters"),
  auth_token: yup.string(),
  from_number: yup.string().max(50, "Must not exceed 50 characters"),
  sender_id: yup.string().max(50, "Must not exceed 50 characters"),
  daily_send_limit: yup.number().transform((v) => (isNaN(v) ? undefined : v)).min(0, "Must be zero or greater"),
  test_mode: yup.boolean(),
})

type FormData = yup.InferType<typeof schema>

export default function SMSConfigPage() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["sms-config"],
    queryFn: fetchSMSConfig,
    retry: false,
  })

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { provider: "twilio", daily_send_limit: 1000, test_mode: false },
    mode: "onSubmit",
  })

  // The auth token is never returned by the API, so we hydrate everything else
  // and leave the secret field blank.
  useEffect(() => {
    if (!data) return
    reset({
      provider: data.provider || "twilio",
      account_sid: data.account_sid || "",
      auth_token: "",
      from_number: data.from_number || "",
      sender_id: data.sender_id || "",
      daily_send_limit: data.daily_send_limit ?? 1000,
      test_mode: data.test_mode ?? false,
    })
  }, [data, reset])

  const selectedProvider = watch("provider")
  const meta = useMemo(
    () => SMS_PROVIDERS.find((p) => p.value === selectedProvider) ?? SMS_PROVIDERS[0],
    [selectedProvider],
  )

  const isConfigured = Boolean(data?.sms_config_id)
  // Switching to a different provider than the saved one means the stored token
  // belongs to the old provider and can't be reused — force a fresh entry so the
  // backend's "blank preserves" rule doesn't silently carry it over.
  const providerChanged = isConfigured && selectedProvider !== data?.provider

  const mutation = useMutation({
    mutationFn: updateSMSConfig,
    onSuccess: () => {
      showSuccess("SMS delivery settings saved")
      queryClient.invalidateQueries({ queryKey: ["sms-config"] })
    },
    onError: (e) => showError(e),
  })

  const onSubmit = (formData: FormData) => {
    if (providerChanged && meta.authTokenLabel && !formData.auth_token) {
      setError("auth_token", {
        type: "manual",
        message: `Enter the ${meta.authTokenLabel.toLowerCase()} for ${meta.label} — the previous provider's secret can't be reused.`,
      })
      return
    }
    // Drop the secret when blank so the backend preserves the stored token.
    const payload: SMSConfigUpdate = {
      provider: formData.provider,
      daily_send_limit: formData.daily_send_limit,
      test_mode: formData.test_mode,
      ...(meta.accountSidLabel ? { account_sid: formData.account_sid } : {}),
      ...(meta.showFromNumber ? { from_number: formData.from_number } : {}),
      ...(meta.showSenderId ? { sender_id: formData.sender_id } : {}),
      ...(meta.authTokenLabel && formData.auth_token ? { auth_token: formData.auth_token } : {}),
    }
    mutation.mutate(payload)
  }

  const secretDescription = providerChanged
    ? `You switched providers — enter the ${(meta.authTokenLabel ?? "secret").toLowerCase()} for ${meta.label}.`
    : isConfigured
      ? "For security, the saved value is never displayed. Leave blank to keep it, or enter a new value to replace it."
      : "Stored encrypted at rest and never shown again after saving."

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        <FormPageHeader
          backUrl={`/${tenantId}/settings`}
          backLabel="Back to Settings"
          title="SMS Delivery"
          description="Connect an SMS provider so the platform can send one-time codes and security alerts by text message."
        />

        {isLoading && (
          <Card className="shadow-xs">
            <CardContent className="space-y-4 pt-6">
              <Skeleton className="h-5 w-40" />
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {isError && (
          <Card className="shadow-xs">
            <CardContent className="py-12 text-center text-sm text-destructive">
              Failed to load SMS configuration. {(error as Error)?.message || "The backend may not be reachable."}
            </CardContent>
          </Card>
        )}

        {data && (
          <>
            <ConfigStatusBanner
              icon={MessageSquare}
              configured={isConfigured}
              providerLabel={SMS_PROVIDERS.find((p) => p.value === data.provider)?.label}
              status={data.status}
              testMode={data.test_mode}
              updatedAt={data.updated_at}
              notConfiguredHint="No SMS provider is connected yet. Choose one below to start sending text messages."
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Provider */}
              <Card className="shadow-xs">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Server className="size-4" />
                    Provider
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Choose the service that delivers your text messages.</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="md:max-w-xs">
                    <Controller
                      name="provider"
                      control={control}
                      render={({ field }) => (
                        <FormSelectField
                          label="SMS provider"
                          options={PROVIDER_OPTIONS}
                          value={field.value}
                          onValueChange={field.onChange}
                          error={errors.provider?.message}
                          required
                        />
                      )}
                    />
                  </div>
                  <Alert variant={meta.value === "log" ? "destructive" : "default"}>
                    <Info className="size-4" />
                    <AlertDescription>{meta.hint}</AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Credentials */}
              {!meta.noCredentials && (
                <Card className="shadow-xs">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <KeyRound className="size-4" />
                      Credentials
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Authenticate with {meta.label}.</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {meta.accountSidLabel && (
                        <FormInputField
                          label={meta.accountSidLabel}
                          placeholder={meta.accountSidLabel}
                          error={errors.account_sid?.message}
                          {...register("account_sid")}
                        />
                      )}
                      {meta.authTokenLabel && (
                        <FormPasswordField
                          label={meta.authTokenLabel}
                          placeholder={isConfigured && !providerChanged ? "••••••••  (unchanged)" : `Enter ${meta.authTokenLabel.toLowerCase()}`}
                          description={secretDescription}
                          required={providerChanged}
                          error={errors.auth_token?.message}
                          {...register("auth_token")}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Sender */}
              {(meta.showFromNumber || meta.showSenderId) && (
                <Card className="shadow-xs">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Hash className="size-4" />
                      Sender
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">The originator recipients see your messages from.</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {meta.showFromNumber && (
                        <FormInputField label="From Number" placeholder="+1234567890" error={errors.from_number?.message} {...register("from_number")} />
                      )}
                      {meta.showSenderId && (
                        <FormInputField label="Sender ID" placeholder="MyApp" error={errors.sender_id?.message} {...register("sender_id")} />
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Delivery options */}
              <Card className="shadow-xs">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Lock className="size-4" />
                    Delivery Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormInputField
                    label="Daily Send Limit"
                    type="number"
                    placeholder="1000"
                    description="Maximum number of messages sent per day. Helps cap spend if credentials are misused."
                    error={errors.daily_send_limit?.message}
                    containerClassName="md:max-w-xs"
                    {...register("daily_send_limit")}
                  />
                  <Controller
                    name="test_mode"
                    control={control}
                    render={({ field }) => (
                      <FormSwitchField
                        label="Test mode"
                        description="Keep the provider in test mode while you verify the setup. Turn off to deliver to real recipients."
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </CardContent>
              </Card>

              <Alert>
                <Info className="size-4" />
                <AlertTitle>Verifying your configuration</AlertTitle>
                <AlertDescription>
                  Save your settings, then trigger an SMS the platform sends (such as a phone verification or an MFA
                  code) to confirm delivery. Leave test mode on until you’ve seen a message arrive.
                </AlertDescription>
              </Alert>

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t pt-4">
                <Button type="button" variant="outline" onClick={() => navigate(`/${tenantId}/settings`)}>
                  Cancel
                </Button>
                <FormSubmitButton isSubmitting={isSubmitting || mutation.isPending} submitText="Save changes" disabled={!isDirty} />
              </div>
            </form>
          </>
        )}
      </div>
    </DetailsContainer>
  )
}
