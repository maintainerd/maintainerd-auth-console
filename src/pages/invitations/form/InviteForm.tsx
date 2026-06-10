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
import { useSignupFlows } from "@/hooks/useSignupFlows"
import { useEmailConfigStatus } from "@/hooks/useNotifier"
import { useToast } from "@/hooks/useToast"

const inviteSchema = yup.object({
  email: yup.string().trim().required("Email is required").email("Enter a valid email address"),
})

type InviteFormData = yup.InferType<typeof inviteSchema>

// "default registration" — no auth flow attached.
const NO_FLOW = "__none__"

export default function InviteForm() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const listUrl = `/${tenantId}/invites`

  const sendMutation = useSendInvite()
  const [authFlowId, setAuthFlowId] = useState<string>(NO_FLOW)

  // Invitations are delivered by email — warn the admin if email isn't configured.
  const { data: emailStatus } = useEmailConfigStatus()
  const emailNotConfigured = emailStatus ? !emailStatus.configured : false

  const { data: flowsData } = useSignupFlows({ page: 1, limit: 100, sort_by: "name", sort_order: "asc" })
  const flowOptions: SelectOption[] = [
    { value: NO_FLOW, label: "Default registration (no auth flow)" },
    ...(flowsData?.rows ?? []).map((f) => ({ value: f.signup_flow_id, label: f.name })),
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
        auth_flow_uuid: authFlowId !== NO_FLOW ? authFlowId : undefined,
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
                label="Auth flow"
                placeholder="Select auth flow"
                options={flowOptions}
                value={authFlowId}
                onValueChange={setAuthFlowId}
                disabled={isLoading}
                description="Optional — attaches the flow's branding and auto-assigns its roles on completion. Leave as default for normal registration (registered role under the default client, no special branding)."
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
