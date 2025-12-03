import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings } from "lucide-react"

interface SocialProviderConfigTabProps {
  provider: {
    provider: string
    config: Record<string, any>
  }
}

export function SocialProviderConfigTab({ provider }: SocialProviderConfigTabProps) {
  const configEntries = Object.entries(provider.config || {})

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Provider Configuration</CardTitle>
          <p className="text-sm text-muted-foreground">
            Social authentication provider configuration and OAuth settings.
          </p>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="h-4 w-4 text-gray-600" />
              <span className="font-medium text-gray-900">Social Provider</span>
            </div>
            <p className="text-sm text-gray-700">
              This social provider is configured to handle user authentication through OAuth.
              Users can sign in using their social media accounts.
            </p>
          </div>

          {configEntries.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {configEntries.map(([key, value]) => (
                <div key={key}>
                  <p className="text-sm font-medium text-muted-foreground capitalize">
                    {key.replace(/_/g, ' ')}
                  </p>
                  <p className="text-sm bg-muted p-2 rounded break-all">
                    {typeof value === 'boolean' 
                      ? (value ? 'Enabled' : 'Disabled')
                      : typeof value === 'object'
                      ? JSON.stringify(value, null, 2)
                      : String(value)
                    }
                  </p>
                </div>
              ))}
            </div>
          )}

          {configEntries.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No configuration settings available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

