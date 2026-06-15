import { PageContainer, PageHeader } from "@/components/layout"
import { DetailsContainer } from "@/components/container"
import { EmailTemplateListing } from "./components/EmailTemplateListing"

export default function EmailTemplatesPage() {
  return (
    <DetailsContainer>
      <PageContainer>
        <PageHeader
          title="Email Templates"
          description="Create and manage email templates for authentication, notifications, and system communications."
        />
        <EmailTemplateListing />
      </PageContainer>
    </DetailsContainer>
  )
}
