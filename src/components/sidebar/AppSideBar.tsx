import * as React from "react"
import { NavMain } from "@/components/sidebar/NavMain"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { TenantSwitcher } from "@/components/navigation/TenantSwitcher"
import { data } from "./constants"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="[&_[data-sidebar=sidebar]]:bg-white [&_[data-sidebar=sidebar]]:overflow-y-auto"
    >
      {/* Coolify-style brand block: logo at the top of the side nav, with the
          tenant switcher directly beneath it. */}
      <SidebarHeader className="gap-4 bg-white px-3 pt-4 pb-2">
        <div className="flex items-center gap-2.5 px-2">
          <img src="/logo.png" alt="Maintainerd" className="h-8 w-auto shrink-0" />
          <span className="group-data-[collapsible=icon]:hidden">
            <div className="text-base font-bold tracking-tight text-slate-900 leading-none" style={{ fontFamily: 'system-ui, sans-serif' }}>
              Maintainerd
            </div>
            <div className="text-[10.5px] font-medium text-muted-foreground tracking-wide mt-1 leading-none" style={{ fontFamily: 'system-ui, sans-serif' }}>
              Identity and Access Management
            </div>
          </span>
        </div>
        <div className="group-data-[collapsible=icon]:hidden">
          <p className="mb-1.5 px-2 text-xs font-medium text-muted-foreground">
            Current Tenant
          </p>
          <TenantSwitcher />
        </div>
      </SidebarHeader>

      {/* The whole sidebar (header + nav) scrolls as one: the panel owns the
          scroll (overflow-y-auto above), so the content is not its own scroll
          region (flex-none + overflow-visible). */}
      <SidebarContent className="flex-none overflow-visible px-3 pb-4 pt-2 gap-1 bg-white">
        <NavMain sections={data.navSections} />
      </SidebarContent>
    </Sidebar>
  )
}
