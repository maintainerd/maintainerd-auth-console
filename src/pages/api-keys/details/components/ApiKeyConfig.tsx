import { Braces } from "lucide-react"
import { InformationCard } from "@/components/card"
import { EmptyState, ListSkeleton } from "@/components/details"
import { useApiKeyConfig } from "@/hooks/useApiKeys"

interface ApiKeyConfigProps {
  apiKeyId: string
}

export function ApiKeyConfig({ apiKeyId }: ApiKeyConfigProps) {
  const { data: configData, isLoading, isError } = useApiKeyConfig(apiKeyId)
  const config = configData || {}
  const configEntries = Object.entries(config)

  return (
    <InformationCard
      title="Configuration"
      description="Custom key-value settings stored with this API key."
      icon={Braces}
    >
      {isLoading && <ListSkeleton rows={3} />}

      {isError && (
        <p className="py-8 text-center text-sm text-destructive">Failed to load configuration</p>
      )}

      {!isLoading && !isError && configEntries.length === 0 && (
        <EmptyState
          icon={Braces}
          title="No configuration"
          description="This API key has no custom configuration settings yet."
        />
      )}

      {!isLoading && !isError && configEntries.length > 0 && (
        <div className="space-y-3">
          {configEntries.map(([key, value]) => (
            <div key={key} className="grid gap-3 rounded-lg border p-3 md:grid-cols-[minmax(0,0.35fr)_minmax(0,1fr)]">
              <div className="break-all font-mono text-sm font-medium text-muted-foreground">
                {key}
              </div>
              <div className="break-all rounded bg-muted px-2 py-1.5 font-mono text-sm">
                {formatConfigValue(value)}
              </div>
            </div>
          ))}
        </div>
      )}
    </InformationCard>
  )
}

function formatConfigValue(value: unknown) {
  if (typeof value === "boolean") return value ? "true" : "false"
  if (Array.isArray(value)) return value.join(", ")
  if (typeof value === "object" && value !== null) return JSON.stringify(value, null, 2)
  return String(value)
}
