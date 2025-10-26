import { ApiKeyDataTable } from "./components/ApiKeyDataTable"
import { apiKeyColumns } from "./components/ApiKeyColumns"
import { MOCK_API_KEYS } from "./constants"

export default function ApiKeysPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">API Key Management</h1>
        <p className="text-muted-foreground">
          Manage API keys for programmatic access to your authentication system. Create, configure, and monitor API keys with different permission levels for secure integration with external services and applications.
        </p>
      </div>

      <ApiKeyDataTable columns={apiKeyColumns} data={MOCK_API_KEYS} />
    </div>
  )
}
