import { useState } from "react"
import { useNavigate } from "react-router-dom"
import type { ReactNode } from "react"
import { Edit, Mail, Phone, CalendarDays, User, MapPin } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DetailLayout, DetailHeaderCard, type DetailAttribute } from "@/components/details"
import { InformationCard } from "@/components/card"
import { fetchAccountProfile, type AccountProfile } from "@/services/api/account"
import { useQuery } from "@tanstack/react-query"
import { ProfileEditDialog } from "./components/ProfileEditDialog"

function fmtDate(value?: string | null) {
  if (!value) return null
  try { return format(new Date(value), "PP") } catch { return null }
}

const GENDER_LABELS: Record<string, string> = {
  male: "Male", female: "Female", other: "Other", prefer_not_to_say: "Prefer not to say",
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const [editOpen, setEditOpen] = useState(false)

  const { data, isLoading, isError } = useQuery({ queryKey: ["account", "profile"], queryFn: fetchAccountProfile, retry: false })

  const fullName = data ? [data.first_name, data.last_name].filter(Boolean).join(" ").trim() : ""
  const title = data?.display_name || fullName || "Your profile"
  const initials = (data?.display_name || data?.first_name || data?.email || "U").slice(0, 2).toUpperCase()

  const headerAttributes: DetailAttribute[] = data
    ? [
        { icon: Mail, label: "Email", value: data.email || <Muted>Not set</Muted> },
        { icon: Phone, label: "Phone", value: data.phone || <Muted>Not set</Muted> },
        { icon: CalendarDays, label: "Member since", value: fmtDate(data.created_at) || <Muted>—</Muted> },
      ]
    : []

  return (
    <DetailLayout
      backLabel="Back"
      onBack={() => navigate(`/dashboard`)}
      isLoading={isLoading}
      isError={isError || !data}
      notFoundTitle="Profile not found"
      notFoundDescription="We couldn't load your profile. Please try again."
    >
      {data && (
        <>
          <DetailHeaderCard
            leading={
              <Avatar className="size-14 rounded-xl">
                <AvatarImage src={data.profile_url || undefined} alt={title} />
                <AvatarFallback className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-semibold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
            }
            title={title}
            subtitle={fullName && fullName !== title ? fullName : data.email}
            attributes={headerAttributes}
            actions={
              <Button variant="outline" size="sm" className="h-9 gap-2" onClick={() => setEditOpen(true)}>
                <Edit className="size-4" />
                Edit profile
              </Button>
            }
          />

          <InformationCard title="Personal information" description="Your name and personal details." icon={User}>
            <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              <ViewField label="First name" value={data.first_name} />
              <ViewField label="Middle name" value={data.middle_name} />
              <ViewField label="Last name" value={data.last_name} />
              <ViewField label="Suffix" value={data.suffix} />
              <ViewField label="Display name" value={data.display_name} />
              <ViewField label="Gender" value={data.gender ? GENDER_LABELS[data.gender] ?? data.gender : undefined} />
              <ViewField label="Date of birth" value={fmtDate(data.birthdate)} />
              <ViewField label="Bio" value={data.bio} className="sm:col-span-2 lg:col-span-3" />
            </div>
          </InformationCard>

          <InformationCard title="Location" description="Where you're based." icon={MapPin}>
            <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              <ViewField label="Address" value={data.address} className="sm:col-span-2 lg:col-span-3" />
              <ViewField label="City" value={data.city} />
              <ViewField label="Country" value={data.country} />
            </div>
          </InformationCard>

          <ProfileEditDialog open={editOpen} onOpenChange={setEditOpen} profile={data as AccountProfile} />
        </>
      )}
    </DetailLayout>
  )
}

function ViewField({ label, value, className }: { label: string; value?: ReactNode; className?: string }) {
  return (
    <div className={"flex flex-col gap-1 " + (className ?? "")}>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground">{value || <Muted>Not set</Muted>}</p>
    </div>
  )
}

function Muted({ children }: { children: ReactNode }) {
  return <span className="text-muted-foreground">{children}</span>
}
