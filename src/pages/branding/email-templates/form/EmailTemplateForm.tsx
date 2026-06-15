import { useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DetailsContainer } from "@/components/container"
import { FormPageHeader } from "@/components/header"
import {
  FormInputField,
  FormSelectField,
  FormTextareaField,
  FormSubmitButton,
  type SelectOption
} from "@/components/form"
import { useEmailTemplate, useCreateEmailTemplate, useUpdateEmailTemplate } from "@/hooks/useEmailTemplates"
import { useToast } from "@/hooks/useToast"
import type { EmailTemplateStatus } from "@/services/api/email-templates/types"

const emailTemplateSchema = yup.object({
  name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters'),
  subject: yup.string().required('Subject is required').min(3, 'Subject must be at least 3 characters'),
  body_html: yup.string().required('HTML content is required'),
  body_plain: yup.string().required('Plain text content is required'),
  status: yup.string().oneOf(['active', 'inactive']).required('Status is required'),
})

type EmailTemplateFormData = yup.InferType<typeof emailTemplateSchema>

const STATUS_OPTIONS: SelectOption[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

export default function EmailTemplateForm() {
  const { tenantId, templateId } = useParams<{ tenantId: string; templateId?: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()

  const isEditing = Boolean(templateId)

  const { data: templateData, isLoading: isFetchingTemplate } = useEmailTemplate(templateId || '')
  const createMutation = useCreateEmailTemplate()
  const updateMutation = useUpdateEmailTemplate()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmailTemplateFormData>({
    resolver: yupResolver(emailTemplateSchema),
    defaultValues: {
      name: "",
      subject: "",
      body_html: "",
      body_plain: "",
      status: "active",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  })

  const initialized = useRef(false)
  useEffect(() => {
    if (isEditing && templateData && !initialized.current) {
      initialized.current = true
      reset({
        name: templateData.name,
        subject: templateData.subject,
        body_html: templateData.bodyHtml,
        body_plain: templateData.bodyPlain,
        status: templateData.status,
      })
    }
  }, [isEditing, templateData, reset])

  const isLoading =
    isFetchingTemplate || createMutation.isPending || updateMutation.isPending || isSubmitting

  const onSubmit = async (data: EmailTemplateFormData) => {
    try {
      if (isEditing && templateId) {
        await updateMutation.mutateAsync({
          id: templateId,
          data: {
            name: data.name,
            subject: data.subject,
            body_html: data.body_html,
            body_plain: data.body_plain,
            status: data.status as EmailTemplateStatus,
          },
        })
        showSuccess("Email template updated successfully")
      } else {
        await createMutation.mutateAsync({
          name: data.name,
          subject: data.subject,
          body_html: data.body_html,
          body_plain: data.body_plain,
          status: data.status as EmailTemplateStatus,
        })
        showSuccess("Email template created successfully")
      }
      navigate(`/${tenantId}/branding/email-templates`)
    } catch (error) {
      showError(error, "Failed to save email template")
    }
  }

  if (isEditing && isFetchingTemplate) {
    return (
      <DetailsContainer>
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Loading...</h2>
            <p className="mt-2 text-muted-foreground">Fetching email template details</p>
          </div>
        </div>
      </DetailsContainer>
    )
  }

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        <FormPageHeader
          backUrl={isEditing ? `/${tenantId}/branding/email-templates/${templateId}` : `/${tenantId}/branding/email-templates`}
          backLabel="Back to Email Templates"
          title={isEditing ? "Edit Email Template" : "Create Email Template"}
          description={
            isEditing
              ? "Update the email template details, content, and status."
              : "Create a new email template for authentication and notification emails."
          }
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Template Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormInputField
                label="Name"
                placeholder="e.g., password_reset, welcome_email"
                description="A unique identifier for this template."
                disabled={isLoading}
                error={errors.name?.message}
                required
                {...register("name")}
              />

              <FormInputField
                label="Subject"
                placeholder="Enter email subject line"
                description="The subject line of the email."
                disabled={isLoading}
                error={errors.subject?.message}
                required
                {...register("subject")}
              />

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormSelectField
                    label="Status"
                    placeholder="Select status"
                    options={STATUS_OPTIONS}
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                    error={errors.status?.message}
                    required
                  />
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Email Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormTextareaField
                label="HTML Content"
                placeholder="Enter HTML email template..."
                description="The HTML version of the email body."
                rows={12}
                disabled={isLoading}
                error={errors.body_html?.message}
                required
                {...register("body_html")}
              />

              <FormTextareaField
                label="Plain Text Content"
                placeholder="Enter plain text email template (fallback)..."
                description="The plain text fallback for email clients that don't support HTML."
                rows={8}
                disabled={isLoading}
                error={errors.body_plain?.message}
                required
                {...register("body_plain")}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                navigate(
                  isEditing
                    ? `/${tenantId}/branding/email-templates/${templateId}`
                    : `/${tenantId}/branding/email-templates`,
                )
              }
              disabled={isLoading}
            >
              Cancel
            </Button>
            <FormSubmitButton
              isSubmitting={isLoading}
              submittingText="Saving..."
              submitText={isEditing ? "Update Template" : "Create Template"}
            />
          </div>
        </form>
      </div>
    </DetailsContainer>
  )
}
