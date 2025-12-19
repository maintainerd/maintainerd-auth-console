import { Settings } from "lucide-react"
import { InformationCard } from "@/components/card"
import type { UserType } from "@/services/api/user/types"

interface UserOverviewProps {
  user: UserType
}

export function UserOverview({ user }: UserOverviewProps) {
  // Extract metadata - it's a Record<string, unknown> | null
  const metadata = user.metadata || {}
  const metadataEntries = Object.entries(metadata)

  return (
    <div className="space-y-6">
      {/* Custom Metadata */}
      {metadataEntries.length > 0 ? (
        <InformationCard
          title="User Metadata"
          description="Custom metadata and additional information for this user"
          icon={Settings}
        >
          <div className="space-y-4">
            {/* Horizontal line */}
            <div className="border-t" />

            <div className="space-y-3">
              {metadataEntries.map(([key, value]) => (
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
          </div>
        </InformationCard>
      ) : (
        <InformationCard
          title="User Metadata"
          description="Custom metadata and additional information for this user"
          icon={Settings}
        >
          <div className="space-y-4">
            {/* Horizontal line */}
            <div className="border-t" />

            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Settings className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Metadata</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                This user has no custom metadata configured. Metadata can be added through the API.
              </p>
            </div>
          </div>
        </InformationCard>
      )}
    </div>
  )
}
