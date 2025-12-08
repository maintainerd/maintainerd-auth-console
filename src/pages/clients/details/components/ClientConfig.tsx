import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings } from "lucide-react"
import { useClient, useClientConfig } from "@/hooks/useClients"

interface ClientConfigProps {
  clientId: string
}

export function ClientConfig({ clientId }: ClientConfigProps) {
  const { data: clientData, isLoading: isLoadingClient, isError: isClientError } = useClient(clientId)
  const { data: configData, isLoading: isLoadingConfig, isError: isConfigError } = useClientConfig(clientId)

  const isLoading = isLoadingClient || isLoadingConfig
  const isError = isClientError || isConfigError

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Client Configuration</CardTitle>
            <p className="text-sm text-muted-foreground">
              OAuth 2.0 and OpenID Connect configuration settings for this client.
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
  if (isError || !configData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Client Configuration</CardTitle>
            <p className="text-sm text-muted-foreground">
              OAuth 2.0 and OpenID Connect configuration settings for this client.
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

  const config = configData.config || {}
  const uris = clientData?.uris || []

  // Separate config sections (URIs are now managed separately via client.uris)
  const corsKeys = ['cors_enabled']
  const tokenKeys = ['access_token_lifetime', 'refresh_token_lifetime', 'refresh_token_rotation', 'multi_resource_refresh_token']

  // Group URIs by type
  const loginUri = uris.find(u => u.type === 'login-uri')
  const redirectUris = uris.filter(u => u.type === 'redirect-uri')
  const allowedOrigins = uris.filter(u => u.type === 'origin-uri')
  const allowedLogoutUrls = uris.filter(u => u.type === 'logout-uri')
  const corsAllowedOrigins = uris.filter(u => u.type === 'cors-origin-uri')

  const corsConfig: Record<string, unknown> = {}
  const tokenConfig: Record<string, unknown> = {}
  const customConfig: Record<string, unknown> = {}

  Object.entries(config).forEach(([key, value]) => {
    if (key === 'custom' && typeof value === 'object' && value !== null) {
      // Extract custom fields from the "custom" key
      Object.assign(customConfig, value)
    } else if (corsKeys.includes(key)) {
      corsConfig[key] = value
    } else if (tokenKeys.includes(key)) {
      tokenConfig[key] = value
    }
  })

  const corsEntries = Object.entries(corsConfig)
  const tokenEntries = Object.entries(tokenConfig)
  const customEntries = Object.entries(customConfig)

  // Check if there are any URIs to display
  const hasApplicationUris = loginUri || redirectUris.length > 0 || allowedOrigins.length > 0 || allowedLogoutUrls.length > 0

  return (
    <div className="space-y-6">
      {/* Application URIs */}
      {hasApplicationUris && (
        <Card>
          <CardHeader>
            <CardTitle>Application URIs</CardTitle>
            <p className="text-sm text-muted-foreground">
              Application URLs and endpoints configuration.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loginUri && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Login URI</p>
                  <p className="text-sm bg-muted p-2 rounded break-all">{loginUri.uri}</p>
                </div>
              )}
              {redirectUris.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Redirect URIs</p>
                  <div className="space-y-2">
                    {redirectUris.map((uri) => (
                      <p key={uri.uri_id} className="text-sm bg-muted p-2 rounded break-all">{uri.uri}</p>
                    ))}
                  </div>
                </div>
              )}
              {allowedOrigins.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Allowed Origins</p>
                  <div className="space-y-2">
                    {allowedOrigins.map((uri) => (
                      <p key={uri.uri_id} className="text-sm bg-muted p-2 rounded break-all">{uri.uri}</p>
                    ))}
                  </div>
                </div>
              )}
              {allowedLogoutUrls.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Allowed Logout URLs</p>
                  <div className="space-y-2">
                    {allowedLogoutUrls.map((uri) => (
                      <p key={uri.uri_id} className="text-sm bg-muted p-2 rounded break-all">{uri.uri}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cross Origin Authentication */}
      {(corsEntries.length > 0 || corsAllowedOrigins.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Cross Origin Authentication</CardTitle>
            <p className="text-sm text-muted-foreground">
              CORS settings for cross-origin authentication requests.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {corsEntries.map(([key, value]) => (
                <div key={key}>
                  <p className="text-sm font-medium text-muted-foreground capitalize">
                    {key.replace(/_/g, ' ')}
                  </p>
                  <p className="text-sm bg-muted p-2 rounded break-all">
                    {typeof value === 'boolean'
                      ? (value ? 'Enabled' : 'Disabled')
                      : String(value)
                    }
                  </p>
                </div>
              ))}
              {corsAllowedOrigins.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">CORS Allowed Origins</p>
                  <div className="space-y-2">
                    {corsAllowedOrigins.map((uri) => (
                      <p key={uri.uri_id} className="text-sm bg-muted p-2 rounded break-all">{uri.uri}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Token Configuration */}
      {tokenEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Token Configuration</CardTitle>
            <p className="text-sm text-muted-foreground">
              Token lifetime and security settings.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {tokenEntries.map(([key, value]) => (
                <div key={key}>
                  <p className="text-sm font-medium text-muted-foreground capitalize">
                    {key.replace(/_/g, ' ')}
                  </p>
                  <p className="text-sm bg-muted p-2 rounded break-all">
                    {typeof value === 'boolean'
                      ? (value ? 'Enabled' : 'Disabled')
                      : key.includes('lifetime')
                      ? `${value} seconds (${Number(value) / 3600} hours)`
                      : String(value)
                    }
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Custom Configurations */}
      {customEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Custom Configurations</CardTitle>
            <p className="text-sm text-muted-foreground">
              Additional custom configuration fields specific to this client.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {customEntries.map(([key, value]) => (
                <div key={key} className="grid gap-3 md:grid-cols-2">
                  <p className="text-sm bg-muted px-3 py-2 rounded font-mono break-all">
                    {key}
                  </p>
                  <p className="text-sm bg-muted px-3 py-2 rounded font-mono break-all">
                    {typeof value === 'boolean'
                      ? (value ? 'true' : 'false')
                      : Array.isArray(value)
                      ? value.join(', ')
                      : typeof value === 'object'
                      ? JSON.stringify(value, null, 2)
                      : String(value)
                    }
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {!hasApplicationUris && corsEntries.length === 0 && tokenEntries.length === 0 && customEntries.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              No configuration settings available
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

