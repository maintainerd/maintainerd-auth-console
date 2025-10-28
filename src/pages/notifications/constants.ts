import type { Notification } from "./types"

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "user",
    title: "New user registration",
    message: "John Doe has registered for an account and is pending approval.",
    status: "unread",
    priority: "medium",
    createdAt: "2024-10-28T14:22:00Z"
  },
  {
    id: "2",
    type: "api",
    title: "API rate limit warning",
    message: "Service 'user-api' is approaching rate limits (85% usage).",
    status: "unread",
    priority: "high",
    createdAt: "2024-10-28T14:07:00Z"
  },
  {
    id: "3",
    type: "system",
    title: "System update completed",
    message: "Authentication service has been successfully updated to v2.1.0.",
    status: "unread",
    priority: "low",
    createdAt: "2024-10-28T13:22:00Z"
  },
  {
    id: "4",
    type: "security",
    title: "Failed login attempts detected",
    message: "Multiple failed login attempts detected for user sarah@example.com.",
    status: "read",
    priority: "critical",
    createdAt: "2024-10-28T12:45:00Z"
  },
  {
    id: "5",
    type: "user",
    title: "User role updated",
    message: "Emily Chen has been assigned the 'Security Admin' role.",
    status: "read",
    priority: "medium",
    createdAt: "2024-10-28T11:30:00Z"
  },
  {
    id: "6",
    type: "service",
    title: "Service deployment successful",
    message: "Payment API v1.2.3 has been successfully deployed to production.",
    status: "read",
    priority: "low",
    createdAt: "2024-10-28T10:15:00Z"
  },
  {
    id: "7",
    type: "api",
    title: "API key expiring soon",
    message: "API key 'mobile-app-key' will expire in 7 days.",
    status: "read",
    priority: "medium",
    createdAt: "2024-10-28T09:00:00Z"
  },
  {
    id: "8",
    type: "security",
    title: "New device login",
    message: "User mike@example.com logged in from a new device.",
    status: "read",
    priority: "low",
    createdAt: "2024-10-27T16:20:00Z"
  }
]
