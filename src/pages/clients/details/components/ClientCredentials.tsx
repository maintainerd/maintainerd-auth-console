import { useState } from "react"
import { Eye, EyeOff, Copy, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/useToast"
import { useClientSecret } from "@/hooks/useClients"
import type { ClientTypeEnum } from "@/services/api/auth-client/types"

interface ClientCredentialsProps {
  clientId: string
  clientType: ClientTypeEnum
}

export function ClientCredentials({ clientId, clientType }: ClientCredentialsProps) {
  const { showSuccess } = useToast()
  const [showCredentials, setShowCredentials] = useState(false)
  const [fetchSecretEnabled, setFetchSecretEnabled] = useState(false)

  // Determine if client secret should be shown based on client type
  const shouldShowSecret = clientType === 'traditional' || clientType === 'm2m'

  // Fetch client secret from API (only when enabled)
  const { data: secretData, isLoading: isLoadingSecret } = useClientSecret(clientId, fetchSecretEnabled)

  const handleCopyClientId = () => {
    if (secretData?.client_id) {
      navigator.clipboard.writeText(secretData.client_id)
      showSuccess("Client ID copied to clipboard")
    }
  }

  const handleCopySecret = () => {
    if (secretData?.client_secret) {
      navigator.clipboard.writeText(secretData.client_secret)
      showSuccess("Client secret copied to clipboard")
    }
  }

  const handleToggleVisibility = () => {
    if (!showCredentials && !secretData) {
      // Enable fetching secret from API when showing for the first time
      setFetchSecretEnabled(true)
      setShowCredentials(true)
    } else {
      setShowCredentials(!showCredentials)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Client Credentials
            </CardTitle>
            <CardDescription>
              {shouldShowSecret
                ? "Client ID and secret for authentication. Keep these credentials secure."
                : "Client ID for authentication. This client type does not use a client secret."}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleVisibility}
            disabled={isLoadingSecret}
            className="gap-2"
          >
            {isLoadingSecret ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Loading...
              </>
            ) : showCredentials ? (
              <>
                <EyeOff className="h-4 w-4" />
                Hide
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Show
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Client ID */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Client ID</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyClientId}
              disabled={!secretData}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
          </div>
          <code className="block text-sm bg-muted px-4 py-3 rounded-md font-mono break-all">
            {showCredentials && secretData?.client_id
              ? secretData.client_id
              : '••••••••••••••••••••••••••••••••'}
          </code>
          <p className="text-xs text-muted-foreground">
            Use this ID to identify your client application
          </p>
        </div>

        {/* Client Secret - Only for traditional and m2m */}
        {shouldShowSecret && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Client Secret</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopySecret}
                disabled={!secretData}
                className="gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </div>
            <code className="block text-sm bg-muted px-4 py-3 rounded-md font-mono break-all">
              {showCredentials && secretData?.client_secret
                ? secretData.client_secret
                : '••••••••••••••••••••••••••••••••'}
            </code>
            <p className="text-xs text-muted-foreground">
              Keep this secret secure and never share it publicly
            </p>
          </div>
        )}

        {/* Info message for SPA and Mobile */}
        {!shouldShowSecret && (
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> {clientType === 'spa' ? 'Single Page Applications' : 'Mobile applications'} use
              PKCE (Proof Key for Code Exchange) for secure authentication and do not require a client secret.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

