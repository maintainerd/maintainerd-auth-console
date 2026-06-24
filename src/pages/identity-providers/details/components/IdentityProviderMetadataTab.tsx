import { ExternalLink, Settings2 } from "lucide-react"
import { InformationCard } from "@/components/card"
import { EmptyState } from "@/components/details"
import {
  getPromotedProviderFieldKeys,
  getProviderConfigSchema,
  getProviderFieldKeys,
} from "@/components/provider-config"
import type { IdentityProviderDetail } from "@/services/api/identity-providers/types"

interface IdentityProviderConfigurationTabProps {
  provider: IdentityProviderDetail
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return ""
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

/**
 * Shows the provider-specific config JSON. Top-level broker connection fields
 * are rendered on the Connection tab, while this tab owns scopes, endpoint
 * overrides, attribute mapping, and extra provider-specific config keys.
 */
export function IdentityProviderConfigurationTab({ provider }: IdentityProviderConfigurationTabProps) {
  const schema = getProviderConfigSchema(provider.provider)
  const config = provider.config || {}
  const knownKeys = [
    ...getProviderFieldKeys(provider.provider),
    ...getPromotedProviderFieldKeys(),
  ]
  const entries = Object.entries(config).filter(([key]) => !knownKeys.includes(key))
  const hasConfigGroups = Boolean(schema && schema.groups.length > 0)

  return (
    <InformationCard
      title="Configuration"
      description={schema?.summary ?? "Provider-specific configuration stored as JSON."}
      icon={Settings2}
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

        {hasConfigGroups && schema!.groups.map((group, groupIndex) => (
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
        ))}

        {entries.length > 0 && (
          <div className="space-y-4">
            {hasConfigGroups && <div className="border-t" />}
            <div className="space-y-0.5">
              <h4 className="text-sm font-semibold">Additional Configuration</h4>
              <p className="text-sm text-muted-foreground">
                Extra config keys not managed by the provider-specific form fields.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {entries.map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <p className="font-mono text-sm font-medium text-muted-foreground">{key}</p>
                  <p className="break-all rounded bg-muted px-2 py-1.5 font-mono text-sm">
                    {formatValue(value) || "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!hasConfigGroups && entries.length === 0 && (
          <EmptyState
            icon={Settings2}
            title="No configuration"
            description="This provider has no provider-specific config JSON."
          />
        )}
      </div>
    </InformationCard>
  )
}
