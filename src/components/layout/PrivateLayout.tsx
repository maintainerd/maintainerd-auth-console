import { Outlet } from "react-router-dom"
import { AppSidebar } from "@/components/sidebar/AppSideBar"
import { TopNav } from "@/components/navigation/TopNav"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export function PrivateLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SidebarProvider>
        <TopNav />
        <div className="flex flex-1 pt-14">
          <AppSidebar variant="sidebar" className="top-14" />
          <SidebarInset>
            <main className="flex-1 pt-10 px-6 pb-6 max-w-6xl mx-auto">
              <Outlet />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
