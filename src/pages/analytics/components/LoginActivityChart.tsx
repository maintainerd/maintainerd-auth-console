import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3 } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { loginActivityData, timeRangeOptions } from "../constants"

const LoginActivityChart = () => {
  const [timeRange, setTimeRange] = React.useState("7d")

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-4 w-4" />
              Login Activity
            </CardTitle>
            <CardDescription>Daily login attempts and success rates</CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer
          config={{
            successful: {
              label: "Successful",
              color: "#3b82f6",
            },
            failed: {
              label: "Failed",
              color: "#ef4444",
            },
          }}
          className="h-[200px] w-full"
        >
          <BarChart width={400} height={200} data={loginActivityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="successful" fill="#3b82f6" radius={[2, 2, 0, 0]} />
            <Bar dataKey="failed" fill="#ef4444" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default LoginActivityChart
