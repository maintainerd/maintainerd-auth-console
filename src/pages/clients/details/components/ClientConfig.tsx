import { Settings } from "lucide-react"
import { InformationCard } from "@/components/card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/details"
import { useClientConfig } from "@/hooks/useClients"
import { formatClientConfigValue, getClientConfigSections } from "../../clientConfig"

interface ClientConfigProps {
  clientId: string
}

export function ClientConfig({ clientId }: ClientConfigProps) {
  const { data: configData, isLoading: isLoadingConfig, isError: isConfigError } = useClientConfig(clientId)

  const isLoading = isLoadingConfig
  const isError = isConfigError

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>OAuth & Token Configuration</CardTitle>
            <p className="text-sm text-muted-foreground">
              Standard OAuth, token, URI, CORS, and client security behavior stored for this client.
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent mb-4" />
              <p className="text-sm text-muted-foreground">Loading configuration...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>OAuth & Token Configuration</CardTitle>
            <p className="text-sm text-muted-foreground">
              Standard OAuth, token, URI, CORS, and client security behavior stored for this client.
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Settings className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to load configuration</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Unable to fetch client configuration. Please try again later.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const config = configData ?? {}
  const sections = getClientConfigSections(config)

  return (
    <InformationCard
      title="OAuth & Token Configuration"
      description="Standard OAuth, OIDC, token, URI, CORS, and client security settings."
      icon={Settings}
    >
      <div className="space-y-6">
        {sections.length > 0 ? (
          sections.map((section, sectionIndex) => (
            <section key={section.title} className="space-y-4">
              {sectionIndex > 0 && <div className="border-t" />}
              <div className="space-y-0.5">
                <h4 className="text-sm font-semibold">{section.title}</h4>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {section.entries.map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <p className="font-mono text-sm font-medium text-muted-foreground">{key}</p>
                    <p className="break-all rounded bg-muted px-2 py-1.5 font-mono text-sm">
                      {formatClientConfigValue(value) || "—"}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))
        ) : (
          <EmptyState
            icon={Settings}
            title="No configuration"
            description="This client has no standard OAuth, token, URI, CORS, or security configuration stored yet."
          />
        )}
      </div>
    </InformationCard>
  )
}
