import { useNavigate } from "react-router-dom"
import type { SortingState } from "@tanstack/react-table"
import { PageContainer, PageHeader } from "@/components/layout"
import { ResourceListing, type FilterGroup } from "@/components/data-table"
import { useInvitesList } from "@/hooks/useInvites"
import { inviteColumns } from "./components/InviteColumns"

const DEFAULT_SORT: SortingState = [{ id: "Invited", desc: true }]
const SEARCH_FIELDS = ["invited_email"]
const FILTER_GROUPS: readonly FilterGroup[] = [
  { key: "status", label: "Status", options: ["pending", "accepted", "expired", "revoked"] },
]

export default function InvitationsPage() {
  const navigate = useNavigate()

  return (
    <PageContainer>
      <PageHeader
        title="Invitations"
        description="Invite people to register. They receive a signed email link and onboard on the public sign-up page."
      />

      <ResourceListing
        columns={inviteColumns}
        defaultSort={DEFAULT_SORT}
        searchFields={SEARCH_FIELDS}
        searchPlaceholder="Search invitations by email..."
        useData={useInvitesList}
        filterGroups={FILTER_GROUPS}
        onRowClick={(invite) => navigate(`/invites/${invite.invite_id}`)}
        onCreate={() => navigate(`/invites/create`)}
        createLabel="Invite User"
      />
    </PageContainer>
  )
}
