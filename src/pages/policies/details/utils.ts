import type { PolicyStatusType } from "@/services/api/policy/types"

export function getStatusColor(status: PolicyStatusType): string {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 hover:bg-green-100"
    case "inactive":
      return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }
}

export function getStatusText(status: PolicyStatusType): string {
  switch (status) {
    case "active":
      return "Active"
    case "inactive":
      return "Inactive"
    default:
      return status
  }
}

