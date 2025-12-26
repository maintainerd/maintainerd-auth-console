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
import { useSmsTemplate, useCreateSmsTemplate, useUpdateSmsTemplate } from "@/hooks/useSmsTemplates"
import { useToast } from "@/hooks/useToast"
import type { SmsTemplateStatusType } from "@/services/api/sms-template/types"

// Validation schema
const smsTemplateSchema = yup.object({
  name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters'),
  description: yup.string().required('Description is required').min(3, 'Description must be at least 3 characters'),
  message: yup.string().required('Message is required').min(1, 'Message cannot be empty'),
  sender_id: yup.string().required('Sender ID is required'),
  status: yup.string().oneOf(['active', 'inactive']).required('Status is required'),
})

const STATUS_OPTIONS: SelectOption[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

export default function SmsTemplateForm() {
  const { tenantId, templateId } = useParams<{ tenantId: string; templateId?: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()

  const isEditing = Boolean(templateId)
  const isCreating = !isEditing

  const { data: templateData, isLoading: isFetchingTemplate } = useSmsTemplate(templateId || '')
  const createMutation = useCreateSmsTemplate()
  const updateMutation = useUpdateSmsTemplate()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(smsTemplateSchema),
    defaultValues: {
      name: "",
      description: "",
      message: "",
      sender_id: "",
      status: "active" as const,
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  useEffect(() => {
    if (isEditing && templateData) {
      reset({
        name: templateData.name,
        description: templateData.description,
        message: templateData.message,
        sender_id: templateData.senderId,
        status: templateData.status,
      })
    }
  }, [isEditing, templateData, reset])

  const isLoading = createMutation.isPending || updateMutation.isPending || isSubmitting

  const onSubmit = async (data: yup.InferType<typeof smsTemplateSchema>) => {
    try {
      if (isCreating) {
        await createMutation.mutateAsync({
          name: data.name,
          description: data.description,
          message: data.message,
          sender_id: data.sender_id,
          status: data.status as SmsTemplateStatusType,
        })
        showSuccess("SMS template created successfully")
      } else {
        await updateMutation.mutateAsync({
          id: templateId!,
          data: {
            name: data.name,
            description: data.description,
            message: data.message,
            sender_id: data.sender_id,
            status: data.status as SmsTemplateStatusType,
          }
        })
        showSuccess("SMS template updated successfully")
      }

      navigate(`/${tenantId}/branding/sms-templates`)
    } catch (error) {
      showError(error)
    }
  }

  const pageTitle = isCreating ? "Create SMS Template" : `Edit ${templateData?.name || "SMS Template"}`
  const submitButtonText = isCreating ? "Create Template" : "Update Template"

  if (isEditing && isFetchingTemplate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground mt-2">
            Fetching SMS template details
          </p>
        </div>
      </div>
    )
  }

  if (isEditing && !isFetchingTemplate && !templateData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h2 className="text-2xl font-semibold">SMS Template Not Found</h2>
        <p className="text-muted-foreground">
          The SMS template you're trying to edit doesn't exist.
        </p>
        <Button onClick={() => navigate(`/${tenantId}/branding/sms-templates`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to SMS Templates
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
            ? "Create a new SMS template for your authentication and notification messages."
            : "Update the SMS template details and content."}
          backUrl={`/${tenantId}/branding/sms-templates`}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Template Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormInputField
                label="Name"
                placeholder="e.g., Welcome SMS"
                error={errors.name?.message}
                {...register('name')}
              />

              <FormInputField
                label="Description"
                placeholder="Brief description of this template"
                error={errors.description?.message}
                {...register('description')}
              />

              <FormInputField
                label="Sender ID"
                placeholder="e.g., YourApp"
                error={errors.sender_id?.message}
                {...register('sender_id')}
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
              <CardTitle>Message Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormTextareaField
                label="Message"
                placeholder="Enter your SMS message here..."
                rows={6}
                error={errors.message?.message}
                {...register('message')}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/${tenantId}/branding/sms-templates`)}
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
