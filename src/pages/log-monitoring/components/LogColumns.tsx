import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, AlertTriangle, CheckCircle, Clock, Bug, Info, Zap } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { LogActions } from "./LogActions"
import type { LogEntry, LogLevel, LogStatus } from "../constants"

// Helper function to get badge config for log level
const getLevelBadgeConfig = (level: LogLevel) => {
  switch (level) {
    case "error":
      return {
        icon: AlertTriangle,
        className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
      }
    case "warn":
      return {
        icon: AlertTriangle,
        className: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200"
      }
    case "info":
      return {
        icon: Info,
        className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200"
      }
    case "debug":
      return {
        icon: Bug,
        className: "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200"
      }
    case "trace":
      return {
        icon: Zap,
        className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
      }
    default:
      return {
        icon: Info,
        className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
      }
  }
}

// Helper function to get badge config for status
const getStatusBadgeConfig = (status: LogStatus) => {
  switch (status) {
    case "success":
      return {
        icon: CheckCircle,
        className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
      }
    case "failure":
      return {
        icon: AlertTriangle,
        className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
      }
    case "pending":
      return {
        icon: Clock,
        className: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200"
      }
    case "timeout":
      return {
        icon: Clock,
        className: "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200"
      }
    default:
      return {
        icon: Clock,
        className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
      }
  }
}



export const logColumns: ColumnDef<LogEntry>[] = [
  {
    accessorKey: "timestamp",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Timestamp
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const timestamp = row.getValue("timestamp") as string
      const date = new Date(timestamp)
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <span className="text-sm font-medium">
            {date.toLocaleTimeString()}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(date, { addSuffix: true })}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "level",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Level
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const level = row.getValue("level") as LogLevel
      const config = getLevelBadgeConfig(level)
      const Icon = config.icon

      return (
        <div className="px-3 py-1">
          <Badge variant="outline" className={`${config.className} capitalize`}>
            <Icon className="w-3 h-3 mr-1" />
            {level}
          </Badge>
        </div>
      )
    },
  },

  {
    accessorKey: "message",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Message
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const log = row.original
      const message = row.getValue("message") as string

      return (
        <div className="flex flex-col gap-1 px-3 py-1 max-w-md">
          <div className="text-sm font-medium truncate">
            {message}
          </div>
          <div className="text-xs text-muted-foreground">
            {log.userEmail && (
              <span className="mr-2">User: {log.userEmail}</span>
            )}
            {log.endpoint && (
              <span className="font-mono">{log.method} {log.endpoint}</span>
            )}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "service",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Service
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const service = row.getValue("service") as string
      return (
        <div className="px-3 py-1">
          <span className="text-sm font-medium">
            {service}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "ipAddress",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          IP Address
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const ipAddress = row.getValue("ipAddress") as string
      return (
        <div className="px-3 py-1">
          <span className="text-sm font-mono">
            {ipAddress}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const log = row.original
      const status = row.getValue("status") as LogStatus
      const config = getStatusBadgeConfig(status)
      const Icon = config.icon

      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <Badge variant="outline" className={`${config.className} capitalize w-fit`}>
            <Icon className="w-3 h-3 mr-1" />
            {status}
          </Badge>
          <div className="text-xs text-muted-foreground">
            {log.statusCode && (
              <span className="mr-2">HTTP {log.statusCode}</span>
            )}
            {log.responseTime && (
              <span>{log.responseTime}ms</span>
            )}
          </div>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const log = row.original
      return <LogActions log={log} />
    },
  },
]
