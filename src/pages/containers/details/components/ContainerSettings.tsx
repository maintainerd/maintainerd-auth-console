import React from "react"
import { Settings, Save, Trash2, AlertTriangle, Globe, Shield, Database, Bell } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Container } from "../../components/ContainerColumns"

interface ContainerSettingsProps {
  container: Container
}

export function ContainerSettings({ container }: ContainerSettingsProps) {
  const [settings, setSettings] = React.useState({
    name: container.name,
    description: container.description,
    domain: container.domain,
    status: container.status,
    maxUsers: 5000,
    sessionTimeout: 30,
    enableAuditLogs: true,
    enableNotifications: true,
    allowSelfRegistration: false,
    requireEmailVerification: true,
    defaultUserRole: "user",
    maintenanceMode: false,
    maintenanceMessage: "System is under maintenance. Please try again later.",
  })

  const handleSave = () => {
    console.log("Saving container settings:", settings)
    // Here you would typically make an API call to save the settings
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this container? This action cannot be undone.")) {
      console.log("Deleting container:", container.id)
      // Here you would typically make an API call to delete the container
    }
  }

  const isSystemContainer = container.isSystem

  return (
    <div className="space-y-6">
      {isSystemContainer && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            This is a system container. Some settings may be restricted or require elevated permissions.
          </AlertDescription>
        </Alert>
      )}

      {/* Basic Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Basic Settings
          </CardTitle>
          <CardDescription>
            Configure basic container information and domain settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Container Name
              </Label>
              <Input
                id="name"
                value={settings.name}
                onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter container name"
                disabled={isSystemContainer}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="domain" className="text-sm font-medium">
                Domain
              </Label>
              <Input
                id="domain"
                value={settings.domain}
                onChange={(e) => setSettings(prev => ({ ...prev, domain: e.target.value }))}
                placeholder="example.auth.domain.com"
                disabled={isSystemContainer}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={settings.description}
              onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this container"
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label className="text-sm font-medium">Status</Label>
              <Select
                value={settings.status}
                onValueChange={(value) => setSettings(prev => ({ ...prev, status: value as any }))}
                disabled={isSystemContainer}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maxUsers" className="text-sm font-medium">
                Max Users
              </Label>
              <Input
                id="maxUsers"
                type="number"
                value={settings.maxUsers}
                onChange={(e) => setSettings(prev => ({ ...prev, maxUsers: parseInt(e.target.value) }))}
                placeholder="5000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Access
          </CardTitle>
          <CardDescription>
            Configure security policies and user access settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label className="text-sm font-medium">Session Timeout (minutes)</Label>
              <Select
                value={settings.sessionTimeout.toString()}
                onValueChange={(value) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="480">8 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-medium">Default User Role</Label>
              <Select
                value={settings.defaultUserRole}
                onValueChange={(value) => setSettings(prev => ({ ...prev, defaultUserRole: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Allow Self Registration</Label>
                <div className="text-xs text-muted-foreground">Users can create their own accounts</div>
              </div>
              <Switch
                checked={settings.allowSelfRegistration}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allowSelfRegistration: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Email Verification</Label>
                <div className="text-xs text-muted-foreground">Require email verification for new accounts</div>
              </div>
              <Switch
                checked={settings.requireEmailVerification}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireEmailVerification: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            System Settings
          </CardTitle>
          <CardDescription>
            Configure system behavior and maintenance settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Audit Logging</Label>
                <div className="text-xs text-muted-foreground">Log all user activities and system events</div>
              </div>
              <Switch
                checked={settings.enableAuditLogs}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableAuditLogs: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Notifications</Label>
                <div className="text-xs text-muted-foreground">Send system notifications and alerts</div>
              </div>
              <Switch
                checked={settings.enableNotifications}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableNotifications: checked }))}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm">Maintenance Mode</Label>
              <div className="text-xs text-muted-foreground">Temporarily disable access to this container</div>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenanceMode: checked }))}
            />
          </div>

          {settings.maintenanceMode && (
            <div className="grid gap-2">
              <Label htmlFor="maintenanceMessage" className="text-sm font-medium">
                Maintenance Message
              </Label>
              <Textarea
                id="maintenanceMessage"
                value={settings.maintenanceMessage}
                onChange={(e) => setSettings(prev => ({ ...prev, maintenanceMessage: e.target.value }))}
                placeholder="Message to display during maintenance"
                rows={2}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enabled Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Enabled Features
          </CardTitle>
          <CardDescription>
            Features currently available in this container
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {container.features.map((feature) => (
              <Badge key={feature} variant="secondary" className="gap-1">
                <Shield className="h-3 w-3" />
                {feature}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
        
        {!isSystemContainer && (
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Container
          </Button>
        )}
      </div>

      {isSystemContainer && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            System containers cannot be deleted as they are required for platform operation.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
