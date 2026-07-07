import { format } from "date-fns"
import { FileText, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { InformationCard } from "@/components/card"
import { EmptyState, ListSkeleton } from "@/components/details"
import { useUserConsents } from "@/hooks/useUsers"

interface UserConsentsProps {
  userId: string
}

export function UserConsents({ userId }: UserConsentsProps) {
  const { data, isLoading, isError } = useUserConsents(userId)
  const consents = data?.rows ?? []

  return (
    <InformationCard
      title="Consents"
      description="Consent agreements accepted by this user."
      icon={FileText}
    >
      {isLoading && <ListSkeleton />}

      {isError && (
        <p className="py-4 text-center text-sm text-destructive">Failed to load consents</p>
      )}

      {!isLoading && !isError && consents.length === 0 && (
        <EmptyState
          icon={FileText}
          title="No consents"
          description="This user has not accepted any consent agreements."
        />
      )}

      {consents.map((consent) => (
        <div
          key={consent.uuid}
          className="flex items-start justify-between rounded-lg border p-3"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium capitalize">
                {consent.consent_type.replace(/_/g, " ")}
              </span>
              <Badge
                variant={consent.accepted ? "default" : "secondary"}
                className="text-xs"
              >
                {consent.accepted ? "Accepted" : "Declined"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Version: {consent.policy_version}</p>
            {consent.ip_address && (
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Globe className="size-3" />
                {consent.ip_address}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {format(new Date(consent.created_at), "PPp")}
            </p>
          </div>
        </div>
      ))}
    </InformationCard>
  )
}
