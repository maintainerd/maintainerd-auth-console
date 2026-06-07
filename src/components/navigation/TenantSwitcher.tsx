import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
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
import { CreateTenantDialog } from "@/components/dialog"
import { useTenant } from "@/hooks/useTenant"
import { useTenantsList } from "@/hooks/useTenants"
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
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)

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
      navigate(`/${tenant.identifier}/dashboard`)
    }
  }

  const handleCreate = () => {
    setOpen(false)
    setCreateOpen(true)
  }

  return (
    <div className={className}>
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
                <span className="max-w-[10rem] truncate text-sm font-medium">{label}</span>
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
          </Command>
        </PopoverContent>
      </Popover>

      <CreateTenantDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
