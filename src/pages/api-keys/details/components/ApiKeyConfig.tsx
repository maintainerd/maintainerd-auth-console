import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings } from "lucide-react"
import { useApiKeyConfig } from "@/hooks/useApiKeys"

interface ApiKeyConfigProps {
  apiKeyId: string
}

export function ApiKeyConfig({ apiKeyId }: ApiKeyConfigProps) {
  const { data: configData, isLoading, isError } = useApiKeyConfig(apiKeyId)

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>API Key Configuration</CardTitle>
            <p className="text-sm text-muted-foreground">
              Custom configuration settings for this API key.
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
            <CardTitle>API Key Configuration</CardTitle>
            <p className="text-sm text-muted-foreground">
              Custom configuration settings for this API key.
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Settings className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to load configuration</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Unable to fetch API key configuration. Please try again later.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Extract config - API returns config directly in data
  const config = configData || {}
  const configEntries = Object.entries(config)

  return (
    <div className="space-y-6">
      {/* Custom Configurations */}
      {configEntries.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <p className="text-sm text-muted-foreground">
              Custom configuration settings for this API key.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {configEntries.map(([key, value]) => (
                <div key={key} className="grid gap-3 md:grid-cols-2">
                  <div className="text-sm font-medium bg-muted px-3 py-2 rounded break-all">
                    {key}
                  </div>
                  <div className="text-sm bg-muted px-3 py-2 rounded font-mono break-all">
                    {typeof value === 'boolean'
                      ? (value ? 'true' : 'false')
                      : Array.isArray(value)
                      ? value.join(', ')
                      : typeof value === 'object' && value !== null
                      ? JSON.stringify(value, null, 2)
                      : String(value)
                    }
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <p className="text-sm text-muted-foreground">
              Custom configuration settings for this API key.
            </p>
          </CardHeader>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <Settings className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Configuration</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                This API key doesn't have any custom configuration settings yet.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

