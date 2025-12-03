import { format } from "date-fns"
import { InformationCard } from "@/components/card"
import { getProviderDisplayName } from "../utils"

interface IdentityProviderInformationProps {
  provider: {
    name: string
    identifier: string
    provider: string
    is_system: boolean
    created_at: string
    tenant: {
      name: string
      identifier: string
    }
  }
}

export function IdentityProviderInformation({ provider }: IdentityProviderInformationProps) {
  return (
    <InformationCard title="Provider Information">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div>
          <p className="text-sm font-medium text-muted-foreground">System Name</p>
          <p className="text-sm font-mono">{provider.name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Identifier</p>
          <p className="text-sm font-mono">{provider.identifier}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Provider Type</p>
          <p className="text-sm">{getProviderDisplayName(provider.provider, provider.is_system)}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Created</p>
          <p className="text-sm">{format(new Date(provider.created_at), "MMM d, yyyy")}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Tenant</p>
          <p className="text-sm">{provider.tenant.name}</p>
        </div>
      </div>
    </InformationCard>
  )
}

