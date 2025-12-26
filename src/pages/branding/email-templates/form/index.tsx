import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import type { EmailTemplateStatusType } from "@/services/api/email-template/types"

// Validation schema
const emailTemplateSchema = yup.object({
  name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters'),
  subject: yup.string().required('Subject is required').min(3, 'Subject must be at least 3 characters'),
  body_html: yup.string().required('HTML content is required'),
  body_plain: yup.string().required('Plain text content is required'),
  status: yup.string().oneOf(['active', 'inactive']).required('Status is required'),
})

const STATUS_OPTIONS: SelectOption[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

export default function EmailTemplateForm() {
  const { tenantId, templateId } = useParams<{ tenantId: string; templateId?: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()

  const isEditing = Boolean(templateId)
  const isCreating = !isEditing

  const { data: templateData, isLoading: isFetchingTemplate } = useEmailTemplate(templateId || '')
  const createMutation = useCreateEmailTemplate()
  const updateMutation = useUpdateEmailTemplate()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(emailTemplateSchema),
    defaultValues: {
      name: "",
      subject: "",
      body_html: "",
      body_plain: "",
      status: "active" as const,
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  useEffect(() => {
    if (isEditing && templateData) {
      reset({
        name: templateData.name,
        subject: templateData.subject,
        body_html: templateData.bodyHtml,
        body_plain: templateData.bodyPlain,
        status: templateData.status,
      })
    }
  }, [isEditing, templateData, reset])

  const isLoading = createMutation.isPending || updateMutation.isPending || isSubmitting

  const onSubmit = async (data: yup.InferType<typeof emailTemplateSchema>) => {
    try {
      if (isCreating) {
        await createMutation.mutateAsync({
          name: data.name,
          subject: data.subject,
          body_html: data.body_html,
          body_plain: data.body_plain,
          status: data.status as EmailTemplateStatusType,
        })
        showSuccess("Email template created successfully")
      } else {
        await updateMutation.mutateAsync({
          id: templateId!,
          data: {
            name: data.name,
            subject: data.subject,
            body_html: data.body_html,
            body_plain: data.body_plain,
            status: data.status as EmailTemplateStatusType,
          }
        })
        showSuccess("Email template updated successfully")
      }

      navigate(`/${tenantId}/branding/email-templates`)
    } catch (error) {
      showError(error)
    }
  }

  const pageTitle = isCreating ? "Create Email Template" : `Edit ${templateData?.name || "Email Template"}`
  const submitButtonText = isCreating ? "Create Template" : "Update Template"

  if (isEditing && isFetchingTemplate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground mt-2">
            Fetching email template details
          </p>
        </div>
      </div>
    )
  }

  if (isEditing && !isFetchingTemplate && !templateData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h2 className="text-2xl font-semibold">Email Template Not Found</h2>
        <p className="text-muted-foreground">
          The email template you're trying to edit doesn't exist.
        </p>
        <Button onClick={() => navigate(`/${tenantId}/branding/email-templates`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Email Templates
        </Button>
      </div>
    )
  }

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        <FormPageHeader
          title={pageTitle}
          description={isCreating
            ? "Create a new email template for your authentication and notification emails."
            : "Update the email template details, content, and design."}
          backUrl={`/${tenantId}/branding/email-templates`}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Template Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormInputField
                label="Name"
                placeholder="e.g., internal:user:password:reset"
                error={errors.name?.message}
                {...register('name')}
              />

              <FormInputField
                label="Subject"
                placeholder="Enter email subject line"
                error={errors.subject?.message}
                {...register('subject')}
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
                    error={errors.status?.message}
                  />
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormTextareaField
                label="HTML Content"
                placeholder="Enter HTML email template..."
                rows={12}
                error={errors.body_html?.message}
                {...register('body_html')}
              />

              <FormTextareaField
                label="Plain Text Content"
                placeholder="Enter plain text email template (fallback)..."
                rows={8}
                error={errors.body_plain?.message}
                {...register('body_plain')}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/${tenantId}/branding/email-templates`)}
            >
              Cancel
            </Button>
            <FormSubmitButton 
              isSubmitting={isLoading} 
              submitText={submitButtonText}
            />
          </div>
        </form>
      </div>
    </DetailsContainer>
  )
}
