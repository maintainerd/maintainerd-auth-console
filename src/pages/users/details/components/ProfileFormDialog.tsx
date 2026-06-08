import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  FormInputField,
  FormTextareaField,
  FormSelectField,
  FormDateField,
} from "@/components/form"
import { userProfileSchema } from "@/lib/validations"
import { countryOptions, timezoneOptions, languageOptions, genderOptions } from "@/lib/constants"
import { useCreateUserProfile, useUpdateUserProfile } from "@/hooks/useUsers"
import { useToast } from "@/hooks/useToast"
import type { UserProfile } from "@/services/api/users/types"

interface ProfileFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  profile?: UserProfile
}

export function ProfileFormDialog({
  open,
  onOpenChange,
  userId,
  profile,
}: ProfileFormDialogProps) {
  const [customFields, setCustomFields] = useState<Array<{ id: string; key: string; value: string }>>([])
  const [metadataError, setMetadataError] = useState<string>("")

  const { showSuccess, showError } = useToast()
  const createProfileMutation = useCreateUserProfile()
  const updateProfileMutation = useUpdateUserProfile()

  const isEditing = !!profile

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(userProfileSchema),
    defaultValues: {
      first_name: "",
      middle_name: undefined,
      last_name: "",
      suffix: undefined,
      display_name: undefined,
      birthdate: undefined,
      gender: undefined,
      bio: undefined,
      phone: undefined,
      email: undefined,
      address: undefined,
      city: undefined,
      country: undefined,
      timezone: undefined,
      language: undefined,
      profile_url: undefined,
    },
    mode: 'onSubmit',
  })

  // Load profile data if editing
  useEffect(() => {
    if (open && profile) {
      reset({
        first_name: profile.first_name,
        middle_name: profile.middle_name || undefined,
        last_name: profile.last_name || undefined,
        suffix: profile.suffix || undefined,
        display_name: profile.display_name || undefined,
        birthdate: profile.birthdate ? profile.birthdate.split('T')[0] : undefined,
        gender: profile.gender || undefined,
        bio: profile.bio || undefined,
        phone: profile.phone || undefined,
        email: profile.email || undefined,
        address: profile.address || undefined,
        city: profile.city || undefined,
        country: profile.country || undefined,
        timezone: profile.timezone || undefined,
        language: profile.language || undefined,
        profile_url: profile.profile_url || undefined,
      })

      // Load custom metadata (middle_name/suffix/profile_url are real fields now,
      // not metadata, so nothing to filter out).
      if (profile.metadata) {
        const metadataFields = Object.entries(profile.metadata).map(([key, value], index) => ({
          id: `metadata-${index}`,
          key,
          value: String(value),
        }))
        setCustomFields(metadataFields)
      }
    } else if (!open) {
      reset({
        first_name: "",
        middle_name: undefined,
        last_name: "",
        suffix: undefined,
        display_name: undefined,
        birthdate: undefined,
        gender: undefined,
        bio: undefined,
        phone: undefined,
        email: undefined,
        address: undefined,
        city: undefined,
        country: undefined,
        timezone: undefined,
        language: undefined,
        profile_url: undefined,
      })
      setCustomFields([])
      setMetadataError("")
    }
  }, [open, profile, reset])

  // Check for duplicate metadata keys
  useEffect(() => {
    const keys = customFields.map(f => f.key.trim()).filter(k => k !== '')
    const duplicates = keys.filter((key, index) => keys.indexOf(key) !== index)
    
    if (duplicates.length > 0) {
      setMetadataError(`Duplicate metadata keys: ${duplicates.join(', ')}`)
    } else {
      setMetadataError("")
    }
  }, [customFields])

  const addCustomField = () => {
    setCustomFields([...customFields, { id: `field-${Date.now()}`, key: '', value: '' }])
  }

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter(field => field.id !== id))
  }

  const updateCustomField = (id: string, key: string, value: string) => {
    setCustomFields(customFields.map(field =>
      field.id === id ? { ...field, key, value } : field
    ))
  }

  const onSubmit = async (data: yup.InferType<typeof userProfileSchema>) => {
    if (metadataError) {
      showError(metadataError)
      return
    }

    try {
      // Custom metadata is purely user-defined key/value data now — the name
      // parts and picture are first-class fields the backend accepts directly.
      const metadata: Record<string, string> = {}
      customFields.forEach(field => {
        if (field.key.trim() && field.value.trim()) {
          metadata[field.key.trim()] = field.value.trim()
        }
      })

      // The schema already trims and drops empty optionals to `undefined`, so we
      // can pass the validated values straight through.
      const requestData = {
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        suffix: data.suffix,
        display_name: data.display_name,
        birthdate: data.birthdate,
        gender: data.gender,
        bio: data.bio,
        phone: data.phone,
        email: data.email,
        address: data.address,
        city: data.city,
        country: data.country,
        timezone: data.timezone,
        language: data.language,
        profile_url: data.profile_url,
        metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
      }

      if (isEditing) {
        await updateProfileMutation.mutateAsync({
          userId,
          profileId: profile!.profile_id,
          data: requestData
        })
        showSuccess("Profile updated successfully")
      } else {
        await createProfileMutation.mutateAsync({
          userId,
          data: requestData
        })
        showSuccess("Profile created successfully")
      }

      onOpenChange(false)
    } catch (error) {
      showError(error)
    }
  }

  const isLoading = createProfileMutation.isPending || updateProfileMutation.isPending || isSubmitting

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Profile" : "Create Profile"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the profile information below"
              : "Fill in the profile information below"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-medium">Basic Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <FormInputField
                label="First Name"
                placeholder="John"
                maxLength={100}
                error={errors.first_name?.message}
                required
                {...register("first_name")}
              />
              <FormInputField
                label="Middle Name"
                placeholder="Michael"
                maxLength={100}
                error={errors.middle_name?.message}
                {...register("middle_name")}
              />
              <FormInputField
                label="Last Name"
                placeholder="Doe"
                maxLength={100}
                error={errors.last_name?.message}
                {...register("last_name")}
              />
              <FormInputField
                label="Suffix"
                placeholder="Jr., Sr., etc."
                maxLength={50}
                error={errors.suffix?.message}
                {...register("suffix")}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormInputField
                label="Display Name"
                placeholder="John M. Doe"
                description="Shown across the app; defaults to the full name"
                maxLength={100}
                error={errors.display_name?.message}
                {...register("display_name")}
              />
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <FormSelectField
                    label="Gender"
                    placeholder="Select gender"
                    options={genderOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={errors.gender?.message}
                  />
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Controller
                name="birthdate"
                control={control}
                render={({ field }) => (
                  <FormDateField
                    label="Birthdate"
                    value={field.value || ""}
                    onChange={field.onChange}
                    error={errors.birthdate?.message}
                  />
                )}
              />
              <FormInputField
                label="Profile Picture URL"
                placeholder="https://example.com/avatar.png"
                maxLength={1000}
                error={errors.profile_url?.message}
                {...register("profile_url")}
              />
            </div>

            <FormTextareaField
              label="Bio"
              placeholder="Tell us about yourself..."
              maxLength={1000}
              error={errors.bio?.message}
              {...register("bio")}
            />
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-medium">Contact Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <FormInputField
                label="Email"
                type="email"
                placeholder="john.doe@example.com"
                maxLength={255}
                error={errors.email?.message}
                {...register("email")}
              />
              <FormInputField
                label="Phone"
                type="tel"
                placeholder="+1 555 123 4567"
                maxLength={20}
                error={errors.phone?.message}
                {...register("phone")}
              />
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="font-medium">Location</h3>
            <FormInputField
              label="Address"
              placeholder="123 Main St"
              maxLength={500}
              error={errors.address?.message}
              {...register("address")}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <FormInputField
                label="City"
                placeholder="New York"
                maxLength={100}
                error={errors.city?.message}
                {...register("city")}
              />
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <FormSelectField
                    label="Country"
                    placeholder="Select country"
                    options={countryOptions}
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    error={errors.country?.message}
                  />
                )}
              />
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <h3 className="font-medium">Preferences</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Controller
                name="timezone"
                control={control}
                render={({ field }) => (
                  <FormSelectField
                    label="Timezone"
                    placeholder="Select timezone"
                    options={timezoneOptions}
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    error={errors.timezone?.message}
                  />
                )}
              />
              <Controller
                name="language"
                control={control}
                render={({ field }) => (
                  <FormSelectField
                    label="Language"
                    placeholder="Select language"
                    options={languageOptions}
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    error={errors.language?.message}
                  />
                )}
              />
            </div>
          </div>

          {/* Custom Metadata */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-medium">Custom Metadata</h3>
                <p className="text-sm text-muted-foreground">
                  Optional key-value pairs stored alongside the profile.
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addCustomField} className="h-9 shrink-0 gap-2">
                <Plus className="size-4" />
                Add Field
              </Button>
            </div>

            {metadataError && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{metadataError}</div>
            )}

            {customFields.length === 0 ? (
              <div className="rounded-lg border border-dashed py-8 text-center">
                <p className="text-sm text-muted-foreground">No custom metadata yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {customFields.map((field) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <Input
                      aria-label="Metadata key"
                      placeholder="Key (e.g., employee_id)"
                      value={field.key}
                      onChange={(e) => updateCustomField(field.id, e.target.value, field.value)}
                    />
                    <Input
                      aria-label="Metadata value"
                      placeholder="Value"
                      value={field.value}
                      onChange={(e) => updateCustomField(field.id, field.key, e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCustomField(field.id)}
                      className="size-9 shrink-0 p-0 text-muted-foreground"
                    >
                      <span className="sr-only">Remove field</span>
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !!metadataError}>
              {isLoading ? "Saving..." : isEditing ? "Update Profile" : "Create Profile"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
