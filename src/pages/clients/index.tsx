import { ClientDataTable } from "./components/ClientDataTable"
import { clientColumns } from "./components/ClientColumns"
import { MOCK_CLIENTS } from "./constants"

export default function ClientsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Client Management</h1>
        <p className="text-muted-foreground">
          Manage OAuth clients and applications that integrate with your authentication system. Configure client types, permissions, and security settings for web apps, mobile apps, and machine-to-machine services.
        </p>
      </div>

      <ClientDataTable columns={clientColumns} data={MOCK_CLIENTS} />
    </div>
  )
}
