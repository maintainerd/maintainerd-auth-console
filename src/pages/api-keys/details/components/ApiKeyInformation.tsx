import { format } from "date-fns"
import { KeyRound } from "lucide-react"
import { InformationCard } from "@/components/card"
import { StatusBadge } from "@/components/details"
import type { ApiKey } from "@/services/api/api-keys/types"

interface ApiKeyInformationProps {
  apiKey: ApiKey
}

export function ApiKeyInformation({ apiKey }: ApiKeyInformationProps) {
  return (
    <InformationCard
      title="API Key Overview"
      description="Core API key fields returned by the backend."
      icon={KeyRound}
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <DetailField label="Name" value={apiKey.name} mono />
        <DetailField label="API Key UUID" value={apiKey.api_key_id} mono />
        <DetailField label="Key Prefix" value={apiKey.key_prefix} mono />
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Status</p>
          <StatusBadge status={apiKey.status} />
        </div>
        <DetailField label="Rate Limit" value={`${apiKey.rate_limit.toLocaleString()} requests/hour`} />
        <DetailField
          label="Expires"
          value={apiKey.expires_at ? format(new Date(apiKey.expires_at), "PPpp") : "Never"}
        />
        <DetailField label="Created" value={format(new Date(apiKey.created_at), "PPpp")} />
        <DetailField label="Last Updated" value={format(new Date(apiKey.updated_at), "PPpp")} />
        <div className="space-y-1 md:col-span-2 xl:col-span-3">
          <p className="text-sm font-medium text-muted-foreground">Description</p>
          <p className="break-words text-sm">{apiKey.description || "-"}</p>
        </div>
      </div>
    </InformationCard>
  )
}

function DetailField({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className={mono ? "break-all font-mono text-sm" : "break-words text-sm"}>{value}</p>
    </div>
  )
}
