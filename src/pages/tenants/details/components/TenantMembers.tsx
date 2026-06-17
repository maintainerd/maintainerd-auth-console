import { useParams } from "react-router-dom"
import { MembersSettings } from "@/pages/settings/components/MembersSettings"

export function TenantMembers() {
  const { id } = useParams<{ id: string }>()

  return <MembersSettings tenantId={id} />
}
