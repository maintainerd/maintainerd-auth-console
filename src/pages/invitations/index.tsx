import { PageHeader } from "@/components/layout"
import { InvitationListing } from "./components/InvitationListing"

export default function InvitationsPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <PageHeader
        title="Invitations"
        description="Invite people to register. They receive a signed email link and onboard on the public sign-up page."
      />
      <InvitationListing tableInCard />
    </div>
  )
}
