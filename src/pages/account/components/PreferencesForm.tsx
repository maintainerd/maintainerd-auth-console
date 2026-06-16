import { useForm, Controller } from "react-hook-form"
import { Globe, Bell, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { SettingsCard } from "@/components/card"
import { timezoneOptions, languageOptions } from "@/lib/constants"
import { useToast } from "@/hooks/useToast"
import { fetchUserSettings, updateUserSettings, type UserSettings } from "@/services/api/account"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

interface PrefForm {
  timezone: string
  // Single language value, persisted as `locale` (the backend's source of truth).
  locale: string
  preferred_contact_method: string
  profile_visibility: string
  marketing_email_consent: boolean
  sms_notifications_consent: boolean
  push_notifications_consent: boolean
}

function toForm(s: UserSettings): PrefForm {
  return {
    timezone: s.timezone ?? "",
    locale: s.locale ?? s.preferred_language ?? "",
    preferred_contact_method: s.preferred_contact_method ?? "", profile_visibility: s.profile_visibility ?? "",
    marketing_email_consent: !!s.marketing_email_consent,
    sms_notifications_consent: !!s.sms_notifications_consent,
    push_notifications_consent: !!s.push_notifications_consent,
  }
}

export function PreferencesForm() {
  const { data, isLoading } = useQuery({ queryKey: ["account", "settings"], queryFn: fetchUserSettings, retry: false })

  if (isLoading) return <div className="grid gap-6"><Skeleton className="h-48 w-full rounded-xl" /><Skeleton className="h-48 w-full rounded-xl" /></div>

  // Mount the form only once data is loaded, keyed so a refetch with new values
  // re-initialises it. This guarantees each Select mounts with its value already
  // set — Radix Select won't reliably reflect a value applied after mount.
  return <PreferencesFormInner key={data?.updated_at ?? "new"} initial={data ?? {}} />
}

function PreferencesFormInner({ initial }: { initial: UserSettings }) {
  const { showSuccess, showError } = useToast()
  const queryClient = useQueryClient()

  const { handleSubmit, reset, control, formState: { isDirty } } = useForm<PrefForm>({ defaultValues: toForm(initial) })

  const mutation = useMutation({
    // The backend validates optional fields with NilOrNotEmpty, so blank values
    // must be omitted (sent as undefined), not as "". Language is persisted as
    // `locale` (source of truth) and mirrored to `preferred_language` for compat.
    mutationFn: (form: PrefForm) => {
      const opt = (v: string) => (v.trim() ? v.trim() : undefined)
      return updateUserSettings({
        timezone: opt(form.timezone),
        locale: opt(form.locale),
        preferred_language: opt(form.locale),
        preferred_contact_method: opt(form.preferred_contact_method),
        profile_visibility: opt(form.profile_visibility),
        marketing_email_consent: form.marketing_email_consent,
        sms_notifications_consent: form.sms_notifications_consent,
        push_notifications_consent: form.push_notifications_consent,
      })
    },
    onSuccess: (updated) => {
      // Re-baseline the form to the saved values (clears dirty state). The outer
      // query is invalidated so other consumers refresh.
      reset(toForm(updated))
      queryClient.invalidateQueries({ queryKey: ["account", "settings"] })
      showSuccess("Preferences saved")
    },
    onError: (e) => showError(e),
  })

  return (
    <form onSubmit={handleSubmit((f) => mutation.mutate(f))} className="grid gap-6">
      <SettingsCard title="Localization" description="Your timezone and language preferences." icon={Globe}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Timezone</Label>
            <Controller control={control} name="timezone" render={({ field }) => (
              <Select value={field.value || undefined} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue placeholder="Select timezone" /></SelectTrigger>
                <SelectContent>
                  {timezoneOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            )} />
          </div>
          <div className="space-y-2">
            <Label>Language</Label>
            <Controller control={control} name="locale" render={({ field }) => (
              <Select value={field.value || undefined} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
                <SelectContent>
                  {languageOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            )} />
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Notifications" description="Choose how we may contact you." icon={Bell}>
        <div className="divide-y">
          <ToggleRow control={control} name="marketing_email_consent" title="Marketing emails" desc="Product news, tips, and offers." />
          <ToggleRow control={control} name="sms_notifications_consent" title="SMS notifications" desc="Time-sensitive alerts by text message." />
          <ToggleRow control={control} name="push_notifications_consent" title="Push notifications" desc="In-app and browser push alerts." />
        </div>
        <div className="mt-4 space-y-2 max-w-xs">
          <Label>Preferred contact method</Label>
          <Controller control={control} name="preferred_contact_method" render={({ field }) => (
            <Select value={field.value || undefined} onValueChange={field.onChange}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
              </SelectContent>
            </Select>
          )} />
        </div>
      </SettingsCard>

      <SettingsCard title="Privacy" description="Control who can see your profile." icon={Eye}>
        <div className="space-y-2 max-w-xs">
          <Label>Profile visibility</Label>
          <Controller control={control} name="profile_visibility" render={({ field }) => (
            <Select value={field.value || undefined} onValueChange={field.onChange}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="friends">Friends only</SelectItem>
                <SelectItem value="public">Public</SelectItem>
              </SelectContent>
            </Select>
          )} />
        </div>
      </SettingsCard>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" disabled={!isDirty || mutation.isPending} onClick={() => reset()}>Cancel</Button>
        <Button type="submit" disabled={!isDirty || mutation.isPending}>{mutation.isPending ? "Saving…" : "Save preferences"}</Button>
      </div>
    </form>
  )
}

function ToggleRow({ control, name, title, desc }: {
  control: import("react-hook-form").Control<PrefForm>
  name: "marketing_email_consent" | "sms_notifications_consent" | "push_notifications_consent"
  title: string
  desc: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      <Controller control={control} name={name} render={({ field }) => (
        <Switch
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      )} />
    </div>
  )
}
