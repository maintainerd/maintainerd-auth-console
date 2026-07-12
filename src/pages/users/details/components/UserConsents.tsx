import { useState } from "react"
import { format } from "date-fns"
import { FileText, Globe, Ban } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InformationCard } from "@/components/card"
import { EmptyState, ListSkeleton } from "@/components/details"
import { ConfirmationDialog } from "@/components/dialog"
import { useUserConsents, useWithdrawUserConsent } from "@/hooks/useUsers"
import { useToast } from "@/hooks/useToast"

interface UserConsentsProps {
  userId: string
}

export function UserConsents({ userId }: UserConsentsProps) {
  const { data, isLoading, isError } = useUserConsents(userId)
  const consents = data?.rows ?? []
  const { showSuccess, showError } = useToast()
  const withdrawMutation = useWithdrawUserConsent()
  const [withdrawTarget, setWithdrawTarget] = useState<string | null>(null)

  const handleWithdraw = async () => {
    if (!withdrawTarget) return
    try {
      await withdrawMutation.mutateAsync({ userId, consentType: withdrawTarget })
      showSuccess("Consent withdrawn")
    } catch (e) {
      showError(e)
    } finally {
      setWithdrawTarget(null)
    }
  }

  return (
    <InformationCard
      title="Consents"
      description="Consent agreements recorded for this user. Withdrawing a consent is logged as a new entry — the original acceptance is preserved for audit."
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
                {consent.accepted ? "Accepted" : "Withdrawn"}
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
          {consent.accepted && (
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0 gap-2 text-destructive hover:text-destructive"
              onClick={() => setWithdrawTarget(consent.consent_type)}
            >
              <Ban className="size-4" />
              Withdraw
            </Button>
          )}
        </div>
      ))}

      <ConfirmationDialog
        open={withdrawTarget !== null}
        onOpenChange={(open) => { if (!open) setWithdrawTarget(null) }}
        onConfirm={handleWithdraw}
        title="Withdraw consent?"
        description="This records a withdrawal of the user's consent (the original acceptance is kept for the audit trail). Per GDPR, withdrawal must be as easy as granting."
        confirmText="Withdraw consent"
        variant="destructive"
        isLoading={withdrawMutation.isPending}
      />
    </InformationCard>
  )
}
