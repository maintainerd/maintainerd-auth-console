import { format } from "date-fns"
import { InformationCard } from "@/components/card"
import { AppWindow, Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/details"
import { SystemBadge } from "@/components/badges"
import { ProviderLogo } from "@/components/provider-config"
import type { ClientResponse } from "@/services/api/clients/types"

interface ClientInformationProps {
  client: ClientResponse
}

const CLIENT_TYPE_LABELS: Record<string, string> = {
  traditional: "Traditional Web Application",
  mobile: "Native Mobile Application",
  spa: "Single Page Application",
  m2m: "Machine to Machine",
}

export function ClientInformation({ client }: ClientInformationProps) {
  const provider = client.identity_provider

  return (
    <div className="space-y-4">
      <InformationCard
        title="Client Overview"
        description="Core client fields returned by the backend."
        icon={AppWindow}
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <DetailField label="Display Name" value={client.display_name} />
          <DetailField label="Name" value={client.name} mono />
          <DetailField label="Client UUID" value={client.client_id} mono />
          <DetailField label="Client Type" value={CLIENT_TYPE_LABELS[client.client_type] ?? client.client_type} />
          <DetailField label="Domain" value={client.domain || "-"} mono />
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={client.status} />
              <SystemBadge isSystem={client.is_system} />
              {client.is_default && (
                <Badge variant="outline" className="text-xs">
                  Default
                </Badge>
              )}
            </div>
          </div>
          <DetailField label="Created" value={format(new Date(client.created_at), "PPpp")} />
          <DetailField label="Last Updated" value={format(new Date(client.updated_at), "PPpp")} />
        </div>
      </InformationCard>

      <InformationCard
        title="Identity Provider"
        description="The provider pool this client authenticates through."
        icon={Building2}
      >
        {provider ? (
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <ProviderLogo provider={provider.provider} className="size-10" />
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold">{provider.display_name}</p>
                  <Badge variant="secondary" className="text-xs capitalize">{provider.provider}</Badge>
                  <StatusBadge status={provider.status} />
                  <SystemBadge isSystem={provider.is_system} />
                  {provider.is_default && (
                    <Badge variant="outline" className="text-xs">
                      Default
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{provider.name}</p>
                <p className="text-xs font-mono text-muted-foreground break-all">{provider.identifier}</p>
              </div>
            </div>

            <div className="grid gap-5 border-t pt-5 md:grid-cols-2 xl:grid-cols-3">
              <DetailField label="Provider UUID" value={provider.identity_provider_id} mono />
              <DetailField label="Provider Type" value={provider.provider_type} />
              <DetailField label="Provider" value={provider.provider} />
              <DetailField label="Created" value={format(new Date(provider.created_at), "PPpp")} />
              <DetailField label="Last Updated" value={format(new Date(provider.updated_at), "PPpp")} />
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No identity provider is attached to this client.</p>
        )}
      </InformationCard>
    </div>
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
