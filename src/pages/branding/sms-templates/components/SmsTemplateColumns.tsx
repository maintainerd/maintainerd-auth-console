import type { ColumnDef } from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns'
import { StatusBadge } from '@/components/badges'
import { Badge } from '@/components/ui/badge'
import { SmsTemplateActions } from './SmsTemplateActions'
import type { SmsTemplate } from '@/services/api/sms-template/types'

export const smsTemplateColumns: ColumnDef<SmsTemplate>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <span className="font-medium">{row.original.name}</span>
        <span className="text-sm text-muted-foreground">{row.original.description}</span>
      </div>
    ),
  },
  {
    accessorKey: 'senderId',
    header: 'Sender ID',
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.original.senderId}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => (
      <div className="flex gap-1">
        {row.original.isSystem && (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
            System
          </Badge>
        )}
        {row.original.isDefault && (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            Default
          </Badge>
        )}
        {!row.original.isSystem && !row.original.isDefault && (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
            Custom
          </Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatDistanceToNow(new Date(row.original.createdAt), { addSuffix: true })}
      </span>
    ),
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatDistanceToNow(new Date(row.original.updatedAt), { addSuffix: true })}
      </span>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <SmsTemplateActions template={row.original} />,
  },
]
