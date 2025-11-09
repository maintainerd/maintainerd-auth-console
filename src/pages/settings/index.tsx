import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Settings,
  Globe,
  Shield,
  Save
} from "lucide-react"

export default function TenantSettingsPage() {
  const [settings, setSettings] = React.useState({
    // Tenant Information
    tenantName: "Acme Corp",
    tenantDescription: "Enterprise authentication tenant for Acme Corporation",

    // Application Branding
    applicationLogo: "",
    faviconUrl: "",

    // Regional Settings
    defaultLanguage: "en",
    defaultTimezone: "UTC",
    dateFormat: "MM/dd/yyyy",
    timeFormat: "12h",

    // Legal & Compliance
    privacyPolicyUrl: "https://acme.com/privacy",
    termsOfServiceUrl: "https://acme.com/terms"
  })

  const handleSave = () => {
    console.log("Saving tenant settings:", settings)
    // Here you would typically make an API call to save the tenant settings
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
          <h1 className="text-3xl font-semibold tracking-tight">Tenant Settings</h1>
          <p className="text-muted-foreground">
            Configure tenant information, application branding, regional settings, and compliance.
          </p>
        </div>

        <div className="grid gap-6">
        {/* Tenant Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Tenant Information
            </CardTitle>
            <CardDescription>
              Configure basic tenant information and identification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="tenantName" className="text-sm font-medium">
                Tenant name
              </Label>
              <Input
                id="tenantName"
                value={settings.tenantName}
                onChange={(e) => setSettings(prev => ({ ...prev, tenantName: e.target.value }))}
                placeholder="Enter tenant name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tenantDescription" className="text-sm font-medium">
                Tenant description
              </Label>
              <Textarea
                id="tenantDescription"
                value={settings.tenantDescription}
                onChange={(e) => setSettings(prev => ({ ...prev, tenantDescription: e.target.value }))}
                placeholder="Brief description of this tenant"
                rows={2}
              />
            </div>

          </CardContent>
        </Card>

        {/* Branding & Regional Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Branding & Regional Settings
            </CardTitle>
            <CardDescription>
              Configure application branding, language, and regional preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <div className="grid gap-4 sm:grid-cols-4">
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



        {/* Legal & Compliance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Legal & Compliance
            </CardTitle>
            <CardDescription>
              Configure legal document URLs for this tenant
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
          </CardContent>
        </Card>


        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Tenant Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
