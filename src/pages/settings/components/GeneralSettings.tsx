import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import type { TenantEntity } from "@/services/api/tenant/types"
import type { BaseSettingsProps } from "./types"

interface GeneralSettingsProps extends BaseSettingsProps {
  tenant: TenantEntity
  settings: {
    name: string
    description: string
    is_public: boolean
  }
}

export function GeneralSettings({ tenant, settings, onUpdate, errors }: GeneralSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tenant Information</CardTitle>
        <CardDescription>
          Basic information about this tenant
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="tenant-id">Tenant ID</Label>
            <Input
              id="tenant-id"
              value={tenant.tenant_id}
              disabled
              className="bg-muted"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="identifier">Identifier</Label>
            <Input
              id="identifier"
              value={tenant.identifier}
              disabled
              className="bg-muted"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="name">
            Tenant Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={settings.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="Enter tenant name"
          />
          {errors?.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">
            Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            value={settings.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Brief description of this tenant"
            rows={3}
          />
          {errors?.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="is-public">Public Tenant</Label>
            <p className="text-sm text-muted-foreground">
              Make this tenant publicly accessible
            </p>
          </div>
          <Switch
            id="is-public"
            checked={settings.is_public}
            onCheckedChange={(checked) => onUpdate({ is_public: checked })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="grid gap-2">
            <Label>Status</Label>
            <Badge variant={tenant.status === 'active' ? 'default' : 'secondary'}>
              {tenant.status}
            </Badge>
          </div>
          {tenant.is_default && (
            <div className="grid gap-2">
              <Label>Default</Label>
              <Badge variant="outline">Default Tenant</Badge>
            </div>
          )}
          {tenant.is_system && (
            <div className="grid gap-2">
              <Label>System</Label>
              <Badge variant="outline">System Tenant</Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
