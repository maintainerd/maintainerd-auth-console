/**
 * IP Restrictions Page
 * Manage IP allow/deny rules via the backend /ip-restriction-rules CRUD API.
 */

import { DetailsContainer } from '@/components/container'
import { IpAllowBlockLists } from './components/IpAllowBlockLists'

export default function IpRestrictionsPage() {
  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">IP Restrictions</h1>
          <p className="text-muted-foreground">
            Manage IP allow/deny rules to control access to your authentication system.
          </p>
        </div>

        <IpAllowBlockLists />
      </div>
    </DetailsContainer>
  )
}
