import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LoginTemplateActions } from './LoginTemplateActions'
import { formatDistanceToNow } from 'date-fns'
import type { LoginTemplate } from '@/services/api/login-template/types'

const getStatusBadge = (status: 'active' | 'inactive') => {
  const statusConfig = {
    active: {
      icon: CheckCircle,
      className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
    },
    inactive: {
      icon: XCircle,
      className: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant="outline" className={config.className}>
      <Icon className="w-3 h-3 mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

const getTemplateBadge = (template: string) => {
  const templateConfig: Record<string, { className: string }> = {
    classic: {
      className: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    modern: {
      className: 'bg-purple-100 text-purple-800 border-purple-200',
    },
    minimal: {
      className: 'bg-gray-100 text-gray-800 border-gray-200',
    },
  }

  const config = templateConfig[template] || templateConfig.classic

  return (
    <Badge variant="outline" className={config.className}>
      {template.charAt(0).toUpperCase() + template.slice(1)}
    </Badge>
  )
}

export const loginTemplateColumns: ColumnDef<LoginTemplate>[] = [
  {
    id: 'Name',
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const template = row.original
      return (
        <div className="flex flex-col gap-1 px-3 py-1">
          <span className="font-medium">{template.name}</span>
          <span className="text-sm text-muted-foreground truncate max-w-md">
            {template.description}
          </span>
        </div>
      )
    },
  },
  {
    id: 'Template',
    accessorKey: 'template',
    header: 'Template',
    cell: ({ row }) => getTemplateBadge(row.original.template),
  },
  {
    id: 'Status',
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => getStatusBadge(row.original.status),
  },
  {
    id: 'Type',
    header: 'Type',
    cell: ({ row }) => {
      const template = row.original
      const badges = []

      if (template.isSystem) {
        badges.push(
          <Badge
            key="system"
            variant="outline"
            className="bg-purple-100 text-purple-800 border-purple-200"
          >
            System
          </Badge>
        )
      }

      if (template.isDefault) {
        badges.push(
          <Badge
            key="default"
            variant="outline"
            className="bg-blue-100 text-blue-800 border-blue-200"
          >
            Default
          </Badge>
        )
      }

      if (!template.isSystem && !template.isDefault) {
        badges.push(
          <Badge
            key="custom"
            variant="outline"
            className="bg-gray-100 text-gray-800 border-gray-200"
          >
            Custom
          </Badge>
        )
      }

      return <div className="flex gap-1">{badges}</div>
    },
  },
  {
    id: 'Created',
    accessorKey: 'created_at',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt)
      return <div className="text-sm">{formatDistanceToNow(date, { addSuffix: true })}</div>
    },
  },
  {
    id: 'Updated',
    accessorKey: 'updated_at',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Updated
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.original.updatedAt)
      return <div className="text-sm">{formatDistanceToNow(date, { addSuffix: true })}</div>
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <LoginTemplateActions template={row.original} />,
  },
]
