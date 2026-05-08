import * as React from "react"
import { LogDataTable } from "./components/LogDataTable"
import { logColumns } from "./components/LogColumns"
import { MOCK_LOGS, type LogEntry } from "./constants"

export default function LogMonitoringPage() {
  const [logs, setLogs] = React.useState<LogEntry[]>(MOCK_LOGS)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Log Monitoring</h1>
        <p className="text-muted-foreground">
          Monitor system logs, authentication events, API requests, and security incidents across all services.
        </p>
      </div>
      <LogDataTable columns={logColumns} data={logs} />
    </div>
  )
}
