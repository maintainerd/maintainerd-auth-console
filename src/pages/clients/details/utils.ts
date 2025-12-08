import type { ClientStatusType } from "@/services/api/auth-client/types"

export function getStatusColor(status: ClientStatusType): string {
  const colors = {
    active: "bg-green-100 text-green-800 border-green-200",
    inactive: "bg-gray-100 text-gray-800 border-gray-200",
  }
  return colors[status] || colors.inactive
}

export function getStatusText(status: ClientStatusType): string {
  const texts = {
    active: "Active",
    inactive: "Inactive",
  }
  return texts[status] || "Unknown"
}

