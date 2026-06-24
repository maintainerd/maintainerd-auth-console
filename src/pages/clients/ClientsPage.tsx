import { ClientListing } from "./components/ClientListing"
import { PageContainer, PageHeader } from "@/components/layout"

export default function ClientsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Clients"
        description="Manage OAuth clients and applications that integrate with your authentication system. Configure client types, provider connections, permissions, and security settings for web apps, mobile apps, and machine-to-machine services."
      />
      <ClientListing />
    </PageContainer>
  )
}
