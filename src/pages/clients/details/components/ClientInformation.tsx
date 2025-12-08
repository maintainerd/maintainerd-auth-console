import { format } from "date-fns"
import { InformationCard } from "@/components/card"
import { Globe, Smartphone, Monitor, Cog } from "lucide-react"
import type { ClientTypeEnum } from "@/services/api/auth-client/types"

interface ClientInformationProps {
  client: {
    name: string
    client_type: ClientTypeEnum
    domain: string
    identity_provider: {
      display_name: string
    }
    created_at: string
  }
}

const getClientTypeConfig = (type: ClientTypeEnum) => {
  const config = {
    traditional: { label: "Traditional Web Application", icon: Globe },
    spa: { label: "Single Page Application", icon: Monitor },
    mobile: { label: "Native Mobile Application", icon: Smartphone },
    m2m: { label: "Machine to Machine", icon: Cog }
  }
  // Fallback for unknown types or legacy "native" type
  return config[type] || config.mobile || { label: type, icon: Monitor }
}

export function ClientInformation({ client }: ClientInformationProps) {
  const typeConfig = getClientTypeConfig(client.client_type)
  const TypeIcon = typeConfig.icon

  return (
    <InformationCard title="Client Information">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Client Name</p>
          <p className="text-sm font-mono">{client.name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Client Type</p>
          <div className="flex items-center gap-2">
            <TypeIcon className="h-4 w-4" />
            <p className="text-sm">{typeConfig.label}</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Domain</p>
          <p className="text-sm font-mono break-all">{client.domain}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Identity Provider</p>
          <p className="text-sm">{client.identity_provider.display_name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Created</p>
          <p className="text-sm">{format(new Date(client.created_at), "MMM d, yyyy")}</p>
        </div>
      </div>
    </InformationCard>
  )
}

