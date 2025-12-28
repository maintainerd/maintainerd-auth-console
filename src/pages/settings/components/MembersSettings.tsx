import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

export function MembersSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tenant Members</CardTitle>
        <CardDescription>
          Manage users who have access to this tenant
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Member management coming soon</p>
        </div>
      </CardContent>
    </Card>
  )
}
