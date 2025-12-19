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
  type SelectOption
} from "@/components/form"
import { userProfileSchema } from "@/lib/validations"
import { useCreateUserProfile, useUpdateUserProfile } from "@/hooks/useUsers"
import { useToast } from "@/hooks/useToast"
import type { UserProfileType } from "@/services/api/user/types"

interface ProfileFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  profile?: UserProfileType
}

const GENDER_OPTIONS: SelectOption[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
]

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
        middle_name: profile.metadata?.middle_name as string || undefined,
        last_name: profile.last_name,
        suffix: profile.metadata?.suffix as string || undefined,
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
        profile_url: profile.metadata?.profile_url as string || undefined,
      })

      // Load custom metadata
      if (profile.metadata) {
        const metadataFields = Object.entries(profile.metadata)
          .filter(([key]) => !['middle_name', 'suffix', 'profile_url'].includes(key))
          .map(([key, value], index) => ({
            id: `metadata-${index}`,
            key,
            value: String(value)
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
      // Build metadata object
      const metadata: Record<string, string> = {}
      
      // Add form fields that go into metadata
      if (data.middle_name) metadata.middle_name = data.middle_name
      if (data.suffix) metadata.suffix = data.suffix
      if (data.profile_url) metadata.profile_url = data.profile_url

      // Add custom fields
      customFields.forEach(field => {
        if (field.key.trim() && field.value.trim()) {
          metadata[field.key.trim()] = field.value.trim()
        }
      })

      const requestData = {
        first_name: data.first_name,
        last_name: data.last_name,
        display_name: data.display_name || undefined,
        birthdate: data.birthdate || undefined,
        gender: data.gender || undefined,
        bio: data.bio || undefined,
        phone: data.phone || undefined,
        email: data.email || undefined,
        address: data.address || undefined,
        city: data.city || undefined,
        country: data.country || undefined,
        timezone: data.timezone || undefined,
        language: data.language || undefined,
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
                error={errors.first_name?.message}
                required
                {...register("first_name")}
              />
              <FormInputField
                label="Middle Name"
                placeholder="Michael"
                error={errors.middle_name?.message}
                {...register("middle_name")}
              />
              <FormInputField
                label="Last Name"
                placeholder="Doe"
                error={errors.last_name?.message}
                required
                {...register("last_name")}
              />
              <FormInputField
                label="Suffix"
                placeholder="Jr., Sr., etc."
                error={errors.suffix?.message}
                {...register("suffix")}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormInputField
                label="Display Name"
                placeholder="John M. Doe"
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
                    options={GENDER_OPTIONS}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={errors.gender?.message}
                  />
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormInputField
                label="Birthdate"
                type="date"
                error={errors.birthdate?.message}
                {...register("birthdate")}
              />
              <FormInputField
                label="Profile URL"
                placeholder="https://example.com"
                error={errors.profile_url?.message}
                {...register("profile_url")}
              />
            </div>

            <FormTextareaField
              label="Bio"
              placeholder="Tell us about yourself..."
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
                error={errors.email?.message}
                {...register("email")}
              />
              <FormInputField
                label="Phone"
                placeholder="+1234567890"
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
              error={errors.address?.message}
              {...register("address")}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <FormInputField
                label="City"
                placeholder="New York"
                error={errors.city?.message}
                {...register("city")}
              />
              <FormInputField
                label="Country Code"
                placeholder="US"
                error={errors.country?.message}
                {...register("country")}
              />
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <h3 className="font-medium">Preferences</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <FormInputField
                label="Timezone"
                placeholder="America/New_York"
                error={errors.timezone?.message}
                {...register("timezone")}
              />
              <FormInputField
                label="Language"
                placeholder="en-US"
                error={errors.language?.message}
                {...register("language")}
              />
            </div>
          </div>

          {/* Custom Metadata */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Custom Metadata</h3>
              <Button type="button" variant="outline" size="sm" onClick={addCustomField}>
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>

            {metadataError && (
              <p className="text-sm text-destructive">{metadataError}</p>
            )}

            {customFields.map((field) => (
              <div key={field.id} className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Key"
                    value={field.key}
                    onChange={(e) => updateCustomField(field.id, e.target.value, field.value)}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Value"
                    value={field.value}
                    onChange={(e) => updateCustomField(field.id, field.key, e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCustomField(field.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
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
