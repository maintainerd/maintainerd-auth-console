import { Card, CardContent } from "@/components/ui/card"
import { Users } from "lucide-react"

export function TenantMembers() {
  return (
    <Card className="shadow-xs">
      <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Users className="size-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Tenant Members</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Manage users and their roles within this tenant. Assign owners, members, and control access to tenant resources.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
