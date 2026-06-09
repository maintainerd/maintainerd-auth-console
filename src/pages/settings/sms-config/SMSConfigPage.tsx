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
import { fetchSMSConfig, updateSMSConfig, type SMSConfigUpdate } from "@/services/api/notifier"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

const PROVIDER_OPTIONS: SelectOption[] = [
  { value: "twilio", label: "Twilio" },
  { value: "sns", label: "AWS SNS" },
  { value: "vonage", label: "Vonage" },
  { value: "messagebird", label: "MessageBird" },
]

const schema = yup.object({
  provider: yup.string().required("Provider is required"),
  account_sid: yup.string(),
  auth_token: yup.string(),
  from_number: yup.string(),
  sender_id: yup.string(),
  daily_send_limit: yup.number().transform((v) => (isNaN(v) ? undefined : v)),
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

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { provider: "twilio" },
    mode: "onSubmit",
  })

  useEffect(() => { if (data) reset(data) }, [data, reset])

  const mutation = useMutation({
    mutationFn: updateSMSConfig,
    onSuccess: () => { showSuccess("SMS config saved"); queryClient.invalidateQueries({ queryKey: ["sms-config"] }) },
    onError: (e) => showError(e),
  })

  const onSubmit = (formData: FormData) => mutation.mutate({ ...formData, provider: formData.provider! } as SMSConfigUpdate)

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        <FormPageHeader backUrl={`/${tenantId}/settings`} backLabel="Back to Settings" title="SMS Delivery" description="Configure how SMS messages are sent from the platform." />

        {isLoading && (
          <Card className="shadow-xs">
            <CardContent className="space-y-4 pt-6">
              <Skeleton className="h-5 w-40" />
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (<Skeleton key={i} className="h-10 w-full" />))}
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card className="shadow-xs">
              <CardHeader>
                <CardTitle className="text-base">Provider</CardTitle>
                <p className="text-sm text-muted-foreground">Choose your SMS delivery provider and configure credentials.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Controller name="provider" control={control} render={({ field }) => (
                    <FormSelectField label="Provider" options={PROVIDER_OPTIONS} value={field.value} onValueChange={field.onChange} error={errors.provider?.message} required />
                  )} />
                  <FormInputField label="Account SID / Access Key" placeholder="AC..." error={errors.account_sid?.message} {...register("account_sid")} />
                  <FormInputField label="Auth Token / Secret Key" type="password" placeholder="Enter auth token" error={errors.auth_token?.message} {...register("auth_token")} />
                  <FormInputField label="From Number" placeholder="+1234567890" error={errors.from_number?.message} {...register("from_number")} />
                  <FormInputField label="Sender ID" placeholder="MyApp" error={errors.sender_id?.message} {...register("sender_id")} />
                  <FormInputField label="Daily Send Limit" placeholder="1000" error={errors.daily_send_limit?.message} {...register("daily_send_limit")} />
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
