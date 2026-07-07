import { format } from "date-fns"
import { Smartphone, Calendar } from "lucide-react"
import { InformationCard } from "@/components/card"
import { EmptyState, ListSkeleton } from "@/components/details"
import { useUserTrustedDevices } from "@/hooks/useUsers"

interface UserTrustedDevicesProps {
  userId: string
}

export function UserTrustedDevices({ userId }: UserTrustedDevicesProps) {
  const { data, isLoading, isError } = useUserTrustedDevices(userId)
  const devices = data?.rows ?? []

  return (
    <InformationCard
      title="Trusted Devices"
      description="Devices this user has marked as trusted. Read-only — revoke support coming soon."
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
        </div>
      ))}
    </InformationCard>
  )
}
