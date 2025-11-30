import { format } from "date-fns"
import { InformationCard } from "@/components/card"

interface ApiInformationProps {
  api: {
    name: string
    identifier: string
    apiType: string
    createdAt: string
    isSystem: boolean
    serviceName: string
  }
}

export function ApiInformation({ api }: ApiInformationProps) {
  return (
    <InformationCard title="API Information">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div>
          <p className="text-sm font-medium text-muted-foreground">API Name</p>
          <p className="text-sm font-mono">{api.name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Identifier</p>
          <p className="text-sm font-mono">{api.identifier}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Service</p>
          <p className="text-sm">{api.serviceName}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Created</p>
          <p className="text-sm">{format(new Date(api.createdAt), "MMM d, yyyy")}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Type</p>
          <p className="text-sm uppercase">{api.apiType}</p>
        </div>
      </div>
    </InformationCard>
  )
}

