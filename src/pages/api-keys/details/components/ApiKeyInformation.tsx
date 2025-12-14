import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Key } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { ApiKeyType } from "@/services/api/api-key/types"

interface ApiKeyInformationProps {
  apiKey: ApiKeyType
}

export function ApiKeyInformation({ apiKey }: ApiKeyInformationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          API Key Information
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Basic information and metadata about this API key.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Key Prefix</p>
            <p className="text-sm bg-muted p-2 rounded font-mono break-all">{apiKey.key_prefix}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Rate Limit</p>
            <p className="text-sm bg-muted p-2 rounded">{apiKey.rate_limit} requests/hour</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Expires At</p>
            <p className="text-sm bg-muted p-2 rounded">
              {apiKey.expires_at
                ? `${formatDistanceToNow(new Date(apiKey.expires_at), { addSuffix: true })} (${new Date(apiKey.expires_at).toLocaleDateString()})`
                : "Never"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Created At</p>
            <p className="text-sm bg-muted p-2 rounded">
              {formatDistanceToNow(new Date(apiKey.created_at), { addSuffix: true })} ({new Date(apiKey.created_at).toLocaleDateString()})
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

