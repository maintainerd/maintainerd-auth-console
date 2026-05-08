import { SmsTemplateListing } from "./components/SmsTemplateListing"
import { PageContainer, PageHeader } from "@/components/layout"

export default function SmsTemplatesPage() {
  return (
    <PageContainer>
      <PageHeader
        title="SMS Templates"
        description="Create and manage SMS templates for authentication, notifications, and marketing campaigns. Design concise messages with variables to deliver personalized communications via text message."
      />
      <SmsTemplateListing />
    </PageContainer>
  )
}
