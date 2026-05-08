import React from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Calendar } from "lucide-react"
import {
  KeyMetrics,
  LoginActivityChart,
  ApiTrafficChart,
  AuthMethodsChart,
  ServiceUsageChart,
  RecentActivity,
  DeviceAnalytics
} from "./components"

const AnalyticsPage = () => {

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">Monitor authentication activity, security events, and service usage</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Last 7 days
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <KeyMetrics />

        {/* Charts Row 1 */}
        <div className="grid gap-4 md:grid-cols-2">
          <LoginActivityChart />
          <ApiTrafficChart />
        </div>

        {/* Authentication Methods Chart - Full Width */}
        <AuthMethodsChart />

        {/* Service Usage Chart - Full Width */}
        <ServiceUsageChart />

        {/* Recent Activity */}
        <RecentActivity />

        {/* Device Analytics */}
        <DeviceAnalytics />
      </div>
    </div>
  )
}

export default AnalyticsPage
