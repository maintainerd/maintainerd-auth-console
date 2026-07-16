import { ClientListing } from "./components/ClientListing"
import { PageHeader } from "@/components/layout"

export default function ClientsPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <PageHeader
        title="Clients"
        description="Manage OAuth clients and applications that integrate with your authentication system. Configure client types, provider connections, permissions, and security settings for web apps, mobile apps, and machine-to-machine services."
      />
      <ClientListing tableInCard />
    </div>
  )
}
