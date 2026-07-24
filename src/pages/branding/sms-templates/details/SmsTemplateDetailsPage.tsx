import { useParams, useNavigate } from "react-router-dom"
import { FileText } from "lucide-react"
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DetailTabs } from "@/components/details/DetailTabs"
import { DetailLayout } from "@/components/details"
import { useSmsTemplate } from "@/hooks/useSmsTemplates"
import { SmsTemplateHeader, SmsTemplateContent } from "./components"

export default function SmsTemplateDetailsPage() {
  const { templateId } = useParams<{ templateId: string }>()
  const navigate = useNavigate()
  const { data: template, isLoading, isError } = useSmsTemplate(templateId || '')

  return (
    <DetailLayout
      backLabel="Back to SMS Templates"
      onBack={() => navigate(`/branding?tab=sms-templates`)}
      isLoading={isLoading}
      isError={isError || !template}
      notFoundTitle="SMS template not found"
      notFoundDescription="The SMS template you're looking for doesn't exist or may have been removed."
    >
      {template && (
        <>
          <SmsTemplateHeader template={template} templateId={templateId!} />

          <DetailTabs defaultValue="content">
            <TabsList>
              <TabsTrigger value="content" className="gap-2">
                <FileText className="size-4" />Content
              </TabsTrigger>
            </TabsList>
            <TabsContent value="content">
              <SmsTemplateContent template={template} />
            </TabsContent>
          </DetailTabs>
        </>
      )}
    </DetailLayout>
  )
}
