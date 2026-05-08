import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Save, Trash2, User, Plus, X, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MOCK_USER_PROFILES, MOCK_USERS } from "../constants"
import type { UserProfile } from "../components/UserColumns"

export default function UserProfileForm() {
  const { tenantId, userId } = useParams<{ tenantId: string; userId: string }>()
  const navigate = useNavigate()

  // Find existing user and profile
  const existingUser = MOCK_USERS.find(u => u.id === userId)
  const existingProfile = MOCK_USER_PROFILES.find(p => p.userId === userId)

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    bio: "",
    birthDate: "",
    gender: "",
    phoneNumber: "",
    address: "",
    city: "",
    country: "",
    timezone: "",
    language: "",
  })

  // Custom fields state
  const [customFields, setCustomFields] = useState<Array<{ key: string; value: string; id: string }>>([])
  const [newFieldKey, setNewFieldKey] = useState("")
  const [newFieldValue, setNewFieldValue] = useState("")

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load existing profile data
  useEffect(() => {
    if (existingProfile) {
      setFormData({
        firstName: existingProfile.firstName || "",
        lastName: existingProfile.lastName || "",
        displayName: existingProfile.displayName || "",
        bio: existingProfile.bio || "",
        birthDate: existingProfile.birthDate || "",
        gender: existingProfile.gender || "",
        phoneNumber: existingProfile.phoneNumber || "",
        address: existingProfile.address || "",
        city: existingProfile.city || "",
        country: existingProfile.country || "",
        timezone: existingProfile.timezone || "",
        language: existingProfile.language || "",
      })
    }
  }, [existingProfile])

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

  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
    { value: "it", label: "Italiano" },
    { value: "pt", label: "Português" },
    { value: "ja", label: "日本語" },
    { value: "ko", label: "한국어" },
    { value: "zh", label: "中文" }
  ]

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "non-binary", label: "Non-binary" },
    { value: "prefer-not-to-say", label: "Prefer not to say" },
    { value: "other", label: "Other" },
  ]

  const countries = [
    { value: "US", label: "United States" },
    { value: "CA", label: "Canada" },
    { value: "GB", label: "United Kingdom" },
    { value: "AU", label: "Australia" },
    { value: "DE", label: "Germany" },
    { value: "FR", label: "France" },
    { value: "ES", label: "Spain" },
    { value: "IT", label: "Italy" },
    { value: "JP", label: "Japan" },
    { value: "KR", label: "South Korea" },
    { value: "CN", label: "China" },
    { value: "IN", label: "India" },
    { value: "BR", label: "Brazil" },
    { value: "MX", label: "Mexico" },
    { value: "NL", label: "Netherlands" },
    { value: "SE", label: "Sweden" },
    { value: "NO", label: "Norway" },
    { value: "DK", label: "Denmark" },
    { value: "FI", label: "Finland" },
    { value: "SG", label: "Singapore" },
  ]

  const addCustomField = () => {
    if (newFieldKey.trim() && newFieldValue.trim()) {
      const newField = {
        id: Date.now().toString(),
        key: newFieldKey.trim(),
        value: newFieldValue.trim()
      }
      setCustomFields([...customFields, newField])
      setNewFieldKey("")
      setNewFieldValue("")
    }
  }

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter(field => field.id !== id))
  }

  const updateCustomField = (id: string, key: string, value: string) => {
    setCustomFields(customFields.map(field => 
      field.id === id ? { ...field, key, value } : field
    ))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Basic validation - most fields are optional for profiles
    if (formData.firstName && formData.firstName.length < 1) {
      newErrors.firstName = "First name cannot be empty if provided"
    }

    if (formData.lastName && formData.lastName.length < 1) {
      newErrors.lastName = "Last name cannot be empty if provided"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const profileData = {
        ...formData,
        customFields: customFields.reduce((acc, field) => {
          acc[field.key] = field.value
          return acc
        }, {} as Record<string, string>)
      }
      
      console.log("Save profile:", profileData)
      
      // Navigate back to user details
      navigate(`/${tenantId}/users/${userId}`)
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this profile? This action cannot be undone.")) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        console.log("Delete profile for user:", userId)
        navigate(`/${tenantId}/users/${userId}`)
      } catch (error) {
        console.error("Error deleting profile:", error)
      }
    }
  }

  if (!existingUser) {
    return (
      <div className="w-4xl max-w-6xl mx-auto">
        <div className="flex flex-col gap-6">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/${tenantId}/users`)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Users
            </Button>
          </div>
          <div className="text-center py-8">
            <h1 className="text-2xl font-semibold">User Not Found</h1>
            <p className="text-muted-foreground mt-2">The user you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-4xl max-w-6xl mx-auto">
      <div className="flex flex-col gap-6">
        {/* Back Button */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/${tenantId}/users/${userId}`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to User Details
          </Button>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {existingProfile ? "Edit Profile" : "Create Profile"}
              </h1>
              <p className="text-muted-foreground">
                {existingProfile 
                  ? `Update profile information for @${existingUser.username}`
                  : `Create profile information for @${existingUser.username}`
                }
              </p>
            </div>
          </div>
          {existingProfile && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Profile
            </Button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="e.g., John"
                  />
                  {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="e.g., Doe"
                  />
                  {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="e.g., John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Brief description about yourself..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>



          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Optional personal details
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Birth Date</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {genderOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="e.g., +1 (555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => setFormData({ ...formData, country: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(value) => setFormData({ ...formData, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
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

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value) => setFormData({ ...formData, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
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
            </CardContent>
          </Card>

          {/* Custom Fields */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Custom Fields
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Add custom fields for additional information that developers can use
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing Custom Fields */}
              {customFields.length > 0 && (
                <div className="space-y-3">
                  {customFields.map((field) => (
                    <div key={field.id} className="flex gap-3 items-start">
                      <div className="flex-1 grid gap-3 md:grid-cols-2">
                        <Input
                          value={field.key}
                          onChange={(e) => updateCustomField(field.id, e.target.value, field.value)}
                          placeholder="Field name (e.g., employee_id)"
                        />
                        <Input
                          value={field.value}
                          onChange={(e) => updateCustomField(field.id, field.key, e.target.value)}
                          placeholder="Field value"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomField(field.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Custom Field */}
              <div className="border-t pt-4">
                <div className="flex gap-3 items-end">
                  <div className="flex-1 grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="newFieldKey">Field Name</Label>
                      <Input
                        id="newFieldKey"
                        value={newFieldKey}
                        onChange={(e) => setNewFieldKey(e.target.value)}
                        placeholder="e.g., employee_id, badge_number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newFieldValue">Field Value</Label>
                      <Input
                        id="newFieldValue"
                        value={newFieldValue}
                        onChange={(e) => setNewFieldValue(e.target.value)}
                        placeholder="e.g., EMP-12345"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={addCustomField}
                    disabled={!newFieldKey.trim() || !newFieldValue.trim()}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Field
                  </Button>
                </div>
              </div>

              {customFields.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No custom fields added yet</p>
                  <p className="text-sm">Add custom fields to store additional information</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/${tenantId}/users/${userId}`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              <Save className="h-4 w-4" />
              {isSubmitting ? "Saving..." : existingProfile ? "Update Profile" : "Create Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
