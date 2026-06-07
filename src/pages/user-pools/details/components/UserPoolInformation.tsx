import { format } from "date-fns"
import { InformationCard } from "@/components/card"

interface UserPoolInformationProps {
  userPool: {
    identifier: string
    is_system: boolean
    createdAt: string
    updatedAt: string
  }
}

export function UserPoolInformation({ userPool }: UserPoolInformationProps) {
  return (
    <InformationCard title="User Pool Information">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Identifier</p>
          <p className="text-sm font-mono">{userPool.identifier}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Type</p>
          <p className="text-sm">{userPool.is_system ? "System Pool" : "Custom Pool"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Created</p>
          <p className="text-sm">{format(new Date(userPool.createdAt), "MMM d, yyyy")}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
          <p className="text-sm">{format(new Date(userPool.updatedAt), "MMM d, yyyy")}</p>
        </div>
      </div>
    </InformationCard>
  )
}
