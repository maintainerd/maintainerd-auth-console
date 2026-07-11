import { useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DetailsContainer } from "@/components/container"
import { FormPageHeader } from "@/components/header"
import {
  FormInputField,
  FormSelectField,
  FormTextareaField,
  FormSubmitButton,
  type SelectOption
} from "@/components/form"
import { useEmailTemplate, useUpdateEmailTemplate } from "@/hooks/useEmailTemplates"
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
  const { templateId } = useParams<{ templateId: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const backTo = `/branding/email-templates/${templateId}`

  const { data: templateData, isLoading: isFetchingTemplate } = useEmailTemplate(templateId || '')
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
    if (templateData && !initialized.current) {
      initialized.current = true
      reset({
        name: templateData.name,
        subject: templateData.subject,
        body_html: templateData.bodyHtml,
        body_plain: templateData.bodyPlain,
        status: templateData.status,
      })
    }
  }, [templateData, reset])

  const isBusy = updateMutation.isPending || isSubmitting

  const onSubmit = async (data: EmailTemplateFormData) => {
    if (!templateId) return
    try {
      await updateMutation.mutateAsync({
        id: templateId,
        data: {
          subject: data.subject,
          body_html: data.body_html,
          body_plain: data.body_plain,
          status: data.status as EmailTemplateStatus,
        },
      })
      showSuccess("Email template updated successfully")
      navigate(backTo)
    } catch (error) {
      showError(error)
    }
  }

  if (isFetchingTemplate) {
    return (
      <DetailsContainer>
        <div className="flex flex-col gap-6">
          <FormPageHeader backUrl={backTo} backLabel="Back to Template" title="Edit Email Template" description="Update the email template details and content." />
          <Card>
            <CardContent className="space-y-4 pt-6">
              <Skeleton className="h-5 w-40" />
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DetailsContainer>
    )
  }

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        <FormPageHeader
          backUrl={backTo}
          backLabel="Back to Template"
          title="Edit Email Template"
          description="Update the email template details, content, and status."
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Template Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormInputField
                label="Name"
                placeholder="e.g., password_reset, welcome_email"
                description="Template identifier — cannot be changed."
                disabled
                error={errors.name?.message}
                required
                {...register("name")}
              />

              <FormInputField
                label="Subject"
                placeholder="Enter email subject line"
                description="The subject line of the email."
                disabled={isBusy}
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
                    disabled={isBusy}
                    error={errors.status?.message}
                    required
                  />
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Email Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormTextareaField
                label="HTML Content"
                placeholder="Enter HTML email template..."
                description="The HTML version of the email body."
                rows={12}
                disabled={isBusy}
                error={errors.body_html?.message}
                required
                {...register("body_html")}
              />

              <FormTextareaField
                label="Plain Text Content"
                placeholder="Enter plain text email template (fallback)..."
                description="The plain text fallback for email clients that don't support HTML."
                rows={8}
                disabled={isBusy}
                error={errors.body_plain?.message}
                required
                {...register("body_plain")}
              />
            </CardContent>
          </Card>

          {templateData?.parametersDoc && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Template Parameters</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Use these variables in the HTML and plain text content. They will be replaced with actual values when the email is sent.
                </p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-2 text-left font-medium">Parameter</th>
                        <th className="px-4 py-2 text-left font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {templateData.parametersDoc
                        .split('\n')
                        .filter((line) => line.startsWith('|') && !line.includes('---'))
                        .slice(1)
                        .map((line, i) => {
                          const cells = line.split('|').map((c) => c.trim()).filter(Boolean)
                          return (
                            <tr key={i} className="border-b last:border-0">
                              <td className="px-4 py-2 font-mono text-xs">{cells[0]?.replace(/`/g, '')}</td>
                              <td className="px-4 py-2 text-muted-foreground">{cells[1]}</td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate(backTo)} disabled={isBusy}>
              Cancel
            </Button>
            <FormSubmitButton isSubmitting={isBusy} submitText="Update Template" />
          </div>
        </form>
      </div>
    </DetailsContainer>
  )
}
