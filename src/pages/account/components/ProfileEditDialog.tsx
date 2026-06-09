import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FormInputField, FormTextareaField, FormSelectField, FormDateField } from "@/components/form"
import { userProfileSchema, type UserProfileFormData } from "@/lib/validations"
import { countryOptions, genderOptions } from "@/lib/constants"
import { useToast } from "@/hooks/useToast"
import { useAppDispatch } from "@/store/hooks"
import { setProfile } from "@/store/auth/slice"
import { updateAccountProfile, type AccountProfile } from "@/services/api/account"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface ProfileEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: AccountProfile
}

function toDefaults(p: AccountProfile): UserProfileFormData {
  return {
    first_name: p.first_name ?? "",
    middle_name: p.middle_name || undefined,
    last_name: p.last_name || undefined,
    suffix: p.suffix || undefined,
    display_name: p.display_name || undefined,
    birthdate: p.birthdate ? p.birthdate.split("T")[0] : undefined,
    gender: p.gender || undefined,
    bio: p.bio || undefined,
    phone: p.phone || undefined,
    email: p.email || undefined,
    address: p.address || undefined,
    city: p.city || undefined,
    country: p.country || undefined,
    timezone: p.timezone || undefined,
    language: p.language || undefined,
    profile_url: p.profile_url || undefined,
  }
}

export function ProfileEditDialog({ open, onOpenChange, profile }: ProfileEditDialogProps) {
  const { showSuccess, showError } = useToast()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserProfileFormData>({
    resolver: yupResolver(userProfileSchema),
    defaultValues: toDefaults(profile),
    mode: "onSubmit",
  })

  useEffect(() => { if (open) reset(toDefaults(profile)) }, [open, profile, reset])

  const mutation = useMutation({
    mutationFn: (data: UserProfileFormData) => updateAccountProfile(data),
    onSuccess: (updated) => {
      dispatch(setProfile({
        profile_id: updated.profile_id,
        first_name: updated.first_name ?? "",
        last_name: updated.last_name ?? "",
        display_name: updated.display_name ?? "",
        bio: updated.bio,
        birthdate: updated.birthdate ?? undefined,
        gender: updated.gender,
        phone: updated.phone,
        email: updated.email ?? "",
        address: updated.address,
        city: updated.city,
        country: updated.country,
        timezone: updated.timezone,
        language: updated.language,
        created_at: updated.created_at ?? "",
        updated_at: updated.updated_at ?? "",
      }))
      queryClient.invalidateQueries({ queryKey: ["account", "profile"] })
      showSuccess("Profile updated successfully")
      onOpenChange(false)
    },
    onError: (e) => showError(e),
  })

  const isLoading = mutation.isPending || isSubmitting

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your personal information below.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-medium">Basic Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <FormInputField label="First Name" placeholder="John" maxLength={100} error={errors.first_name?.message} required {...register("first_name")} />
              <FormInputField label="Middle Name" placeholder="Michael" maxLength={100} error={errors.middle_name?.message} {...register("middle_name")} />
              <FormInputField label="Last Name" placeholder="Doe" maxLength={100} error={errors.last_name?.message} {...register("last_name")} />
              <FormInputField label="Suffix" placeholder="Jr., Sr., etc." maxLength={50} error={errors.suffix?.message} {...register("suffix")} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormInputField label="Display Name" placeholder="John M. Doe" description="Shown across the app; defaults to the full name" maxLength={100} error={errors.display_name?.message} {...register("display_name")} />
              <Controller name="gender" control={control} render={({ field }) => (
                <FormSelectField label="Gender" placeholder="Select gender" options={genderOptions} value={field.value} onValueChange={field.onChange} error={errors.gender?.message} />
              )} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Controller name="birthdate" control={control} render={({ field }) => (
                <FormDateField label="Birthdate" value={field.value || ""} onChange={field.onChange} error={errors.birthdate?.message} />
              )} />
              <FormInputField label="Profile Picture URL" placeholder="https://example.com/avatar.png" maxLength={1000} error={errors.profile_url?.message} {...register("profile_url")} />
            </div>

            <FormTextareaField label="Bio" placeholder="Tell us about yourself..." maxLength={1000} error={errors.bio?.message} {...register("bio")} />
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-medium">Contact Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <FormInputField label="Phone" type="tel" placeholder="+1 555 123 4567" maxLength={20} error={errors.phone?.message} {...register("phone")} />
            </div>
            <p className="text-sm text-muted-foreground">
              Your sign-in email and username are managed in Settings → Security. Timezone and language live in Settings → Preferences.
            </p>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="font-medium">Location</h3>
            <FormInputField label="Address" placeholder="123 Main St" maxLength={500} error={errors.address?.message} {...register("address")} />
            <div className="grid gap-4 md:grid-cols-2">
              <FormInputField label="City" placeholder="New York" maxLength={100} error={errors.city?.message} {...register("city")} />
              <Controller name="country" control={control} render={({ field }) => (
                <FormSelectField label="Country" placeholder="Select country" options={countryOptions} value={field.value || ""} onValueChange={field.onChange} error={errors.country?.message} />
              )} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Update Profile"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
