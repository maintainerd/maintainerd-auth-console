import { useNavigate } from "react-router-dom"
import { Eye, Edit, Trash2, CheckCircle2 } from "lucide-react"
import { RowActions, type RowActionItem } from "@/components/data-table"
import { useActivateBranding, useDeleteBranding } from "@/hooks/useBranding"
import { useToast } from "@/hooks/useToast"
import type { Branding } from "@/services/api/branding/types"

interface BrandingActionsProps {
  branding: Branding
}

export function BrandingActions({ branding }: BrandingActionsProps) {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const activateMutation = useActivateBranding()
  const deleteMutation = useDeleteBranding()

  const base = `/branding/templates`

  const items: RowActionItem[] = [
    {
      key: "view",
      label: "View Details",
      icon: Eye,
      onSelect: () => navigate(`${base}/${branding.branding_id}`),
    },
    {
      key: "edit",
      label: "Edit Branding",
      icon: Edit,
      onSelect: () => navigate(`${base}/${branding.branding_id}/edit`),
    },
    ...(!branding.is_active
      ? [
          {
            key: "activate",
            label: "Set as Active",
            icon: CheckCircle2,
            onSelect: async () => {
              try {
                await activateMutation.mutateAsync(branding.branding_id)
                showSuccess(`"${branding.name}" is now the active branding`)
              } catch (error) {
                showError(error)
              }
            },
            confirm: {
              title: "Set as Active Branding",
              description: `Make "${branding.name}" the active branding? It becomes the loaded style and the current active template is deactivated.`,
              confirmText: "Set as Active",
            },
          } satisfies RowActionItem,
        ]
      : []),
    // System themes can be edited and activated but never deleted.
    ...(!branding.is_system
      ? [
          {
            key: "delete",
            label: "Delete Branding",
            icon: Trash2,
            destructive: true,
            separatorBefore: true,
            onSelect: async () => {
              try {
                await deleteMutation.mutateAsync(branding.branding_id)
                showSuccess("Branding deleted successfully")
              } catch (error) {
                showError(error)
              }
            },
            confirm: {
              title: "Delete Branding",
              description:
                "This action cannot be undone. This will permanently delete the branding template.",
              destructive: true,
              itemName: branding.name,
            },
          } satisfies RowActionItem,
        ]
      : []),
  ]

  return <RowActions items={items} />
}
