import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, Shield } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { SmsTemplateActions } from "./SmsTemplateActions"
import type { SmsTemplate } from "../types"

const getTypeColor = (type: string) => {
  const colors = {
    welcome: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
    verification: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
    password_reset: "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200",
    invitation: "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200",
    notification: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
    marketing: "bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200",
    transactional: "bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200",
    custom: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
  }
  return colors[type as keyof typeof colors] || colors.custom
}

export const smsTemplateColumns: ColumnDef<SmsTemplate>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Template
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const template = row.original
      return (
        <div className="flex flex-col gap-2 px-3 py-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{template.name}</span>
            {template.isSystem && (
              <Badge variant="secondary" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                System
              </Badge>
            )}
            {template.isDefault && (
              <Badge variant="outline" className="text-xs">
                Default
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{template.description}</p>
        </div>
      )
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold"
      >
        Type
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const template = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <Badge className={getTypeColor(template.type)}>
            {template.type.replace('_', ' ')}
          </Badge>
          <span className="text-xs text-muted-foreground capitalize">
            {template.category.replace('_', ' ')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const template = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <span className="text-sm">
            {formatDistanceToNow(new Date(template.createdAt), { addSuffix: true })}
          </span>
          <span className="text-xs text-muted-foreground">
            by {template.createdBy}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const template = row.original
      return <SmsTemplateActions template={template} />
    },
  },
]
