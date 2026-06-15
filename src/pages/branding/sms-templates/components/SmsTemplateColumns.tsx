import type { ColumnDef } from "@tanstack/react-table"
import { MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/data-table"
import { StatusBadge } from "@/components/details/StatusBadge"
import { SmsTemplateActions } from "./SmsTemplateActions"
import type { SmsTemplate } from "@/services/api/sms-templates/types"

export const smsTemplateColumns: ColumnDef<SmsTemplate>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      const template = row.original
      return (
        <div className="flex items-center gap-3 px-3 py-1 max-w-md">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <MessageSquare className="size-5" />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="font-medium truncate">{template.name}</span>
            {template.description && (
              <span className="text-xs text-muted-foreground truncate">{template.description}</span>
            )}
          </div>
        </div>
      )
    },
  },
  {
    id: "sender_id",
    accessorKey: "senderId",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Sender ID" />,
    cell: ({ row }) => (
      <div className="px-3 py-1">
        <span className="font-mono text-sm">{row.original.senderId || "—"}</span>
      </div>
    ),
  },
  {
    id: "type",
    accessorKey: "isSystem",
    enableSorting: false,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => {
      const template = row.original
      const badges: React.ReactNode[] = []
      if (template.isSystem) badges.push(<Badge key="sys" variant="secondary" className="text-xs font-normal">System</Badge>)
      if (template.isDefault) badges.push(<Badge key="def" variant="outline" className="text-xs font-normal">Default</Badge>)
      if (badges.length === 0) badges.push(<Badge key="cus" variant="outline" className="text-xs font-normal">Custom</Badge>)
      return <div className="flex gap-1 px-3 py-1">{badges}</div>
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <div className="px-3 py-1">
        <StatusBadge status={row.original.status} />
      </div>
    ),
  },
  {
    id: "created_at",
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => {
      const template = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <span className="text-sm font-medium">
            {formatDistanceToNow(new Date(template.createdAt), { addSuffix: true })}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(template.createdAt).toLocaleDateString()}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="px-3 py-1">
        <SmsTemplateActions template={row.original} />
      </div>
    ),
  },
]
