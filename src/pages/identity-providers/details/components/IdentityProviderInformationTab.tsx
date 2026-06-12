import { ExternalLink, Info, Settings } from "lucide-react"
import { InformationCard } from "@/components/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getProviderConfigSchema } from "@/components/provider-config"
import type { IdentityProviderDetail } from "@/services/api/identity-providers/types"

interface IdentityProviderInformationTabProps {
  provider: IdentityProviderDetail
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return ""
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

/**
 * Read-only mirror of the provider-aware section of the form: it renders the
 * well-known, provider-level config fields (grouped) for the selected provider.
 * Client credentials are intentionally absent — those live under the Clients tab.
 */
export function IdentityProviderInformationTab({ provider }: IdentityProviderInformationTabProps) {
  const schema = getProviderConfigSchema(provider.provider)
  const config = provider.config || {}
  const hasFields = Boolean(schema && schema.groups.length > 0)

  return (
    <InformationCard
      title="Provider Information"
      description={schema?.summary ?? "Connection details for this identity provider."}
      icon={Settings}
    >
      <div className="space-y-6">
        {schema?.docsUrl && (
          <a
            href={schema.docsUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {schema.docsLabel ?? "Setup documentation"}
          </a>
        )}

        {hasFields ? (
          schema!.groups.map((group, groupIndex) => (
            <div key={group.title} className="space-y-4">
              {groupIndex > 0 && <div className="border-t" />}
              <div className="space-y-0.5">
                <h4 className="text-sm font-semibold">{group.title}</h4>
                {group.description && (
                  <p className="text-sm text-muted-foreground">{group.description}</p>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {group.fields.map((field) => {
                  const value = formatValue(config[field.key])
                  return (
                    <div key={field.key} className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">{field.label}</p>
                      {value ? (
                        <p className="break-all rounded bg-muted px-2 py-1.5 font-mono text-sm">
                          {value}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">—</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        ) : (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              This provider has no provider-level configuration. Authentication is handled through
              its clients.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </InformationCard>
  )
}
