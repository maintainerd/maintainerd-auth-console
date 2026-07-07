import { useForm, Controller } from "react-hook-form"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
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
}

function toForm(s: UserSettings): PrefForm {
  return {
    timezone: s.timezone ?? "",
    locale: s.locale ?? s.preferred_language ?? "",
  }
}

export function PreferencesForm() {
  const { data, isLoading } = useQuery({ queryKey: ["account", "settings"], queryFn: fetchUserSettings, retry: false })

  if (isLoading) return <div className="grid gap-6"><Skeleton className="h-48 w-full rounded-xl" /></div>

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

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" disabled={!isDirty || mutation.isPending} onClick={() => reset()}>Cancel</Button>
        <Button type="submit" disabled={!isDirty || mutation.isPending}>{mutation.isPending ? "Saving…" : "Save preferences"}</Button>
      </div>
    </form>
  )
}
