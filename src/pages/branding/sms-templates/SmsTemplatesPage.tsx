import { PageContainer, PageHeader } from "@/components/layout"
import { DetailsContainer } from "@/components/container"
import { SmsTemplateListing } from "./components/SmsTemplateListing"

export default function SmsTemplatesPage() {
  return (
    <DetailsContainer>
      <PageContainer>
        <PageHeader
          title="SMS Templates"
          description="Create and manage SMS templates for authentication, notifications, and system communications."
        />
        <SmsTemplateListing />
      </PageContainer>
    </DetailsContainer>
  )
}
