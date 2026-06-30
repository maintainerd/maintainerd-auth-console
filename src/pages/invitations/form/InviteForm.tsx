import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DetailsContainer } from "@/components/container"
import { FormPageHeader } from "@/components/header"
import { FormInputField, FormSelectField, FormSubmitButton, type SelectOption } from "@/components/form"
import { useSendInvite } from "@/hooks/useInvites"
import { useRegistrationFlows } from "@/hooks/useRegistrationFlows"
import { useEmailConfigStatus } from "@/hooks/useNotifier"
import { useToast } from "@/hooks/useToast"

const inviteSchema = yup.object({
  email: yup.string().trim().required("Email is required").email("Enter a valid email address"),
})

type InviteFormData = yup.InferType<typeof inviteSchema>

// "default registration" — no registration flow attached.
const NO_FLOW = "__none__"

export default function InviteForm() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const listUrl = `/${tenantId}/invites`

  const sendMutation = useSendInvite()
  const [registrationFlowId, setRegistrationFlowId] = useState<string>(NO_FLOW)

  // Invitations are delivered by email — warn the admin if email isn't configured.
  const { data: emailStatus } = useEmailConfigStatus()
  const emailNotConfigured = emailStatus ? !emailStatus.configured : false

  const { data: flowsData } = useRegistrationFlows({ page: 1, limit: 100, sort_by: "name", sort_order: "asc", status: "active" })
  const flowOptions: SelectOption[] = [
    { value: NO_FLOW, label: "Default registration (no registration flow)" },
    ...(flowsData?.rows ?? []).map((f) => ({ value: f.registration_flow_id, label: f.name })),
  ]

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InviteFormData>({
    resolver: yupResolver(inviteSchema),
    defaultValues: { email: "" },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  })

  const isLoading = sendMutation.isPending || isSubmitting

  const onSubmit = async (data: InviteFormData) => {
    try {
      await sendMutation.mutateAsync({
        email: data.email.trim(),
        registration_flow_uuid: registrationFlowId !== NO_FLOW ? registrationFlowId : undefined,
      })
      showSuccess(`Invitation sent to ${data.email.trim()}`)
      navigate(listUrl)
    } catch (error) {
      showError(error)
    }
  }

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        <FormPageHeader
          backUrl={listUrl}
          backLabel="Back to Invitations"
          title="Invite User"
          description="Send a signed email invitation. The recipient registers under this email — they can't change it."
        />

        {emailNotConfigured && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Email delivery is not configured</AlertTitle>
            <AlertDescription className="flex flex-col items-start gap-2">
              <span>
                Invitations are delivered by email. Configure an email provider so the invitation
                link can be sent.
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigate(`/${tenantId}/messaging/email`)}
              >
                Configure email delivery
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="text-base">Invitation</CardTitle>
              <p className="text-sm text-muted-foreground">Who to invite and how they onboard.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormInputField
                label="Email address"
                type="email"
                placeholder="person@example.com"
                required
                disabled={isLoading}
                error={errors.email?.message}
                {...register("email")}
              />

              <FormSelectField
                label="Registration flow"
                placeholder="Select registration flow"
                options={flowOptions}
                value={registrationFlowId}
                onValueChange={setRegistrationFlowId}
                disabled={isLoading}
                description="Optional — default registration assigns only the registered role. Selecting a flow adds that flow's additional roles on completion."
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate(listUrl)} disabled={isLoading}>
              Cancel
            </Button>
            <FormSubmitButton isSubmitting={isLoading} submitText="Send Invite" />
          </div>
        </form>
      </div>
    </DetailsContainer>
  )
}
