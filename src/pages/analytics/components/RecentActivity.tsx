import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Eye,
  Users, 
  Shield, 
  Server
} from "lucide-react"
import { recentActivityData } from "../constants"

const RecentActivity = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Success</Badge>
      case "failed":
        return <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "login": return <Users className="h-4 w-4 text-blue-600" />
      case "signup": return <Users className="h-4 w-4 text-green-600" />
      case "api_call": return <Server className="h-4 w-4 text-purple-600" />
      case "password_reset": return <Shield className="h-4 w-4 text-orange-600" />
      case "logout": return <Users className="h-4 w-4 text-gray-600" />
      default: return <Eye className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Eye className="h-4 w-4" />
          Recent Activity
        </CardTitle>
        <CardDescription>Live authentication events</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {recentActivityData.slice(0, 5).map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-2">
                {getActivityIcon(activity.type)}
                <div>
                  <div className="text-sm font-medium">{activity.user}</div>
                  <div className="text-xs text-muted-foreground">
                    {activity.type.replace('_', ' ')} • {activity.ip}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(activity.status)}
                <div className="text-xs text-muted-foreground">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default RecentActivity
