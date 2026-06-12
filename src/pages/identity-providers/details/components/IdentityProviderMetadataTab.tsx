import { Braces } from "lucide-react"
import { InformationCard } from "@/components/card"
import { EmptyState } from "@/components/details"
import { getProviderFieldKeys } from "@/components/provider-config"
import type { IdentityProviderDetail } from "@/services/api/identity-providers/types"

interface IdentityProviderMetadataTabProps {
  provider: IdentityProviderDetail
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return ""
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

/**
 * Shows the free-form metadata — config keys beyond the provider's well-known
 * fields. These are merged into the same `config` JSON as the provider fields,
 * so this view filters out the known keys rendered on the Information tab.
 */
export function IdentityProviderMetadataTab({ provider }: IdentityProviderMetadataTabProps) {
  const knownKeys = getProviderFieldKeys(provider.provider)
  const entries = Object.entries(provider.config || {}).filter(([key]) => !knownKeys.includes(key))

  return (
    <InformationCard
      title="Metadata"
      description="Additional configuration stored on this provider beyond its standard fields."
      icon={Braces}
    >
      {entries.length > 0 ? (
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
      ) : (
        <EmptyState
          icon={Braces}
          title="No metadata"
          description="This provider has no additional configuration."
        />
      )}
    </InformationCard>
  )
}
