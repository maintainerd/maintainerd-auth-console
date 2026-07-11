import { useParams, useNavigate } from "react-router-dom"
import { FileText, Eye } from "lucide-react"
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DetailTabs } from "@/components/details/DetailTabs"
import { DetailLayout } from "@/components/details"
import { useEmailTemplate } from "@/hooks/useEmailTemplates"
import { EmailTemplateHeader, EmailTemplateContent, EmailTemplatePreview } from "./components"

export default function EmailTemplateDetailsPage() {
  const { templateId } = useParams<{ templateId: string }>()
  const navigate = useNavigate()

  const { data: template, isLoading, isError } = useEmailTemplate(templateId || '')

  return (
    <DetailLayout
      backLabel="Back to Email Templates"
      onBack={() => navigate(`/branding/email-templates`)}
      isLoading={isLoading}
      isError={isError || !template}
      notFoundTitle="Email template not found"
      notFoundDescription="The email template you're looking for doesn't exist or may have been removed."
    >
      {template && (
        <>
          <EmailTemplateHeader template={template} templateId={templateId!} />

          <DetailTabs defaultValue="content">
            <TabsList>
              <TabsTrigger value="content" className="gap-2">
                <FileText className="size-4" />
                Content
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-2">
                <Eye className="size-4" />
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content">
              <EmailTemplateContent template={template} />
            </TabsContent>

            <TabsContent value="preview">
              <EmailTemplatePreview template={template} />
            </TabsContent>
          </DetailTabs>
        </>
      )}
    </DetailLayout>
  )
}
