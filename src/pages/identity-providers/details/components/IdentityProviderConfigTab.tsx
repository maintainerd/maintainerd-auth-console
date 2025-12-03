import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Settings } from "lucide-react"

interface IdentityProviderConfigTabProps {
  provider: {
    provider: string
    is_system: boolean
    config: Record<string, any>
  }
}

export function IdentityProviderConfigTab({ provider }: IdentityProviderConfigTabProps) {
  const configEntries = Object.entries(provider.config || {})

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Provider Configuration</CardTitle>
          <p className="text-sm text-muted-foreground">
            {provider.is_system
              ? "Built-in authentication system configuration settings."
              : "External identity provider configuration and connection settings."
            }
          </p>
        </CardHeader>
        <CardContent>
          {provider.is_system ? (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Built-in Authentication</span>
              </div>
              <p className="text-sm text-blue-700">
                This is the system's built-in authentication provider. Configuration is managed automatically
                and includes user management, password policies, and security features.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-900">External Provider</span>
              </div>
              <p className="text-sm text-gray-700">
                This external identity provider is configured to handle user authentication.
                Users will be redirected to this provider for login and registration.
              </p>
            </div>
          )}

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

