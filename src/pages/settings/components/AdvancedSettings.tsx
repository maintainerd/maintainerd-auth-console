import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Trash2 } from "lucide-react"
import type { TenantEntity } from "@/services/api/tenant/types"

interface AdvancedSettingsProps {
  tenant: TenantEntity
  onDeleteClick: () => void
}

export function AdvancedSettings({ tenant, onDeleteClick }: AdvancedSettingsProps) {
  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Danger Zone
        </CardTitle>
        <CardDescription>
          Irreversible and destructive actions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 space-y-3">
          <div className="space-y-1">
            <h4 className="font-semibold">Delete Tenant</h4>
            <p className="text-sm text-muted-foreground">
              Once you delete a tenant, there is no going back. This will permanently delete the tenant and all associated data.
            </p>
          </div>
          <Button 
            variant="destructive" 
            onClick={onDeleteClick}
            className="gap-2"
            disabled={tenant.is_system || tenant.is_default}
          >
            <Trash2 className="h-4 w-4" />
            Delete Tenant
          </Button>
          {(tenant.is_system || tenant.is_default) && (
            <p className="text-sm text-muted-foreground">
              System and default tenants cannot be deleted
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
