import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { 
  UserCheck,
  Activity,
  UserX,
  Shield
} from "lucide-react"
import { analyticsStats } from "../constants"

const KeyMetrics = () => {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Logins</p>
              <p className="text-xl font-bold text-blue-600">{analyticsStats.totalLogins.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">95.4% success rate</p>
            </div>
            <UserCheck className="h-6 w-6 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Sessions</p>
              <p className="text-xl font-bold text-green-600">{analyticsStats.activeSessions}</p>
              <p className="text-xs text-muted-foreground">Avg: {analyticsStats.avgSessionDuration}</p>
            </div>
            <Activity className="h-6 w-6 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Failed Logins</p>
              <p className="text-xl font-bold text-red-600">{analyticsStats.failedLogins}</p>
              <p className="text-xs text-muted-foreground">4.6% failure rate</p>
            </div>
            <UserX className="h-6 w-6 text-red-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">MFA Adoption</p>
              <p className="text-xl font-bold text-purple-600">{analyticsStats.mfaAdoption}%</p>
              <p className="text-xs text-muted-foreground">Security enhancement</p>
            </div>
            <Shield className="h-6 w-6 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default KeyMetrics
