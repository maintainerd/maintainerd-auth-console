import * as React from "react"
import { NavMain } from "@/components/sidebar/NavMain"
import { NavSecondary } from "@/components/sidebar/NavSecondary"
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
      <SidebarContent className="py-6 px-3 bg-white">
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  )
}
