import { format } from "date-fns"
import { InformationCard } from "@/components/card"

interface RoleInformationProps {
  role: {
    name: string
    createdAt: string
    updatedAt: string
    is_system: boolean
    is_default: boolean
  }
}

export function RoleInformation({ role }: RoleInformationProps) {
  return (
    <InformationCard title="Role Information">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Role Name</p>
          <p className="text-sm font-mono">{role.name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Type</p>
          <p className="text-sm">{role.is_system ? "System Role" : "Custom Role"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Created</p>
          <p className="text-sm">{format(new Date(role.createdAt), "MMM d, yyyy")}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
          <p className="text-sm">{format(new Date(role.updatedAt), "MMM d, yyyy")}</p>
        </div>
      </div>
    </InformationCard>
  )
}
