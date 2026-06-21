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
import { useSmsTemplate, useUpdateSmsTemplate } from "@/hooks/useSmsTemplates"
import { useToast } from "@/hooks/useToast"
import type { SmsTemplateStatus } from "@/services/api/sms-templates/types"

const smsTemplateSchema = yup.object({
  name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters'),
  description: yup.string().required('Description is required').min(3, 'Description must be at least 3 characters'),
  message: yup.string().required('Message is required').min(1, 'Message cannot be empty'),
  status: yup.string().oneOf(['active', 'inactive']).required('Status is required'),
})

type SmsTemplateFormData = yup.InferType<typeof smsTemplateSchema>

const STATUS_OPTIONS: SelectOption[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

export default function SmsTemplateForm() {
  const { tenantId, templateId } = useParams<{ tenantId: string; templateId: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const backTo = `/${tenantId}/branding/sms-templates/${templateId}`

  const { data: templateData, isLoading: isFetchingTemplate } = useSmsTemplate(templateId || '')
  const updateMutation = useUpdateSmsTemplate()

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<SmsTemplateFormData>({
    resolver: yupResolver(smsTemplateSchema),
    defaultValues: { name: "", description: "", message: "", status: "active" },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  })

  const initialized = useRef(false)
  useEffect(() => {
    if (templateData && !initialized.current) {
      initialized.current = true
      reset({ name: templateData.name, description: templateData.description, message: templateData.message, status: templateData.status })
    }
  }, [templateData, reset])

  const isBusy = updateMutation.isPending || isSubmitting

  const onSubmit = async (data: SmsTemplateFormData) => {
    if (!templateId) return
    try {
      await updateMutation.mutateAsync({
        id: templateId,
        data: {
          description: data.description,
          message: data.message,
          status: data.status as SmsTemplateStatus,
        },
      })
      showSuccess("SMS template updated successfully")
      navigate(backTo)
    } catch (error) {
      showError(error, "Failed to save SMS template")
    }
  }

  if (isFetchingTemplate) {
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
          backUrl={backTo}
          backLabel="Back to SMS Template"
          title="Edit SMS Template"
          description="Update the SMS template details, content, and status."
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className="shadow-xs">
            <CardHeader><CardTitle>Template Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormInputField label="Name" placeholder="e.g., otp_verification" description="Template identifier — cannot be changed." disabled error={errors.name?.message} required {...register("name")} />
              <FormInputField label="Description" placeholder="Brief description of this template" disabled={isBusy} error={errors.description?.message} required {...register("description")} />
              <Controller name="status" control={control} render={({ field }) => (
                <FormSelectField label="Status" placeholder="Select status" options={STATUS_OPTIONS} value={field.value} onValueChange={field.onChange} disabled={isBusy} error={errors.status?.message} required />
              )} />
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader><CardTitle>Message Content</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormTextareaField label="Message" placeholder="Enter your SMS message here..." description="The SMS body text sent to recipients." rows={6} disabled={isBusy} error={errors.message?.message} required {...register("message")} />
            </CardContent>
          </Card>

          {templateData?.parametersDoc && (
            <Card className="shadow-xs">
              <CardHeader>
                <CardTitle className="text-base">Template Parameters</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Use these variables in the message content. They will be replaced with actual values when the SMS is sent.
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
            <Button type="button" variant="outline" onClick={() => navigate(backTo)} disabled={isBusy}>Cancel</Button>
            <FormSubmitButton isSubmitting={isBusy} submitText="Update Template" />
          </div>
        </form>
      </div>
    </DetailsContainer>
  )
}
