import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Edit, Trash2, MoreVertical, KeyRound, Building2, CalendarDays, Globe2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeleteConfirmationDialog } from "@/components/dialog"
import { DetailHeaderCard, StatusBadge, type DetailAttribute } from "@/components/details"
import { SystemBadge } from "@/components/badges"
import { useDeleteIdentityProvider } from "@/hooks/useIdentityProviders"
import { useToast } from "@/hooks/useToast"
import { format } from "date-fns"
import { getProviderDisplayName } from "../utils"
import type { IdentityProviderDetail } from "@/services/api/identity-providers/types"

interface IdentityProviderHeaderProps {
  provider: IdentityProviderDetail
  providerId: string
}

export function IdentityProviderHeader({ provider, providerId }: IdentityProviderHeaderProps) {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const deleteProviderMutation = useDeleteIdentityProvider()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteProviderMutation.mutateAsync(providerId)
      showSuccess("Identity provider deleted successfully")
      navigate(`/providers/identity`)
    } catch (error) {
      showError(error)
    }
  }

  const tenantName = provider.tenant?.name
  const tenantIdentifier = provider.tenant?.identifier

  const attributes: DetailAttribute[] = [
    {
      icon: KeyRound,
      label: "System Name",
      value: <span className="font-mono text-xs">{provider.name}</span>,
    },
    {
      icon: KeyRound,
      label: "Identifier",
      value: <span className="font-mono text-xs">{provider.identifier}</span>,
    },
    {
      icon: Building2,
      label: "Provider Type",
      value: getProviderDisplayName(provider.provider, provider.is_system),
    },
    {
      icon: Globe2,
      label: "Issuer",
      value: provider.issuer ? (
        <span className="break-all font-mono text-xs">{provider.issuer}</span>
      ) : (
        <span className="text-muted-foreground">Built-in</span>
      ),
    },
    {
      icon: Building2,
      label: "Tenant",
      value: tenantName ? (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium">{tenantName}</span>
          {tenantIdentifier && (
            <span className="font-mono text-xs text-muted-foreground">{tenantIdentifier}</span>
          )}
        </div>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
    },
    {
      icon: CalendarDays,
      label: "Created",
      value: format(new Date(provider.created_at), "PP"),
    },
    {
      icon: CalendarDays,
      label: "Last updated",
      value: format(new Date(provider.updated_at), "PP"),
    },
  ]

  return (
    <>
      <DetailHeaderCard
        leading={
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <KeyRound className="size-6" />
          </div>
        }
        title={provider.display_name}
        badge={
          <div className="flex items-center gap-2">
            <StatusBadge status={provider.status} />
            <SystemBadge isSystem={provider.is_system} />
          </div>
        }
        subtitle={
          <span className="font-mono text-xs text-muted-foreground">{provider.identifier}</span>
        }
        attributes={attributes}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2"
              onClick={() =>
                navigate(`/providers/identity/${providerId}/edit`, {
                  state: { from: `/providers/identity/${providerId}`, backLabel: "Back to Provider Details" },
                })
              }
            >
              <Edit className="size-4" />
              Edit
            </Button>
            {!provider.is_system && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                    <span className="sr-only">Open actions</span>
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 size-4" />
                    Delete Provider
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </>
        }
      />

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Identity Provider"
        description="This action cannot be undone. This will permanently delete the identity provider and all associated data."
        itemName={provider.name}
        isDeleting={deleteProviderMutation.isPending}
      />
    </>
  )
}
