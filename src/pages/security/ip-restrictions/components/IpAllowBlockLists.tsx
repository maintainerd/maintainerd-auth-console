/**
 * IP Allow/Block Lists Component
 */

import { useState } from 'react'
import { SettingsCard } from '@/components/card/SettingsCard'
import { Shield, Ban, CheckCircle, Trash2, Edit, Plus, Power, MoreHorizontal, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTablePagination } from '@/components/data-table'
import { DeleteConfirmationDialog, ConfirmationDialog } from '@/components/dialog'
import { IpRuleDialog } from './IpRuleDialog'
import {
  useIpRestrictionRules,
  useCreateIpRestrictionRule,
  useUpdateIpRestrictionRule,
  useDeleteIpRestrictionRule,
  useUpdateIpRestrictionRuleStatus,
} from '@/hooks/useIpRestrictionRules'
import type { IpRestrictionRule } from '@/services/api/ip-restriction-rules/types'
import {
  getCoreRowModel,
  useReactTable,
  type PaginationState,
} from '@tanstack/react-table'
import { useMemo } from 'react'

export function IpAllowBlockLists() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [selectedRule, setSelectedRule] = useState<IpRestrictionRule | undefined>()
  const [ruleToDelete, setRuleToDelete] = useState<IpRestrictionRule | undefined>()
  const [ruleToToggleStatus, setRuleToToggleStatus] = useState<IpRestrictionRule | undefined>()
  const [searchQuery, setSearchQuery] = useState('')
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data, isLoading } = useIpRestrictionRules({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sort_by: 'created_at',
    sort_order: 'desc',
  })

  const { mutateAsync: createRule, isPending: isCreating } = useCreateIpRestrictionRule()
  const { mutateAsync: updateRule, isPending: isUpdating } = useUpdateIpRestrictionRule()
  const { mutateAsync: deleteRule, isPending: isDeleting } = useDeleteIpRestrictionRule()
  const { mutateAsync: updateStatus, isPending: isUpdatingStatus } = useUpdateIpRestrictionRuleStatus()

  // Create table instance for pagination
  const columns = useMemo(() => [], [])
  const tableData = data?.rows || []

  const table = useReactTable({
    data: tableData,
    columns,
    pageCount: data?.totalPages || 0,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  })

  // Filter data based on search query (client-side filtering)
  const filteredData = useMemo(() => {
    if (!searchQuery || !data?.rows) return data?.rows || []
    return data.rows.filter((rule) =>
      rule.ipAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [data?.rows, searchQuery])

  const handleAdd = () => {
    setSelectedRule(undefined)
    setDialogOpen(true)
  }

  const handleEdit = (rule: IpRestrictionRule) => {
    setSelectedRule(rule)
    setDialogOpen(true)
  }

  const handleDelete = (rule: IpRestrictionRule) => {
    setRuleToDelete(rule)
    setDeleteDialogOpen(true)
  }

  const handleSubmit = async (formData: {
    description: string
    type: 'allow' | 'deny'
    ipAddress: string
    status: 'active' | 'inactive'
  }) => {
    const payload = {
      description: formData.description,
      type: formData.type,
      ip_address: formData.ipAddress,
      status: formData.status,
    }

    if (selectedRule) {
      await updateRule({ id: selectedRule.ipRestrictionRuleId, data: payload })
    } else {
      await createRule(payload)
    }
    setDialogOpen(false)
  }

  const handleConfirmDelete = async () => {
    if (!ruleToDelete) return

    await deleteRule(ruleToDelete.ipRestrictionRuleId)
    setDeleteDialogOpen(false)
    setRuleToDelete(undefined)
  }

  const handleToggleStatus = (rule: IpRestrictionRule) => {
    setRuleToToggleStatus(rule)
    setStatusDialogOpen(true)
  }

  const handleConfirmStatusChange = async () => {
    if (!ruleToToggleStatus) return

    const newStatus = ruleToToggleStatus.status === 'active' ? 'inactive' : 'active'
    await updateStatus({
      id: ruleToToggleStatus.ipRestrictionRuleId,
      data: { status: newStatus },
    })
    setStatusDialogOpen(false)
    setRuleToToggleStatus(undefined)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <>
      <SettingsCard
        icon={Shield}
        title="IP Allow/Block Lists"
        description="Manage whitelist and blacklist IP addresses and ranges"
      >
        <div className="space-y-4">
          {/* Search and Add button */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search IP rules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button type="button" onClick={handleAdd} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add IP Rule
            </Button>
          </div>

          {/* Horizontal divider */}
          <div className="border-t" />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>IP Address/Range</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredData && filteredData.length > 0 ? (
                  filteredData.map((rule) => (
                    <TableRow key={rule.ipRestrictionRuleId}>
                      <TableCell>
                        {rule.type === 'allow' ? (
                          <Badge variant="default" className="flex items-center gap-1 w-fit">
                            <CheckCircle className="h-3 w-3" />
                            Allow
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                            <Ban className="h-3 w-3" />
                            Deny
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{rule.ipAddress}</TableCell>
                      <TableCell className="text-muted-foreground">{rule.description}</TableCell>
                      <TableCell>
                        <Badge variant={rule.status === 'active' ? 'default' : 'secondary'}>
                          {rule.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{formatDate(rule.createdAt)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(rule)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Rule
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(rule)}
                              disabled={isUpdatingStatus}
                            >
                              <Power className="mr-2 h-4 w-4" />
                              {rule.status === 'active' ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() => handleDelete(rule)}
                              disabled={isDeleting}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Rule
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? 'No IP rules found matching your search' : 'No IP rules found. Click "Add IP Rule" to create one.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination controls */}
          {data && data.total > 0 && !searchQuery && (
            <div className="pt-4 border-t">
              <DataTablePagination table={table} rowCount={data.total} />
            </div>
          )}
        </div>
      </SettingsCard>

      <IpRuleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        rule={selectedRule}
        isLoading={isCreating || isUpdating}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete IP Rule"
        description={ruleToDelete ? `Are you sure you want to delete the IP rule for "${ruleToDelete.ipAddress}"?` : "Are you sure you want to delete this IP rule?"}
        confirmationText="This action cannot be undone. This will permanently delete the IP restriction rule."
        itemName={ruleToDelete?.ipAddress || ""}
        isDeleting={isDeleting}
      />

      <ConfirmationDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        onConfirm={handleConfirmStatusChange}
        title={ruleToToggleStatus?.status === 'active' ? 'Deactivate IP Rule' : 'Activate IP Rule'}
        description={ruleToToggleStatus?.status === 'active' 
          ? `Are you sure you want to deactivate the IP rule for "${ruleToToggleStatus?.ipAddress}"? This rule will no longer be enforced.`
          : `Are you sure you want to activate the IP rule for "${ruleToToggleStatus?.ipAddress}"? This rule will be enforced immediately.`
        }
        confirmText="Confirm"
        cancelText="Cancel"
        variant="default"
        isLoading={isUpdatingStatus}
      />
    </>
  )
}
