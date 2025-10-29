import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Globe,
  Bell,
  Database,
  Shield,
  Save
} from "lucide-react"

export default function GeneralSettingsPage() {
  const [settings, setSettings] = React.useState({
    // Application Settings
    applicationName: "Acme Auth",
    applicationDescription: "Secure authentication and identity management platform",
    applicationLogo: "",
    faviconUrl: "",
    defaultLanguage: "en",
    defaultTimezone: "UTC",
    dateFormat: "MM/dd/yyyy",
    timeFormat: "12h",

    // User Defaults
    defaultUserRole: "user",
    
    // System Settings
    maintenanceMode: false,
    maintenanceMessage: "System is currently under maintenance. Please try again later.",
    debugMode: false,
    logLevel: "info",
    maxFileUploadSize: 10,
    
    // Notifications
    systemNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    webhookNotifications: false,
    
    // Legal & Compliance
    privacyPolicyUrl: "https://acme.com/privacy",
    termsOfServiceUrl: "https://acme.com/terms",
    cookieConsent: true,
    
    // API Settings
    apiRateLimit: 1000,
    apiTimeout: 30,
    corsEnabled: true,
    allowedOrigins: ["https://acme.com", "https://app.acme.com"]
  })

  const handleSave = () => {
    console.log("Saving general settings:", settings)
    // Here you would typically make an API call to save the settings
  }

  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "it", label: "Italian" },
    { value: "pt", label: "Portuguese" },
    { value: "ja", label: "Japanese" },
    { value: "ko", label: "Korean" },
    { value: "zh", label: "Chinese" }
  ]

  const timezones = [
    { value: "UTC", label: "UTC" },
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "Europe/London", label: "London (GMT)" },
    { value: "Europe/Paris", label: "Paris (CET)" },
    { value: "Asia/Tokyo", label: "Tokyo (JST)" },
    { value: "Asia/Shanghai", label: "Shanghai (CST)" },
    { value: "Australia/Sydney", label: "Sydney (AEST)" }
  ]



  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">General Settings</h1>
          <p className="text-muted-foreground">
            Configure application branding, regional settings, system preferences, and API configuration.
          </p>
        </div>

        <div className="grid gap-6">
        {/* Application Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Application
            </CardTitle>
            <CardDescription>
              Configure application name, branding, language, and regional settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="appName" className="text-sm font-medium">
                  Application name
                </Label>
                <Input
                  id="appName"
                  value={settings.applicationName}
                  onChange={(e) => setSettings(prev => ({ ...prev, applicationName: e.target.value }))}
                  placeholder="Enter application name"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Default language</Label>
                <Select
                  value={settings.defaultLanguage}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, defaultLanguage: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="appDescription" className="text-sm font-medium">
                Application description
              </Label>
              <Textarea
                id="appDescription"
                value={settings.applicationDescription}
                onChange={(e) => setSettings(prev => ({ ...prev, applicationDescription: e.target.value }))}
                placeholder="Brief description of your application"
                rows={2}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="appLogo" className="text-sm font-medium">
                  Application logo URL
                </Label>
                <Input
                  id="appLogo"
                  type="url"
                  value={settings.applicationLogo}
                  onChange={(e) => setSettings(prev => ({ ...prev, applicationLogo: e.target.value }))}
                  placeholder="https://example.com/logo.png"
                />
                <div className="text-xs text-muted-foreground">
                  Recommended: PNG or SVG, max 200x60px
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="favicon" className="text-sm font-medium">
                  Favicon URL
                </Label>
                <Input
                  id="favicon"
                  type="url"
                  value={settings.faviconUrl}
                  onChange={(e) => setSettings(prev => ({ ...prev, faviconUrl: e.target.value }))}
                  placeholder="https://example.com/favicon.ico"
                />
                <div className="text-xs text-muted-foreground">
                  Recommended: ICO or PNG, 32x32px
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Timezone</Label>
                <Select
                  value={settings.defaultTimezone}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, defaultTimezone: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Date format</Label>
                <Select
                  value={settings.dateFormat}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, dateFormat: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/dd/yyyy">MM/dd/yyyy</SelectItem>
                    <SelectItem value="dd/MM/yyyy">dd/MM/yyyy</SelectItem>
                    <SelectItem value="yyyy-MM-dd">yyyy-MM-dd</SelectItem>
                    <SelectItem value="dd MMM yyyy">dd MMM yyyy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Time format</Label>
                <Select
                  value={settings.timeFormat}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, timeFormat: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12-hour</SelectItem>
                    <SelectItem value="24h">24-hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              System
            </CardTitle>
            <CardDescription>
              Configure system-level settings and maintenance options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Maintenance mode</Label>
                  <div className="text-xs text-muted-foreground">Temporarily disable access to the application</div>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Debug mode</Label>
                  <div className="text-xs text-muted-foreground">Enable detailed error logging and debugging</div>
                </div>
                <Switch
                  checked={settings.debugMode}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, debugMode: checked }))}
                />
              </div>
            </div>

            {settings.maintenanceMode && (
              <div className="grid gap-2">
                <Label htmlFor="maintenanceMessage" className="text-sm font-medium">
                  Maintenance message
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

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Log level</Label>
                <Select
                  value={settings.logLevel}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, logLevel: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warn">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                    <SelectItem value="trace">Trace</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Max file upload (MB)</Label>
                <Select
                  value={settings.maxFileUploadSize.toString()}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, maxFileUploadSize: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 MB</SelectItem>
                    <SelectItem value="5">5 MB</SelectItem>
                    <SelectItem value="10">10 MB</SelectItem>
                    <SelectItem value="25">25 MB</SelectItem>
                    <SelectItem value="50">50 MB</SelectItem>
                    <SelectItem value="100">100 MB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure system notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">System notifications</Label>
                  <div className="text-xs text-muted-foreground">Enable system-wide notifications</div>
                </div>
                <Switch
                  checked={settings.systemNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, systemNotifications: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Email notifications</Label>
                  <div className="text-xs text-muted-foreground">Send notifications via email</div>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">SMS notifications</Label>
                  <div className="text-xs text-muted-foreground">Send notifications via SMS</div>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, smsNotifications: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Webhook notifications</Label>
                  <div className="text-xs text-muted-foreground">Send notifications to webhooks</div>
                </div>
                <Switch
                  checked={settings.webhookNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, webhookNotifications: checked }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legal URLs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Legal & Compliance
            </CardTitle>
            <CardDescription>
              Configure legal document URLs and cookie consent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="privacyUrl" className="text-sm font-medium">
                  Privacy policy URL
                </Label>
                <Input
                  id="privacyUrl"
                  type="url"
                  value={settings.privacyPolicyUrl}
                  onChange={(e) => setSettings(prev => ({ ...prev, privacyPolicyUrl: e.target.value }))}
                  placeholder="https://example.com/privacy"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="termsUrl" className="text-sm font-medium">
                  Terms of service URL
                </Label>
                <Input
                  id="termsUrl"
                  type="url"
                  value={settings.termsOfServiceUrl}
                  onChange={(e) => setSettings(prev => ({ ...prev, termsOfServiceUrl: e.target.value }))}
                  placeholder="https://example.com/terms"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Cookie consent banner</Label>
                <div className="text-xs text-muted-foreground">Show cookie consent banner to users</div>
              </div>
              <Switch
                checked={settings.cookieConsent}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, cookieConsent: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* API Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              API Configuration
            </CardTitle>
            <CardDescription>
              Configure API rate limits, timeouts, and CORS settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Rate limit (requests/hour)</Label>
                <Select
                  value={settings.apiRateLimit.toString()}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, apiRateLimit: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="500">500</SelectItem>
                    <SelectItem value="1000">1,000</SelectItem>
                    <SelectItem value="5000">5,000</SelectItem>
                    <SelectItem value="10000">10,000</SelectItem>
                    <SelectItem value="50000">50,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Timeout (seconds)</Label>
                <Select
                  value={settings.apiTimeout.toString()}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, apiTimeout: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 seconds</SelectItem>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">1 minute</SelectItem>
                    <SelectItem value="120">2 minutes</SelectItem>
                    <SelectItem value="300">5 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">CORS enabled</Label>
                  <div className="text-xs text-muted-foreground">Enable cross-origin requests</div>
                </div>
                <Switch
                  checked={settings.corsEnabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, corsEnabled: checked }))}
                />
              </div>
            </div>

            {settings.corsEnabled && (
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Allowed origins</Label>
                <div className="flex flex-wrap gap-2">
                  {settings.allowedOrigins.map((origin, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {origin}
                      <button
                        onClick={() => {
                          const newOrigins = settings.allowedOrigins.filter((_, i) => i !== index)
                          setSettings(prev => ({ ...prev, allowedOrigins: newOrigins }))
                        }}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const value = e.currentTarget.value.trim()
                        if (value && !settings.allowedOrigins.includes(value)) {
                          setSettings(prev => ({ ...prev, allowedOrigins: [...prev.allowedOrigins, value] }))
                          e.currentTarget.value = ''
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement
                      const value = input.value.trim()
                      if (value && !settings.allowedOrigins.includes(value)) {
                        setSettings(prev => ({ ...prev, allowedOrigins: [...prev.allowedOrigins, value] }))
                        input.value = ''
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
