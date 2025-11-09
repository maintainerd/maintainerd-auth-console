import React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useNavigate, useSearchParams } from "react-router-dom"

const SetupAdminForm = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
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
      // Get tenant data from localStorage
      const tenantDataStr = localStorage.getItem('setupTenant')
      if (!tenantDataStr) {
        throw new Error('No tenant data found. Please restart the setup process.')
      }

      const tenantData = JSON.parse(tenantDataStr)
      const tenantIdentifier = searchParams.get('tenant') || tenantData.identifier

      // Create admin user data
      const adminData = {
        id: `admin-${Date.now()}`,
        fullName: formData.fullName,
        email: formData.email,
        role: 'admin',
        createdAt: new Date().toISOString(),
        tenantId: tenantData.id
      }

      // Update tenant data to mark setup as completed
      const completedTenantData = {
        ...tenantData,
        metadata: {
          ...tenantData.metadata,
          setupCompleted: true,
          adminUser: adminData
        }
      }

      console.log("Completing tenant setup:", completedTenantData)
      console.log("Creating admin user:", adminData)

      // In a real app, this would be API calls to create the tenant and admin user
      localStorage.setItem('completedTenant', JSON.stringify(completedTenantData))
      localStorage.removeItem('setupTenant')

      // Navigate to the new tenant's dashboard
      navigate(`/${tenantIdentifier}/dashboard`)
    } catch (error) {
      console.error("Error completing setup:", error)
      setErrors({ general: "Setup failed. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create Admin Account</CardTitle>
          <CardDescription>
            Create your administrator account to complete the setup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              {errors.general && (
                <div className="text-sm text-red-600 mb-4">
                  {errors.general}
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  required
                />
                {errors.fullName && (
                  <FieldDescription className="text-red-600">
                    {errors.fullName}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@acme.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
                {errors.email && (
                  <FieldDescription className="text-red-600">
                    {errors.email}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
                {errors.password && (
                  <FieldDescription className="text-red-600">
                    {errors.password}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                />
                <FieldDescription>Please confirm your password.</FieldDescription>
                {errors.confirmPassword && (
                  <FieldDescription className="text-red-600">
                    {errors.confirmPassword}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating Admin..." : "Complete Setup"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default SetupAdminForm;
