import type { ApiStatus } from "@/services/api/api/types"

export function getStatusColor(status: ApiStatus): string {
  return status === "active"
    ? "bg-green-100 text-green-800 border-green-200"
    : "bg-gray-100 text-gray-800 border-gray-200"
}

export function getStatusText(status: ApiStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

