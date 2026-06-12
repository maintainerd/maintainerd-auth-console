import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AppWindow, Globe, Pencil, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InformationCard } from "@/components/card"
import { EmptyState, ListSkeleton, StatusBadge } from "@/components/details"
import { DataTablePagination, usePaginationTable, RowActions, type RowActionItem } from "@/components/data-table"
import { useClients, useDeleteClient } from "@/hooks/useClients"
import { useToast } from "@/hooks/useToast"
import type { Client } from "@/services/api/clients/types"
import { type PaginationState } from "@tanstack/react-table"

const CLIENT_TYPE_LABELS: Record<string, string> = {
  traditional: "Traditional Web",
  mobile: "Native Mobile",
  spa: "Single Page App",
  m2m: "Machine to Machine",
}

interface IdentityProviderClientsProps {
  providerId: string
  providerName: string
}

export function IdentityProviderClients({ providerId, providerName }: IdentityProviderClientsProps) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const deleteClientMutation = useDeleteClient()

  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })

  const { data, isLoading, isError } = useClients({
    identity_provider_id: providerId,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sort_by: "created_at",
    sort_order: "desc",
  })

  const table = usePaginationTable({
    pagination,
    onPaginationChange: setPagination,
    pageCount: data?.total_pages ?? 0,
  })

  const providerDetailUrl = `/${tenantId}/providers/identity/${providerId}?tab=clients`

  const handleAddClient = () => {
    navigate(`/${tenantId}/clients/create`, {
      state: {
        identityProviderId: providerId,
        from: providerDetailUrl,
        backLabel: "Back to Provider Details",
      },
    })
  }

  const removeClient = async (client: Client) => {
    try {
      await deleteClientMutation.mutateAsync(client.client_id)
      showSuccess(`Deleted client ${client.display_name}`)
    } catch (error) {
      showError(error)
    }
  }

  return (
    <InformationCard
      title="Clients"
      description="OAuth clients that authenticate through this identity provider."
      icon={AppWindow}
      action={
        <Button onClick={handleAddClient} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      }
    >
      <div className="space-y-4">
        {isLoading && <ListSkeleton />}

        {isError && (
          <p className="py-8 text-center text-sm text-destructive">Failed to load clients</p>
        )}

        {data && data.rows.length === 0 && (
          <EmptyState
            icon={AppWindow}
            title="No clients"
            description={`No clients are configured for ${providerName} yet.`}
          />
        )}

        {data && data.rows.length > 0 && data.rows.map((client) => {
          const actions: RowActionItem[] = [
            {
              key: "edit",
              label: "Edit Client",
              icon: Pencil,
              onSelect: () => navigate(`/${tenantId}/clients/${client.client_id}/edit`),
            },
          ]

          if (!client.is_system) {
            actions.push({
              key: "delete",
              label: "Delete Client",
              icon: Trash2,
              destructive: true,
              onSelect: () => removeClient(client),
              confirm: {
                title: "Delete Client",
                description: "This action cannot be undone. This will permanently delete the client.",
                destructive: true,
                itemName: client.name,
                confirmText: "Delete",
              },
            })
          }

          return (
            <div
              key={client.client_id}
              role="button"
              tabIndex={0}
              onClick={(e) => {
                const target = e.target as HTMLElement
                if (!e.currentTarget.contains(target) || target.closest("button, a")) return
                navigate(`/${tenantId}/clients/${client.client_id}`)
              }}
              onKeyDown={(e) => {
                if (e.target !== e.currentTarget) return
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  navigate(`/${tenantId}/clients/${client.client_id}`)
                }
              }}
              className="flex cursor-pointer items-start justify-between gap-3 rounded-lg border p-4 transition-colors hover:bg-accent/50"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <AppWindow className="size-5" />
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold">{client.display_name}</span>
                    <StatusBadge status={client.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="font-mono">{client.name}</span>
                    <span>{CLIENT_TYPE_LABELS[client.client_type] ?? client.client_type}</span>
                    {client.domain && (
                      <span className="inline-flex items-center gap-1">
                        <Globe className="size-3" />
                        {client.domain}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <RowActions items={actions} />
            </div>
          )
        })}

        {data && data.total > 0 && (
          <div className="border-t pt-4">
            <DataTablePagination table={table} rowCount={data.total} />
          </div>
        )}
      </div>
    </InformationCard>
  )
}
