import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, FileText, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DetailsContainer } from "@/components/container"
import { useEmailTemplate } from "@/hooks/useEmailTemplates"
import { EmailTemplateHeader, EmailTemplateInformation, EmailTemplateContent, EmailTemplatePreview } from "./components"

export default function EmailTemplateDetailsPage() {
  const { tenantId, templateId } = useParams<{ tenantId: string; templateId: string }>()
  const navigate = useNavigate()

  const { data: template, isLoading, isError } = useEmailTemplate(templateId || '')

  if (isLoading) {
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

  if (isError || !template) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h2 className="text-2xl font-semibold">Email Template Not Found</h2>
        <p className="text-muted-foreground">The email template you're looking for doesn't exist.</p>
        <Button onClick={() => navigate(`/${tenantId}/branding/email-templates`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Email Templates
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
            onClick={() => navigate(`/${tenantId}/branding/email-templates`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Email Templates
          </Button>
        </div>

        {/* Header */}
        <EmailTemplateHeader
          template={template}
          tenantId={tenantId!}
          templateId={templateId!}
        />

        {/* Template Information */}
        <EmailTemplateInformation template={template} />

        {/* Tabs */}
        <Tabs defaultValue="content">
          <TabsList>
            <TabsTrigger value="content" className="gap-2">
              <FileText className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-6">
            <EmailTemplateContent template={template} />
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            <EmailTemplatePreview template={template} />
          </TabsContent>
        </Tabs>
      </div>
    </DetailsContainer>
  )
}
