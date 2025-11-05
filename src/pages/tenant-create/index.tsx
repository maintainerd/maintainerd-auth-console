import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Building } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { generateTenantIdentifier } from "@/constants/tenants"

export default function TenantCreatePage() {
  const navigate = useNavigate()
  const { tenantId } = useParams<{ tenantId: string }>()

  const [formData, setFormData] = React.useState({
    // Basic Information
    name: "",
    description: "",
    
    // Application Settings
    applicationName: "",
    applicationDescription: "",
    applicationLogo: "",
    faviconUrl: "",
    defaultLanguage: "en",
    defaultTimezone: "UTC",
    dateFormat: "MM/dd/yyyy",
    timeFormat: "12h",
    
    // Legal & Compliance
    privacyPolicyUrl: "",
    termsOfServiceUrl: "",
    
    // API Settings
    apiRateLimit: 1000,
    apiTimeout: 30,
  })

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Generate a new tenant identifier
      const newTenantIdentifier = generateTenantIdentifier()

      const tenantData = {
        ...formData,
        identifier: newTenantIdentifier,
        id: formData.name.toLowerCase().replace(/\s+/g, '-'),
        status: 'active' as const,
        userCount: 0,
        createdAt: new Date().toISOString(),
        createdBy: 'current-user@example.com', // This would come from auth context
        features: ['sso', 'mfa'],
        isSystem: false,
      }

      console.log("Creating tenant:", tenantData)
      // Here you would typically make an API call to create the tenant

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Navigate to the new tenant's dashboard using its identifier
      navigate(`/${newTenantIdentifier}/dashboard`)
    } catch (error) {
      console.error("Error creating tenant:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate(`/${tenantId}/dashboard`)
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
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="self-start gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">Create New Tenant</h1>
            <p className="text-muted-foreground">
              Set up a new tenant with its own isolated authentication environment and configuration.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Configure the basic details for your new tenant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Tenant name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter tenant name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="applicationName" className="text-sm font-medium">
                    Application name
                  </Label>
                  <Input
                    id="applicationName"
                    value={formData.applicationName}
                    onChange={(e) => setFormData(prev => ({ ...prev, applicationName: e.target.value }))}
                    placeholder="Enter application name"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this tenant"
                  rows={2}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="applicationDescription" className="text-sm font-medium">
                  Application description
                </Label>
                <Textarea
                  id="applicationDescription"
                  value={formData.applicationDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, applicationDescription: e.target.value }))}
                  placeholder="Brief description of your application"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Branding & Regional Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Branding & Regional Settings</CardTitle>
              <CardDescription>
                Configure branding, language, and regional preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="applicationLogo" className="text-sm font-medium">
                    Application logo URL
                  </Label>
                  <Input
                    id="applicationLogo"
                    type="url"
                    value={formData.applicationLogo}
                    onChange={(e) => setFormData(prev => ({ ...prev, applicationLogo: e.target.value }))}
                    placeholder="https://example.com/logo.png"
                  />
                  <div className="text-xs text-muted-foreground">
                    Recommended: PNG or SVG, max 200x60px
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="faviconUrl" className="text-sm font-medium">
                    Favicon URL
                  </Label>
                  <Input
                    id="faviconUrl"
                    type="url"
                    value={formData.faviconUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, faviconUrl: e.target.value }))}
                    placeholder="https://example.com/favicon.ico"
                  />
                  <div className="text-xs text-muted-foreground">
                    Recommended: ICO or PNG, 32x32px
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label className="text-sm font-medium">Default language</Label>
                  <Select
                    value={formData.defaultLanguage}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, defaultLanguage: value }))}
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
                    value={formData.defaultTimezone}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, defaultTimezone: value }))}
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
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label className="text-sm font-medium">Date format</Label>
                  <Select
                    value={formData.dateFormat}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, dateFormat: value }))}
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
                    value={formData.timeFormat}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, timeFormat: value }))}
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
              <CardTitle>Legal & Compliance</CardTitle>
              <CardDescription>
                Configure legal document URLs for this tenant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="privacyPolicyUrl" className="text-sm font-medium">
                    Privacy policy URL
                  </Label>
                  <Input
                    id="privacyPolicyUrl"
                    type="url"
                    value={formData.privacyPolicyUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, privacyPolicyUrl: e.target.value }))}
                    placeholder="https://example.com/privacy"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="termsOfServiceUrl" className="text-sm font-medium">
                    Terms of service URL
                  </Label>
                  <Input
                    id="termsOfServiceUrl"
                    type="url"
                    value={formData.termsOfServiceUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, termsOfServiceUrl: e.target.value }))}
                    placeholder="https://example.com/terms"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>
                Configure API rate limits and timeout settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label className="text-sm font-medium">Rate limit (requests/hour)</Label>
                  <Select
                    value={formData.apiRateLimit.toString()}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, apiRateLimit: parseInt(value) }))}
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
                    value={formData.apiTimeout.toString()}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, apiTimeout: parseInt(value) }))}
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
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? "Creating..." : "Create Tenant"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
