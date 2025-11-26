import { format } from "date-fns"
import { InformationCard } from "@/components/card"

interface ServiceInformationProps {
  service: {
    name: string
    version: string
    createdAt: string
    createdBy: string
    isSystem: boolean
  }
}

export function ServiceInformation({ service }: ServiceInformationProps) {
  return (
    <InformationCard title="Service Information">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Service Name</p>
          <p className="text-sm font-mono">{service.name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Version</p>
          <p className="text-sm font-mono">{service.version}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Created</p>
          <p className="text-sm">{format(new Date(service.createdAt), "MMM d, yyyy")}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Created By</p>
          <p className="text-sm">{service.createdBy}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Type</p>
          <p className="text-sm">{service.isSystem ? "System Service" : "Custom Service"}</p>
        </div>
      </div>
    </InformationCard>
  )
}

