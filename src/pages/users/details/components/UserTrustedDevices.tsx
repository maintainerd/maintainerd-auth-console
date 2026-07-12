import { useState } from "react"
import { format } from "date-fns"
import { Smartphone, Calendar, Trash2 } from "lucide-react"
import { InformationCard } from "@/components/card"
import { Button } from "@/components/ui/button"
import { EmptyState, ListSkeleton } from "@/components/details"
import { ConfirmationDialog } from "@/components/dialog"
import { useUserTrustedDevices, useRevokeUserDevice } from "@/hooks/useUsers"
import { useToast } from "@/hooks/useToast"

interface UserTrustedDevicesProps {
  userId: string
}

export function UserTrustedDevices({ userId }: UserTrustedDevicesProps) {
  const { data, isLoading, isError } = useUserTrustedDevices(userId)
  const devices = data ?? []
  const { showSuccess, showError } = useToast()
  const revokeMutation = useRevokeUserDevice()
  const [revokeTarget, setRevokeTarget] = useState<string | null>(null)

  const handleRevoke = async () => {
    if (!revokeTarget) return
    try {
      await revokeMutation.mutateAsync({ userId, deviceId: revokeTarget })
      showSuccess("Device revoked")
    } catch (e) {
      showError(e)
    } finally {
      setRevokeTarget(null)
    }
  }

  return (
    <InformationCard
      title="Trusted Devices"
      description="Devices this user has marked as trusted. Revoking one forces re-verification (e.g. MFA) on the next sign-in from it."
      icon={Smartphone}
    >
      {isLoading && <ListSkeleton />}

      {isError && (
        <p className="py-4 text-center text-sm text-destructive">Failed to load devices</p>
      )}

      {!isLoading && !isError && devices.length === 0 && (
        <EmptyState
          icon={Smartphone}
          title="No trusted devices"
          description="This user has not trusted any devices."
        />
      )}

      {devices.map((device) => (
        <div
          key={device.uuid}
          className="flex items-start justify-between rounded-lg border p-3"
        >
          <div className="space-y-1">
            <p className="font-mono text-xs text-muted-foreground">
              {device.uuid.slice(0, 8)}...
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="size-3" />
                Added {format(new Date(device.created_at), "PP")}
              </span>
              {device.trusted_until && (
                <span>Trusted until {format(new Date(device.trusted_until), "PP")}</span>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 gap-2 text-destructive hover:text-destructive"
            onClick={() => setRevokeTarget(device.uuid)}
          >
            <Trash2 className="size-4" />
            Revoke
          </Button>
        </div>
      ))}

      <ConfirmationDialog
        open={revokeTarget !== null}
        onOpenChange={(open) => { if (!open) setRevokeTarget(null) }}
        onConfirm={handleRevoke}
        title="Revoke trusted device?"
        description="The user will need to re-verify this device (e.g. via MFA) the next time they sign in from it."
        confirmText="Revoke device"
        variant="destructive"
        isLoading={revokeMutation.isPending}
      />
    </InformationCard>
  )
}
