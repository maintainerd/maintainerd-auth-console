import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MOCK_NOTIFICATIONS } from "./constants"
import type { Notification } from "./types"

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<Notification[]>(MOCK_NOTIFICATIONS)
  const [statusFilter, setStatusFilter] = React.useState<"all" | "unread" | "read">("all")

  // Simple filtering - only by status
  const filteredNotifications = React.useMemo(() => {
    if (statusFilter === "all") return notifications
    return notifications.filter(notification => notification.status === statusFilter)
  }, [notifications, statusFilter])

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, status: "read" as const }
          : notification
      )
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, status: "read" as const }))
    )
  }

  const unreadCount = notifications.filter(n => n.status === "unread").length

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "now"
    if (diffInMinutes < 60) return `${diffInMinutes}m`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d`

    return date.toLocaleDateString()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold tracking-tight">Notifications</h1>
            <div className="flex items-center gap-3">
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>

              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                >
                  Mark all read
                </Button>
              )}
            </div>
          </div>
          <p className="text-muted-foreground">
            {filteredNotifications.length} notifications
          </p>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No notifications found
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`group flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors ${
                  notification.status === "unread" ? "bg-blue-50/50 border-blue-200" : "bg-background"
                }`}
              >
                {/* Status indicator */}
                <div className="flex-shrink-0 mt-1">
                  {notification.status === "unread" ? (
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-muted" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className={`text-sm ${notification.status === "unread" ? "font-medium" : ""}`}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatTimeAgo(notification.createdAt)}</span>
                      {notification.status === "unread" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Mark read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
