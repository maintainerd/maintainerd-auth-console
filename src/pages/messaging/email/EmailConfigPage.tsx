import { useEffect, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Mail, Server, KeyRound, UserRound, Info, Lock } from "lucide-react"
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
import { fetchEmailConfig, updateEmailConfig, type EmailConfigUpdate } from "@/services/api/notifier"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ConfigStatusBanner } from "../components/ConfigStatusBanner"

// Per-provider field map. The backend stores generic connection fields, so each
// provider declares which of them it actually needs and how they're labelled —
// SMTP exposes full server settings, the API providers collapse to a single key.
type EmailProviderMeta = {
  value: string
  label: string
  showServer: boolean // host / port / encryption
  usernameLabel?: string // omitted = no username field
  secretLabel: string
  hint: string
}

const EMAIL_PROVIDERS: EmailProviderMeta[] = [
  {
    value: "smtp",
    label: "SMTP",
    showServer: true,
    usernameLabel: "Username",
    secretLabel: "Password",
    hint: "Standard SMTP relay. Enter the server host, port, encryption, and login credentials supplied by your mail provider.",
  },
  {
    value: "ses",
    label: "Amazon SES",
    showServer: false,
    usernameLabel: "Access Key ID",
    secretLabel: "Secret Access Key",
    hint: "Authenticate with an IAM access key that has ses:SendEmail permission. The sending domain must be verified in SES.",
  },
  {
    value: "sendgrid",
    label: "SendGrid",
    showServer: false,
    secretLabel: "API Key",
    hint: "Create an API key with the “Mail Send” permission in SendGrid and paste it below.",
  },
  {
    value: "mailgun",
    label: "Mailgun",
    showServer: false,
    secretLabel: "API Key",
    hint: "Use a Mailgun Sending API key. The sending domain must be verified in your Mailgun account.",
  },
  {
    value: "postmark",
    label: "Postmark",
    showServer: false,
    secretLabel: "Server API Token",
    hint: "Use the Server API Token from your Postmark server’s API Tokens tab.",
  },
  {
    value: "resend",
    label: "Resend",
    showServer: false,
    secretLabel: "API Key",
    hint: "Create an API key in the Resend dashboard with send permission.",
  },
]

const PROVIDER_OPTIONS: SelectOption[] = EMAIL_PROVIDERS.map((p) => ({ value: p.value, label: p.label }))

const ENCRYPTION_OPTIONS: SelectOption[] = [
  { value: "tls", label: "TLS" },
  { value: "ssl", label: "SSL" },
  { value: "none", label: "None" },
]

const schema = yup.object({
  provider: yup.string().required("Provider is required"),
  host: yup.string(),
  port: yup.number().transform((v) => (isNaN(v) ? undefined : v)).min(1, "Port must be between 1 and 65535").max(65535, "Port must be between 1 and 65535"),
  username: yup.string(),
  password: yup.string(),
  from_address: yup.string().email("Enter a valid email address").required("From address is required"),
  from_name: yup.string(),
  reply_to: yup.string().email("Enter a valid email address"),
  encryption: yup.string(),
  logo_url: yup.string(),
  test_mode: yup.boolean(),
})

type FormData = yup.InferType<typeof schema>

export default function EmailConfigPage() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["email-config"],
    queryFn: fetchEmailConfig,
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
    defaultValues: { provider: "smtp", from_address: "", encryption: "tls", test_mode: false },
    mode: "onSubmit",
  })

  // The secret is never returned by the API, so we hydrate everything except the
  // password and normalise the zero-value port to a blank field.
  useEffect(() => {
    if (!data) return
    reset({
      provider: data.provider || "smtp",
      host: data.host || "",
      port: data.port || undefined,
      username: data.username || "",
      password: "",
      from_address: data.from_address || "",
      from_name: data.from_name || "",
      reply_to: data.reply_to || "",
      encryption: data.encryption || "tls",
      logo_url: data.logo_url || "",
      test_mode: data.test_mode ?? false,
    })
  }, [data, reset])

  const selectedProvider = watch("provider")
  const meta = useMemo(
    () => EMAIL_PROVIDERS.find((p) => p.value === selectedProvider) ?? EMAIL_PROVIDERS[0],
    [selectedProvider],
  )

  const isConfigured = Boolean(data?.email_config_id)
  // Switching to a different provider than the saved one means the stored secret
  // belongs to the old provider and can't be reused — force a fresh entry so the
  // backend's "blank preserves" rule doesn't silently carry it over.
  const providerChanged = isConfigured && selectedProvider !== data?.provider

  const mutation = useMutation({
    mutationFn: updateEmailConfig,
    onSuccess: () => {
      showSuccess("Email delivery settings saved")
      queryClient.invalidateQueries({ queryKey: ["email-config"] })
    },
    onError: (e) => showError(e),
  })

  const onSubmit = (formData: FormData) => {
    if (providerChanged && !formData.password) {
      setError("password", {
        type: "manual",
        message: `Enter the ${meta.secretLabel.toLowerCase()} for ${meta.label} — the previous provider's secret can't be reused.`,
      })
      return
    }
    // Drop the secret entirely when left blank so the backend preserves the
    // stored value rather than overwriting it with an empty string.
    const payload: EmailConfigUpdate = {
      provider: formData.provider,
      from_address: formData.from_address,
      from_name: formData.from_name,
      reply_to: formData.reply_to,
      logo_url: formData.logo_url,
      test_mode: formData.test_mode,
      ...(meta.showServer
        ? { host: formData.host, port: formData.port, encryption: formData.encryption }
        : {}),
      ...(meta.usernameLabel ? { username: formData.username } : {}),
      ...(formData.password ? { password: formData.password } : {}),
    }
    mutation.mutate(payload)
  }

  const secretDescription = providerChanged
    ? `You switched providers — enter the ${meta.secretLabel.toLowerCase()} for ${meta.label}.`
    : isConfigured
      ? "For security, the saved value is never displayed. Leave blank to keep it, or enter a new value to replace it."
      : "Stored encrypted at rest and never shown again after saving."

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        <FormPageHeader
          backUrl={`/${tenantId}/settings`}
          backLabel="Back to Settings"
          title="Email Delivery"
          description="Connect an email provider so the platform can send verification, security, and notification emails."
        />

        {isLoading && (
          <Card className="shadow-xs">
            <CardContent className="space-y-4 pt-6">
              <Skeleton className="h-5 w-40" />
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
              <Skeleton className="h-5 w-40" />
              <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {isError && (
          <Card className="shadow-xs">
            <CardContent className="py-12 text-center text-sm text-destructive">
              Failed to load email configuration. {(error as Error)?.message || "The backend may not be reachable."}
            </CardContent>
          </Card>
        )}

        {data && (
          <>
            <ConfigStatusBanner
              icon={Mail}
              configured={isConfigured}
              providerLabel={EMAIL_PROVIDERS.find((p) => p.value === data.provider)?.label}
              status={data.status}
              testMode={data.test_mode}
              updatedAt={data.updated_at}
              notConfiguredHint="No email provider is connected yet. Choose one below to start sending emails."
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Provider */}
              <Card className="shadow-xs">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Server className="size-4" />
                    Provider
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Choose the service that delivers your email.</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="md:max-w-xs">
                    <Controller
                      name="provider"
                      control={control}
                      render={({ field }) => (
                        <FormSelectField
                          label="Email provider"
                          options={PROVIDER_OPTIONS}
                          value={field.value}
                          onValueChange={field.onChange}
                          error={errors.provider?.message}
                          required
                        />
                      )}
                    />
                  </div>
                  <Alert>
                    <Info className="size-4" />
                    <AlertDescription>{meta.hint}</AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Connection / credentials */}
              <Card className="shadow-xs">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <KeyRound className="size-4" />
                    {meta.showServer ? "Server & Credentials" : "Credentials"}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {meta.showServer
                      ? "SMTP connection details and login."
                      : `Authenticate with ${meta.label}.`}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {meta.showServer && (
                    <div className="grid gap-4 md:grid-cols-3">
                      <FormInputField label="Host" placeholder="smtp.example.com" error={errors.host?.message} {...register("host")} />
                      <FormInputField label="Port" type="number" placeholder="587" error={errors.port?.message} {...register("port")} />
                      <Controller
                        name="encryption"
                        control={control}
                        render={({ field }) => (
                          <FormSelectField
                            label="Encryption"
                            options={ENCRYPTION_OPTIONS}
                            value={field.value || ""}
                            onValueChange={field.onChange}
                            error={errors.encryption?.message}
                          />
                        )}
                      />
                    </div>
                  )}
                  <div className="grid gap-4 md:grid-cols-2">
                    {meta.usernameLabel && (
                      <FormInputField
                        label={meta.usernameLabel}
                        placeholder={meta.usernameLabel}
                        error={errors.username?.message}
                        {...register("username")}
                      />
                    )}
                    <FormPasswordField
                      label={meta.secretLabel}
                      placeholder={isConfigured && !providerChanged ? "••••••••  (unchanged)" : `Enter ${meta.secretLabel.toLowerCase()}`}
                      description={secretDescription}
                      required={providerChanged}
                      error={errors.password?.message}
                      {...register("password")}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Sender identity */}
              <Card className="shadow-xs">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <UserRound className="size-4" />
                    Sender Identity
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">How recipients see messages from your platform.</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormInputField label="From Address" placeholder="noreply@example.com" error={errors.from_address?.message} required {...register("from_address")} />
                    <FormInputField label="From Name" placeholder="Your App" error={errors.from_name?.message} {...register("from_name")} />
                    <FormInputField label="Reply-To" placeholder="support@example.com" error={errors.reply_to?.message} {...register("reply_to")} />
                    <FormInputField label="Logo URL" placeholder="https://example.com/logo.png" error={errors.logo_url?.message} {...register("logo_url")} />
                  </div>
                </CardContent>
              </Card>

              {/* Delivery options */}
              <Card className="shadow-xs">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Lock className="size-4" />
                    Delivery Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
                  Save your settings, then trigger an email the platform sends (such as a user invite or a password
                  reset) to confirm delivery. Leave test mode on until you’ve seen a message arrive.
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
