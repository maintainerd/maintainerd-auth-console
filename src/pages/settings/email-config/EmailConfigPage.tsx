import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DetailsContainer } from "@/components/container"
import { FormPageHeader } from "@/components/header"
import { FormInputField, FormSelectField, FormSubmitButton, type SelectOption } from "@/components/form"
import { useToast } from "@/hooks/useToast"
import { fetchEmailConfig, updateEmailConfig, type EmailConfigUpdate } from "@/services/api/notifier"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

const PROVIDER_OPTIONS: SelectOption[] = [
  { value: "smtp", label: "SMTP" },
  { value: "ses", label: "Amazon SES" },
  { value: "sendgrid", label: "SendGrid" },
  { value: "mailgun", label: "Mailgun" },
  { value: "postmark", label: "Postmark" },
  { value: "resend", label: "Resend" },
]

const ENCRYPTION_OPTIONS: SelectOption[] = [
  { value: "tls", label: "TLS" },
  { value: "ssl", label: "SSL" },
  { value: "none", label: "None" },
]

const schema = yup.object({
  provider: yup.string().required("Provider is required"),
  host: yup.string(),
  port: yup.number().transform((v) => (isNaN(v) ? undefined : v)),
  username: yup.string(),
  password: yup.string(),
  from_address: yup.string().email().required("From address is required"),
  from_name: yup.string(),
  reply_to: yup.string().email(),
  encryption: yup.string(),
  logo_url: yup.string(),
})

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

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { provider: "smtp", from_address: "" },
    mode: "onSubmit",
  })

  useEffect(() => { if (data) reset(data) }, [data, reset])

  const mutation = useMutation({
    mutationFn: updateEmailConfig,
    onSuccess: () => { showSuccess("Email config saved"); queryClient.invalidateQueries({ queryKey: ["email-config"] }) },
    onError: (e) => showError(e),
  })

  const onSubmit = (formData: yup.InferType<typeof schema>) => mutation.mutate(formData as EmailConfigUpdate)

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        <FormPageHeader backUrl={`/${tenantId}/settings`} backLabel="Back to Settings" title="Email Delivery" description="Configure how emails are sent from the platform." />

        {isLoading && (
          <Card className="shadow-xs">
            <CardContent className="space-y-4 pt-6">
              <Skeleton className="h-5 w-40" />
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (<Skeleton key={i} className="h-10 w-full" />))}
              </div>
              <Skeleton className="h-5 w-40" />
              <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (<Skeleton key={i} className="h-10 w-full" />))}
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card className="shadow-xs">
              <CardHeader>
                <CardTitle className="text-base">Provider</CardTitle>
                <p className="text-sm text-muted-foreground">Choose your email delivery provider and configure the connection.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Controller name="provider" control={control} render={({ field }) => (
                    <FormSelectField label="Provider" options={PROVIDER_OPTIONS} value={field.value} onValueChange={field.onChange} error={errors.provider?.message} required />
                  )} />
                  <FormInputField label="From Address" placeholder="noreply@example.com" error={errors.from_address?.message} required {...register("from_address")} />
                  <FormInputField label="From Name" placeholder="Your App" error={errors.from_name?.message} {...register("from_name")} />
                  <FormInputField label="Reply-To" placeholder="support@example.com" error={errors.reply_to?.message} {...register("reply_to")} />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xs">
              <CardHeader>
                <CardTitle className="text-base">Server Settings</CardTitle>
                <p className="text-sm text-muted-foreground">SMTP server connection details.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <FormInputField label="Host" placeholder="smtp.example.com" error={errors.host?.message} {...register("host")} />
                  <FormInputField label="Port" placeholder="587" error={errors.port?.message} {...register("port")} />
                  <Controller name="encryption" control={control} render={({ field }) => (
                    <FormSelectField label="Encryption" options={ENCRYPTION_OPTIONS} value={field.value || ""} onValueChange={field.onChange} error={errors.encryption?.message} />
                  )} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormInputField label="Username" placeholder="user@example.com" error={errors.username?.message} {...register("username")} />
                  <FormInputField label="Password" type="password" placeholder="App password or API key" error={errors.password?.message} {...register("password")} />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => navigate(`/${tenantId}/settings`)}>Cancel</Button>
              <FormSubmitButton isSubmitting={isSubmitting || mutation.isPending} submitText="Save" />
            </div>
          </form>
        )}
      </div>
    </DetailsContainer>
  )
}
