import * as React from "react"
import { NavMain } from "@/components/sidebar/NavMain"
import { SidebarFooterNav } from "@/components/sidebar/SidebarFooterNav"
import {
  Sidebar,
  SidebarContent,
} from "@/components/ui/sidebar"
import { data } from "./constants"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="top-14 h-[calc(100vh-3.5rem)] [&_[data-sidebar=sidebar]]:bg-white"
    >
      <SidebarContent className="py-4 px-3 gap-1 bg-white">
        <NavMain sections={data.navSections} />
      </SidebarContent>
      <SidebarFooterNav />
    </Sidebar>
  )
}
