import { useParams, useNavigate } from "react-router-dom"
import { FileText } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DetailLayout } from "@/components/details"
import { useSmsTemplate } from "@/hooks/useSmsTemplates"
import { SmsTemplateHeader, SmsTemplateContent } from "./components"

export default function SmsTemplateDetailsPage() {
  const { tenantId, templateId } = useParams<{ tenantId: string; templateId: string }>()
  const navigate = useNavigate()
  const { data: template, isLoading, isError } = useSmsTemplate(templateId || '')

  return (
    <DetailLayout
      backLabel="Back to SMS Templates"
      onBack={() => navigate(`/${tenantId}/branding/sms-templates`)}
      isLoading={isLoading}
      isError={isError || !template}
      notFoundTitle="SMS template not found"
      notFoundDescription="The SMS template you're looking for doesn't exist or may have been removed."
    >
      {template && (
        <>
          <SmsTemplateHeader template={template} tenantId={tenantId!} templateId={templateId!} />

          <Tabs defaultValue="content">
            <TabsList>
              <TabsTrigger value="content" className="gap-2">
                <FileText className="size-4" />Content
              </TabsTrigger>
            </TabsList>
            <TabsContent value="content" className="mt-4">
              <SmsTemplateContent template={template} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </DetailLayout>
  )
}
