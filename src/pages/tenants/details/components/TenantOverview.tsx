import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Globe, Lock, FileText } from "lucide-react"
import { format } from "date-fns"
import type { TenantEntity } from "@/services/api/tenants/types"

interface TenantOverviewProps {
  tenant: TenantEntity
}

export function TenantOverview({ tenant }: TenantOverviewProps) {
  return (
    <div className="space-y-4">
      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle className="text-base">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {tenant.description || "No description provided."}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              {tenant.is_public ? <Globe className="size-4" /> : <Lock className="size-4" />}
            </div>
            <div>
              <CardTitle className="text-base">Visibility</CardTitle>
              <p className="text-sm text-muted-foreground">
                {tenant.is_public ? "Public" : "Private"}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {tenant.is_public
                ? "This tenant is publicly accessible. Anyone can view its registration page and branding."
                : "This tenant is private. Only invited users can access it."}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <CalendarDays className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base">Timestamps</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Created</span>
              <span className="font-medium">
                {format(new Date(tenant.created_at), "PPp")}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last updated</span>
              <span className="font-medium">
                {format(new Date(tenant.updated_at), "PPp")}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="size-4 text-muted-foreground" />
            Raw Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tenant ID</span>
              <span className="font-mono text-xs">{tenant.tenant_id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Name</span>
              <span className="font-mono text-xs">{tenant.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Identifier</span>
              <span className="font-mono text-xs">{tenant.identifier}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">System</span>
              <span>{tenant.is_system ? "Yes" : "No"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Default</span>
              <span>{tenant.is_default ? "Yes" : "No"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
