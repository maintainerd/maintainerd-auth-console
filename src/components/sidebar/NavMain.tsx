import { type LucideIcon, ChevronRight } from "lucide-react"
import { useState } from "react"
import { Link, useLocation, useParams } from "react-router-dom"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    route: string
    icon?: LucideIcon,
		active?: boolean,
		comingSoon?: boolean,
		items?: {
			title: string
			route: string
		}[]
  }[]
}) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())
  const location = useLocation()
  const { tenantId } = useParams<{ tenantId: string }>()

  const toggleItem = (title: string) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(title)) {
      newOpenItems.delete(title)
    } else {
      newOpenItems.add(title)
    }
    setOpenItems(newOpenItems)
  }

  // Helper function to build tenant-based routes
  const buildRoute = (route: string) => {
    if (!tenantId) return route
    // Remove leading slash if present and build tenant route
    const cleanRoute = route.startsWith('/') ? route.slice(1) : route
    return `/${tenantId}/${cleanRoute}`
  }

  const isActive = (route: string) => location.pathname === buildRoute(route)

  const isParentActive = (item: any) => {
    // Check if current route matches the parent route
    if (isActive(item.route)) return true

    // Check if any submenu item is active
    if (item.items) {
      return item.items.some((subItem: any) => isActive(subItem.route))
    }

    return false
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.items ? (
                <>
                  <SidebarMenuButton
                    onClick={() => toggleItem(item.title)}
                    tooltip={item.title}
                    className={`text-base ${isParentActive(item) ? "font-bold text-blue-600 hover:text-blue-600" : ""}`}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight
                      className={`ml-auto h-4 w-4 transition-transform ${
                        openItems.has(item.title) ? "rotate-90" : ""
                      }`}
                    />
                  </SidebarMenuButton>
                  {openItems.has(item.title) && (
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isActive(subItem.route)}
                            className={isActive(subItem.route) ? "text-blue-600 hover:text-blue-600" : ""}
                          >
                            <Link to={buildRoute(subItem.route)}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </>
              ) : (
                <SidebarMenuButton
                  asChild={!item.comingSoon}
                  tooltip={item.title}
                  className={`${isActive(item.route) ? "font-bold text-blue-600 hover:text-blue-600 text-base" : "text-base"} ${item.comingSoon ? "cursor-not-allowed opacity-60" : ""}`}
                >
                  {item.comingSoon ? (
                    <div className="flex items-center gap-2">
                      {item.icon && <item.icon className="size-4 shrink-0" />}
                      <span>{item.title}</span>
                      <span className="text-xs text-muted-foreground">(coming soon)</span>
                    </div>
                  ) : (
                    <Link to={buildRoute(item.route)}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  )}
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
