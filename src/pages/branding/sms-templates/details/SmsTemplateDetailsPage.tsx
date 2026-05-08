import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DetailsContainer } from "@/components/container"
import { useSmsTemplate } from "@/hooks/useSmsTemplates"
import { SmsTemplateHeader, SmsTemplateInformation, SmsTemplateContent } from "./components"

export default function SmsTemplateDetailsPage() {
  const { tenantId, templateId } = useParams<{ tenantId: string; templateId: string }>()
  const navigate = useNavigate()

  const { data: template, isLoading, isError } = useSmsTemplate(templateId || '')

  if (isLoading) {
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

  if (isError || !template) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h2 className="text-2xl font-semibold">SMS Template Not Found</h2>
        <p className="text-muted-foreground">The SMS template you're looking for doesn't exist.</p>
        <Button onClick={() => navigate(`/${tenantId}/branding/sms-templates`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to SMS Templates
        </Button>
      </div>
    )
  }

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        {/* Back Button */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/${tenantId}/branding/sms-templates`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to SMS Templates
          </Button>
        </div>

        {/* Header */}
        <SmsTemplateHeader
          template={template}
          tenantId={tenantId!}
          templateId={templateId!}
        />

        {/* Template Information */}
        <SmsTemplateInformation template={template} />

        {/* Content */}
        <SmsTemplateContent template={template} />
      </div>
    </DetailsContainer>
  )
}
