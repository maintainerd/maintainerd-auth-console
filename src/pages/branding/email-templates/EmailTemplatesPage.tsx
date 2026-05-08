import { EmailTemplateListing } from "./components/EmailTemplateListing"
import { PageContainer, PageHeader } from "@/components/layout"

export default function EmailTemplatesPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Email Templates"
        description="Create and manage email templates for authentication, notifications, and marketing campaigns. Customize designs, content, and variables to match your brand and communication needs."
      />
      <EmailTemplateListing />
    </PageContainer>
  )
}
