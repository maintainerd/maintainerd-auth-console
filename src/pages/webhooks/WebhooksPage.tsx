import { WebhookListing } from "./components/WebhookListing"
import { PageContainer, PageHeader } from "@/components/layout"

export default function WebhooksPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Webhooks"
        description="Register endpoints to receive real-time event notifications. Each delivery is signed so your service can verify it came from us."
      />
      <WebhookListing />
    </PageContainer>
  )
}
