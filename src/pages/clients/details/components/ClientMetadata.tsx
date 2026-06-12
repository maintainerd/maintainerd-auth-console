import { Braces } from "lucide-react"
import { InformationCard } from "@/components/card"
import { EmptyState } from "@/components/details"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useClientConfig } from "@/hooks/useClients"
import { formatClientConfigValue, getClientMetadataEntries } from "../../clientConfig"

interface ClientMetadataProps {
  clientId: string
}

export function ClientMetadata({ clientId }: ClientMetadataProps) {
  const { data: configData, isLoading, isError } = useClientConfig(clientId)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Client Metadata</CardTitle>
          <p className="text-sm text-muted-foreground">
            Non-common provider and application metadata stored on this client.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent mb-4" />
            <p className="text-sm text-muted-foreground">Loading metadata...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Client Metadata</CardTitle>
          <p className="text-sm text-muted-foreground">
            Non-common provider and application metadata stored on this client.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Braces className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load metadata</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Unable to fetch client metadata. Please try again later.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const metadataEntries = getClientMetadataEntries(configData ?? {})

  return (
    <InformationCard
      title="Client Metadata"
      description="Provider-specific and application-specific fields beyond common client configuration."
      icon={Braces}
    >
      {metadataEntries.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {metadataEntries.map(([key, value]) => (
            <div key={key} className="space-y-1">
              <p className="font-mono text-sm font-medium text-muted-foreground">{key}</p>
              <p className="break-all rounded bg-muted px-2 py-1.5 font-mono text-sm">
                {formatClientConfigValue(value) || "—"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Braces}
          title="No metadata"
          description="This client has no non-common provider or application metadata."
        />
      )}
    </InformationCard>
  )
}
