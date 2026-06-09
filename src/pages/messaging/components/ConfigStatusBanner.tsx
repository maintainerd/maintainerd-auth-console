import type { LucideIcon } from "lucide-react"
import { CheckCircle2, FlaskConical } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ConfigStatusBannerProps {
  icon: LucideIcon
  // Whether a configuration record already exists for this channel.
  configured: boolean
  // Friendly provider name to show when configured (e.g. "SendGrid").
  providerLabel?: string
  status?: string
  testMode?: boolean
  updatedAt?: string
  // Shown in the un-configured state to nudge the admin toward setup.
  notConfiguredHint: string
}

// Compact posture summary that sits above the form on the messaging-config
// pages: what's wired up, whether it's live, and when it last changed. Mirrors
// the at-a-glance status patterns used across enterprise delivery dashboards.
export function ConfigStatusBanner({
  icon: Icon,
  configured,
  providerLabel,
  status,
  testMode,
  updatedAt,
  notConfiguredHint,
}: ConfigStatusBannerProps) {
  const isActive = (status ?? "active").toLowerCase() === "active"

  return (
    <Card
      className={cn(
        "py-0 shadow-xs",
        configured ? "border-border" : "border-dashed bg-muted/30",
      )}
    >
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg",
              configured ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
            )}
          >
            <Icon className="size-5" />
          </div>
          <div className="min-w-0 space-y-0.5">
            {configured ? (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{providerLabel ?? "Configured"}</p>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "gap-1 font-normal",
                      isActive && "border-emerald-500/30 bg-emerald-500/10 text-emerald-600",
                    )}
                  >
                    <CheckCircle2 className="size-3" />
                    {isActive ? "Active" : (status ?? "Inactive")}
                  </Badge>
                  {testMode && (
                    <Badge variant="secondary" className="gap-1 border-amber-500/30 bg-amber-500/10 font-normal text-amber-600">
                      <FlaskConical className="size-3" />
                      Test mode
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {testMode
                    ? "Running in test mode — verify delivery before going live."
                    : "Live and ready to deliver messages."}
                </p>
              </>
            ) : (
              <>
                <p className="font-medium">Not configured</p>
                <p className="text-sm text-muted-foreground">{notConfiguredHint}</p>
              </>
            )}
          </div>
        </div>

        {configured && updatedAt && (
          <p className="shrink-0 text-xs text-muted-foreground">
            Updated {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
