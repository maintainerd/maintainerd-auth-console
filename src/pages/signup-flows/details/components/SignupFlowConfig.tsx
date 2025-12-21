import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings } from "lucide-react"
import { useSignupFlow } from "@/hooks/useSignupFlows"

interface SignupFlowConfigProps {
  signupFlowId: string
}

export function SignupFlowConfig({ signupFlowId }: SignupFlowConfigProps) {
  const { data: signupFlowData, isLoading, isError } = useSignupFlow(signupFlowId)

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Sign Up Flow Configuration</CardTitle>
            <p className="text-sm text-muted-foreground">
              Configuration settings for this sign up flow.
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
  if (isError || !signupFlowData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Sign Up Flow Configuration</CardTitle>
            <p className="text-sm text-muted-foreground">
              Configuration settings for this sign up flow.
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Settings className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to load configuration</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Unable to fetch sign up flow configuration. Please try again later.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const config = signupFlowData.config || {}

  // Separate custom config from known fields
  const knownKeys = ['auto_approved']
  const customConfig: Record<string, unknown> = {}

  Object.entries(config).forEach(([key, value]) => {
    if (!knownKeys.includes(key)) {
      customConfig[key] = value
    }
  })

  const customEntries = Object.entries(customConfig)

  return (
    <div className="space-y-6">
      {/* Basic Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Configuration</CardTitle>
          <p className="text-sm text-muted-foreground">
            Core sign up flow settings.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Auto Approved</p>
              <p className="text-sm bg-muted p-2 rounded">
                {config.auto_approved ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Configurations */}
      {customEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Custom Configurations</CardTitle>
            <p className="text-sm text-muted-foreground">
              Additional custom configuration fields specific to this sign up flow.
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
    </div>
  )
}
