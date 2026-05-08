import type { ApiKeyStatus } from "@/services/api/api-keys/types"

export function getStatusColor(status: ApiKeyStatus): string {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
    case "inactive":
      return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
    case "expired":
      return "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
  }
}

export function getStatusText(status: ApiKeyStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

