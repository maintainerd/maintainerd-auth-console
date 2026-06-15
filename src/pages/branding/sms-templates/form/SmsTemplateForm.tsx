import { useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DetailsContainer } from "@/components/container"
import { FormPageHeader } from "@/components/header"
import { FormInputField, FormSelectField, FormTextareaField, FormSubmitButton, type SelectOption } from "@/components/form"
import { useSmsTemplate, useCreateSmsTemplate, useUpdateSmsTemplate } from "@/hooks/useSmsTemplates"
import { useToast } from "@/hooks/useToast"
import type { SmsTemplateStatus } from "@/services/api/sms-templates/types"

const smsTemplateSchema = yup.object({
  name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters'),
  description: yup.string().required('Description is required').min(3, 'Description must be at least 3 characters'),
  message: yup.string().required('Message is required').min(1, 'Message cannot be empty'),
  sender_id: yup.string().required('Sender ID is required'),
  status: yup.string().oneOf(['active', 'inactive']).required('Status is required'),
})

type SmsTemplateFormData = yup.InferType<typeof smsTemplateSchema>

const STATUS_OPTIONS: SelectOption[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

export default function SmsTemplateForm() {
  const { tenantId, templateId } = useParams<{ tenantId: string; templateId?: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()

  const isEditing = Boolean(templateId)

  const { data: templateData, isLoading: isFetchingTemplate } = useSmsTemplate(templateId || '')
  const createMutation = useCreateSmsTemplate()
  const updateMutation = useUpdateSmsTemplate()

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<SmsTemplateFormData>({
    resolver: yupResolver(smsTemplateSchema),
    defaultValues: { name: "", description: "", message: "", sender_id: "", status: "active" },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  })

  const initialized = useRef(false)
  useEffect(() => {
    if (isEditing && templateData && !initialized.current) {
      initialized.current = true
      reset({ name: templateData.name, description: templateData.description, message: templateData.message, sender_id: templateData.senderId, status: templateData.status })
    }
  }, [isEditing, templateData, reset])

  const isLoading = isFetchingTemplate || createMutation.isPending || updateMutation.isPending || isSubmitting

  const onSubmit = async (data: SmsTemplateFormData) => {
    try {
      if (isEditing && templateId) {
        await updateMutation.mutateAsync({ id: templateId, data: { name: data.name, description: data.description, message: data.message, sender_id: data.sender_id, status: data.status as SmsTemplateStatus } })
        showSuccess("SMS template updated successfully")
      } else {
        await createMutation.mutateAsync({ name: data.name, description: data.description, message: data.message, sender_id: data.sender_id, status: data.status as SmsTemplateStatus })
        showSuccess("SMS template created successfully")
      }
      navigate(`/${tenantId}/branding/sms-templates`)
    } catch (error) {
      showError(error, "Failed to save SMS template")
    }
  }

  if (isEditing && isFetchingTemplate) {
    return (
      <DetailsContainer>
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Loading...</h2>
            <p className="mt-2 text-muted-foreground">Fetching SMS template details</p>
          </div>
        </div>
      </DetailsContainer>
    )
  }

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        <FormPageHeader
          backUrl={isEditing ? `/${tenantId}/branding/sms-templates/${templateId}` : `/${tenantId}/branding/sms-templates`}
          backLabel="Back to SMS Templates"
          title={isEditing ? "Edit SMS Template" : "Create SMS Template"}
          description={isEditing ? "Update the SMS template details, content, and status." : "Create a new SMS template for authentication and notification messages."}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className="shadow-xs">
            <CardHeader><CardTitle>Template Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormInputField label="Name" placeholder="e.g., otp_verification" description="A unique identifier for this template." disabled={isLoading} error={errors.name?.message} required {...register("name")} />
              <FormInputField label="Description" placeholder="Brief description of this template" disabled={isLoading} error={errors.description?.message} required {...register("description")} />
              <FormInputField label="Sender ID" placeholder="e.g., YourApp" description="The sender name shown on the recipient's phone." disabled={isLoading} error={errors.sender_id?.message} required {...register("sender_id")} />
              <Controller name="status" control={control} render={({ field }) => (
                <FormSelectField label="Status" placeholder="Select status" options={STATUS_OPTIONS} value={field.value} onValueChange={field.onChange} disabled={isLoading} error={errors.status?.message} required />
              )} />
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader><CardTitle>Message Content</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormTextareaField label="Message" placeholder="Enter your SMS message here..." description="The SMS body text sent to recipients." rows={6} disabled={isLoading} error={errors.message?.message} required {...register("message")} />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate(isEditing ? `/${tenantId}/branding/sms-templates/${templateId}` : `/${tenantId}/branding/sms-templates`)} disabled={isLoading}>Cancel</Button>
            <FormSubmitButton isSubmitting={isLoading} submittingText="Saving..." submitText={isEditing ? "Update Template" : "Create Template"} />
          </div>
        </form>
      </div>
    </DetailsContainer>
  )
}
