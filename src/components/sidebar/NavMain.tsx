import { type LucideIcon, ChevronRight } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Link, useLocation, useParams } from "react-router-dom"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"

export type NavSubItem = {
  title: string
  route: string
}

export type NavItem = {
  title: string
  route: string
  icon?: LucideIcon
  items?: NavSubItem[]
}

export type NavSection = {
  label?: string
  items: NavItem[]
}

export function NavMain({ sections }: { sections: NavSection[] }) {
  const location = useLocation()
  const { tenantId } = useParams<{ tenantId: string }>()

  // Helper function to build tenant-based routes
  const buildRoute = (route: string) => {
    if (!tenantId) return route
    // Remove leading slash if present and build tenant route
    const cleanRoute = route.startsWith('/') ? route.slice(1) : route
    return `/${tenantId}/${cleanRoute}`
  }

  const isActive = (route: string) => location.pathname === buildRoute(route)

  const isParentActive = (item: NavItem) => {
    // Check if current route matches the parent route
    if (isActive(item.route)) return true
    // Check if any submenu item is active
    if (item.items) {
      return item.items.some((subItem) => isActive(subItem.route))
    }
    return false
  }

  // Titles of collapsible groups containing the active route — kept open
  // automatically as the user navigates.
  const activeGroups = useMemo(() => {
    const set = new Set<string>()
    for (const section of sections) {
      for (const item of section.items) {
        if (item.items && isParentActive(item)) set.add(item.title)
      }
    }
    return set
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections, location.pathname, tenantId])

  const [openItems, setOpenItems] = useState<Set<string>>(() => new Set(activeGroups))

  useEffect(() => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      activeGroups.forEach((title) => next.add(title))
      return next
    })
  }, [activeGroups])

  const toggleItem = (title: string) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(title)) {
      newOpenItems.delete(title)
    } else {
      newOpenItems.add(title)
    }
    setOpenItems(newOpenItems)
  }

  return (
    <>
      {sections.map((section, index) => (
        <SidebarGroup key={section.label ?? index} className="py-1">
          {section.label && (
            <SidebarGroupLabel className="h-7 text-xs">{section.label}</SidebarGroupLabel>
          )}
          <SidebarGroupContent className="flex flex-col gap-1">
            <SidebarMenu className="gap-0.5">
              {section.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <>
                      <SidebarMenuButton
                        onClick={() => toggleItem(item.title)}
                        tooltip={item.title}
                        className={`h-8 px-3 text-sm [&>svg]:size-4 ${isParentActive(item) ? "font-bold text-blue-600 hover:text-blue-600" : ""}`}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight
                          className={`ml-auto h-5 w-5 transition-transform ${
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
                                className={`h-8 px-3 text-sm ${isActive(subItem.route) ? "bg-blue-50 text-blue-600 font-medium hover:bg-blue-50 hover:text-blue-600 data-[active=true]:bg-blue-50" : ""}`}
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
                      asChild
                      tooltip={item.title}
                      className={`h-8 px-3 text-sm [&>svg]:size-4 ${isActive(item.route) ? "bg-blue-50 font-bold text-blue-600 hover:bg-blue-50 hover:text-blue-600" : ""}`}
                    >
                      <Link to={buildRoute(item.route)}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  )
}
