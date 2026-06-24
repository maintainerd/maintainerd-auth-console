import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { format } from "date-fns"
import { Building2, Eye, Link2, Unlink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InformationCard } from "@/components/card"
import { EmptyState, StatusBadge } from "@/components/details"
import { RowActions, type RowActionItem } from "@/components/data-table"
import { SystemBadge } from "@/components/badges"
import { PROVIDER_LABELS, ProviderLogo } from "@/components/provider-config"
import { useRemoveClientIdentityProvider } from "@/hooks/useClients"
import { useToast } from "@/hooks/useToast"
import type { ClientResponse, ClientIdentityProviderConnection } from "@/services/api/clients/types"
import { ConnectProviderDialog } from "./ConnectProviderDialog"

interface ClientIdentityProvidersProps {
  client: ClientResponse
}

export function ClientIdentityProviders({ client }: ClientIdentityProvidersProps) {
  const { tenantId, clientId } = useParams<{ tenantId: string; clientId: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const removeConnectionMutation = useRemoveClientIdentityProvider()
  const [connectDialogOpen, setConnectDialogOpen] = useState(false)

  const connections = [...(client.connections ?? [])].sort((a, b) => a.display_order - b.display_order)
  const connectedProviderIds = connections.map((connection) => connection.identity_provider.identity_provider_id)

  const disconnectProvider = async (connection: ClientIdentityProviderConnection) => {
    if (!clientId) return

    try {
      await removeConnectionMutation.mutateAsync({
        clientId,
        connectionId: connection.client_identity_provider_id,
      })
      showSuccess(`Disconnected ${connection.identity_provider.display_name} from ${client.display_name}`)
    } catch (error) {
      showError(error)
    }
  }

  return (
    <InformationCard
      title="Identity Providers"
      description="Identity sources this client can use during sign-in."
      icon={Building2}
      action={
        <Button onClick={() => setConnectDialogOpen(true)} size="sm">
          <Link2 className="mr-2 size-4" />
          Connect provider
        </Button>
      }
    >
      <div className="space-y-4">
        {connections.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No identity providers connected"
            description="Connect an identity provider to make it available as a sign-in option for this client."
          />
        ) : (
          connections.map((connection) => {
            const provider = connection.identity_provider
            const actions: RowActionItem[] = [
              {
                key: "view",
                label: "View Provider",
                icon: Eye,
                onSelect: () => navigate(`/${tenantId}/providers/identity/${provider.identity_provider_id}`),
              },
            ]

            if (!provider.is_system) {
              actions.push({
                key: "disconnect",
                label: "Disconnect",
                icon: Unlink,
                destructive: true,
                onSelect: () => disconnectProvider(connection),
                confirm: {
                  title: "Disconnect Identity Provider",
                  description: `This will remove ${provider.display_name} as a sign-in option for this client. The provider itself will not be deleted.`,
                  destructive: true,
                  itemName: provider.name,
                  confirmText: "Disconnect",
                },
              })
            }

            return (
              <div key={connection.client_identity_provider_id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <ProviderLogo provider={provider.provider} className="size-10" />
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold">{provider.display_name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {PROVIDER_LABELS[provider.provider] ?? provider.provider}
                        </Badge>
                        <StatusBadge status={provider.status} />
                        <SystemBadge isSystem={provider.is_system} />
                        {connection.is_default && (
                          <Badge variant="outline" className="text-xs">
                            Default
                          </Badge>
                        )}
                        {!connection.enabled && (
                          <Badge variant="outline" className="text-xs">
                            Disabled
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{provider.name}</p>
                      <p className="break-all font-mono text-xs text-muted-foreground">{provider.identifier}</p>
                    </div>
                  </div>
                  <RowActions items={actions} />
                </div>

                <div className="mt-4 grid gap-3 border-t pt-4 text-xs text-muted-foreground md:grid-cols-3">
                  <div>
                    <span className="font-medium">Connection UUID</span>
                    <p className="break-all font-mono">{connection.client_identity_provider_id}</p>
                  </div>
                  <div>
                    <span className="font-medium">Display order</span>
                    <p>{connection.display_order}</p>
                  </div>
                  <div>
                    <span className="font-medium">Connected</span>
                    <p>{format(new Date(connection.created_at), "PPpp")}</p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <ConnectProviderDialog
        open={connectDialogOpen}
        onOpenChange={setConnectDialogOpen}
        clientId={client.client_id}
        clientName={client.display_name}
        existingProviderIds={connectedProviderIds}
      />
    </InformationCard>
  )
}
