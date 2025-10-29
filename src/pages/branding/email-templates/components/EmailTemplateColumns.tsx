import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EmailTemplateActions } from "./EmailTemplateActions"
import { formatDistanceToNow } from "date-fns"
import type { EmailTemplate } from "../types"


const getTypeColor = (type: string) => {
  switch (type) {
    case "welcome":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "verification":
      return "bg-green-100 text-green-800 border-green-200"
    case "password_reset":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "invitation":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "notification":
      return "bg-cyan-100 text-cyan-800 border-cyan-200"
    case "marketing":
      return "bg-pink-100 text-pink-800 border-pink-200"
    case "transactional":
      return "bg-indigo-100 text-indigo-800 border-indigo-200"
    case "custom":
      return "bg-gray-100 text-gray-800 border-gray-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export const emailTemplateColumns: ColumnDef<EmailTemplate>[] = [
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
        <div className="flex flex-col gap-1 px-3 py-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{template.name}</span>
            {template.isSystem && (
              <Badge variant="secondary" className="text-xs">
                System
              </Badge>
            )}
            {template.isDefault && (
              <Badge variant="outline" className="text-xs">
                Default
              </Badge>
            )}
          </div>
          <span className="text-sm text-muted-foreground">{template.description}</span>
          <span className="text-xs text-muted-foreground">{template.content.subject}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "type",
    header: "Type",
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
    cell: ({ row }) => {
      const template = row.original
      return (
        <div className="px-3 py-1">
          <EmailTemplateActions template={template}>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </EmailTemplateActions>
        </div>
      )
    },
  },
]
