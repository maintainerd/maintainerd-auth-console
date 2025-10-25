import { Outlet } from "react-router-dom"
import { AppSidebar } from "@/components/sidebar/AppSideBar"
import { TopNav } from "@/components/navigation/TopNav"
import { SidebarProvider } from "@/components/ui/sidebar"

export function PrivateLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SidebarProvider>
        <TopNav />
        <div className="flex flex-1 pt-14">
          <AppSidebar variant="sidebar" className="top-14" />
          <main className="flex-1 flex flex-col border-border bg-background overflow-auto">
            <div className="flex-1 pt-10 px-6 pb-6">
              <div className="max-w-5xl mx-auto w-full">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}
