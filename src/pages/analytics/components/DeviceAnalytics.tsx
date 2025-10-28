import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Monitor,
  Smartphone
} from "lucide-react"
import { deviceStatsData } from "../constants"

const DeviceAnalytics = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Monitor className="h-4 w-4" />
          Device & Session Analytics
        </CardTitle>
        <CardDescription>User access patterns by device type</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid gap-3 md:grid-cols-3">
          {deviceStatsData.map((device, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {device.device === 'Desktop' && <Monitor className="h-5 w-5 text-blue-600" />}
                {device.device === 'Mobile' && <Smartphone className="h-5 w-5 text-green-600" />}
                {device.device === 'Tablet' && <Monitor className="h-5 w-5 text-purple-600" />}
                <div className="font-medium">{device.device}</div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Users</span>
                  <span className="font-medium">{device.count}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sessions</span>
                  <span className="font-medium">{device.sessions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Share</span>
                  <span className="font-medium">{device.percentage}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default DeviceAnalytics
