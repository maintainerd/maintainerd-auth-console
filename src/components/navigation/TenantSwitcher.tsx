import { useState } from "react"
import { useParams } from "react-router-dom"
import { Check, ChevronsUpDown, Plus, Shield } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { CreateTenantDialog, ConfirmationDialog } from "@/components/dialog"
import { useTenant } from "@/hooks/useTenant"
import { useAuth } from "@/hooks/useAuth"
import { useTenantsList } from "@/hooks/useTenants"
import { useToast } from "@/hooks/useToast"
import type { TenantEntity } from "@/services/api/tenants/types"

/** Small square initial tile, used as a lightweight tenant avatar. */
function TenantTile({ name, className }: { name?: string; className?: string }) {
  const initial = (name?.trim()?.[0] ?? "?").toUpperCase()
  return (
    <span
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold",
        className,
      )}
    >
      {initial}
    </span>
  )
}

export function TenantSwitcher({ className }: { className?: string }) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const { logout } = useAuth()
  const { showSuccess, showError } = useToast()
  const [open, setOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [switchTarget, setSwitchTarget] = useState<TenantEntity | null>(null)

  // Current tenant comes from the store (resolved from the URL on app init), so
  // the label is always correct — even if the active tenant is beyond the list cap.
  const { currentTenant, isLoading: tenantLoading } = useTenant()
  const { data: tenantsData, isLoading: tenantsLoading } = useTenantsList({ limit: 100 })
  const tenants = (tenantsData?.data?.rows as TenantEntity[]) || []

  // Never fall back to "the first tenant" — that would show the wrong tenant.
  const active =
    currentTenant ?? tenants.find((t) => t.identifier === tenantId) ?? null
  const label = active?.name ?? tenantId ?? "Select tenant"
  const showSkeleton = !active && (tenantLoading || tenantsLoading)

  const handleSelect = (tenant: TenantEntity) => {
    setOpen(false)
    if (tenant.identifier !== tenantId) {
      setSwitchTarget(tenant)
    }
  }

  const handleConfirmSwitch = async () => {
    if (!switchTarget) return
    try {
      await logout()
      showSuccess("Logged out successfully")
    } catch {
      showError("Logout failed")
    }
    // Full page reload to clear all client-side state (cookies, Redux, React Query).
    // A React Router navigate would keep stale session cookies in memory.
    window.location.href = `/${switchTarget.identifier}/login`
  }

  const handleCreate = () => {
    setOpen(false)
    setCreateOpen(true)
  }

  return (
    <div className={cn("min-w-0", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            aria-label="Switch tenant"
            className="h-9 gap-2 px-2 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            {showSkeleton ? (
              <>
                <Skeleton className="size-6 rounded-md bg-primary-foreground/20" />
                <Skeleton className="h-4 w-24 bg-primary-foreground/20" />
              </>
            ) : (
              <>
                <TenantTile
                  name={label}
                  className="bg-primary-foreground/15 text-primary-foreground"
                />
                <span className="max-w-[7rem] truncate text-sm font-medium sm:max-w-[10rem]">{label}</span>
              </>
            )}
            <ChevronsUpDown className="size-4 shrink-0 opacity-60" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-72 p-0" align="start">
          <Command>
            <CommandInput placeholder="Search tenants..." />
            <CommandList>
              {tenantsLoading ? (
                <div className="space-y-2 p-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2 px-1 py-1">
                      <Skeleton className="size-6 rounded-md" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <CommandEmpty>No tenants found.</CommandEmpty>
                  <CommandGroup heading="Switch tenant">
                    {tenants.map((tenant) => {
                      const isActive = tenant.identifier === active?.identifier
                      return (
                        <CommandItem
                          key={tenant.tenant_id}
                          value={`${tenant.name} ${tenant.identifier}`}
                          onSelect={() => handleSelect(tenant)}
                          className="cursor-pointer gap-2"
                        >
                          <TenantTile name={tenant.name} className="bg-muted text-foreground" />
                          <div className="flex min-w-0 flex-col">
                            <div className="flex items-center gap-1.5">
                              <span className="truncate font-medium">{tenant.name}</span>
                              {tenant.is_system && (
                                <Badge variant="secondary" className="h-4 gap-0.5 px-1 text-[10px]">
                                  <Shield className="size-2.5" />
                                  System
                                </Badge>
                              )}
                            </div>
                            {tenant.description && (
                              <span className="truncate text-xs text-muted-foreground">
                                {tenant.description}
                              </span>
                            )}
                          </div>
                          <Check
                            className={cn(
                              "ml-auto size-4 text-blue-600",
                              isActive ? "opacity-100" : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                </>
              )}
            </CommandList>

            {active?.is_system && (
            <div className="border-t p-1">
              <button
                type="button"
                onClick={handleCreate}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-accent"
              >
                <Plus className="size-4" />
                Create New Tenant
              </button>
            </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>

      <CreateTenantDialog open={createOpen} onOpenChange={setCreateOpen} />

      <ConfirmationDialog
        open={switchTarget !== null}
        onOpenChange={(open) => { if (!open) setSwitchTarget(null) }}
        onConfirm={handleConfirmSwitch}
        title="Switch tenant"
        description={
          switchTarget
            ? `You will be logged out and redirected to the login page for "${switchTarget.name}".`
            : "You will be logged out and redirected to the tenant login page."
        }
        confirmText="Switch & Logout"
        variant="destructive"
        showWarning
        warningMessage="Switching tenants will log you out of your current session."
      />
    </div>
  )
}
