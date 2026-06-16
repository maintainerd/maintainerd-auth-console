import { Card, CardContent } from "@/components/ui/card"
import { Settings } from "lucide-react"

export function TenantSettings() {
  return (
    <Card className="shadow-xs">
      <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Settings className="size-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Tenant Settings</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Configure rate limits, audit logging, maintenance windows, and feature flags for this tenant.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
