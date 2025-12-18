import type { RoleStatusType } from "@/services/api/role/types"

export function getStatusColor(status: RoleStatusType): string {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 border-green-200"
    case "inactive":
      return "bg-gray-100 text-gray-800 border-gray-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function getStatusText(status: RoleStatusType): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}
