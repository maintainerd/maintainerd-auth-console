import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertTriangle, Wrench, Archive, FileEdit, Timer } from "lucide-react"
import type { StatusType } from "@/types/status"

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig: Record<StatusType, {
    label: string
    variant: "default" | "secondary" | "outline"
    icon: typeof CheckCircle
    className: string
  }> = {
    active: {
      label: "Active",
      variant: "default",
      icon: CheckCircle,
      className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
    },
    inactive: {
      label: "Inactive",
      variant: "secondary",
      icon: AlertTriangle,
      className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
    },
    pending: {
      label: "Pending",
      variant: "outline",
      icon: Clock,
      className: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200"
    },
    suspended: {
      label: "Suspended",
      variant: "default",
      icon: AlertTriangle,
      className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
    },
    maintenance: {
      label: "Maintenance",
      variant: "default",
      icon: Wrench,
      className: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200"
    },
    deprecated: {
      label: "Deprecated",
      variant: "default",
      icon: Archive,
      className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
    },
    draft: {
      label: "Draft",
      variant: "outline",
      icon: FileEdit,
      className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
    },
    configuring: {
      label: "Configuring",
      variant: "default",
      icon: Wrench,
      className: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200"
    },
    expired: {
      label: "Expired",
      variant: "default",
      icon: Timer,
      className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
    }
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={`${config.className} ${className || ""}`}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  )
}

