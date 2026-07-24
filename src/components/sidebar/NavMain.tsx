import { ChevronRight } from "lucide-react"
import { type ComponentType, useEffect, useMemo, useState } from "react"
import { Link, useLocation } from "react-router-dom"

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
  icon?: ComponentType<{ className?: string; active?: boolean }>
  items?: NavSubItem[]
}

export type NavSection = {
  label?: string
  items: NavItem[]
}

export function NavMain({ sections }: { sections: NavSection[] }) {
  const location = useLocation()

  // Routes are flat (the tenant lives in the host subdomain), so this just
  // normalizes to a leading-slash absolute path while preserving query tabs.
  const buildRoute = (route: string) => (route.startsWith('/') ? route : `/${route}`)

  // Active on the exact route or any of its sub-paths (e.g. /users is active on
  // /users/:id). Query-string tab links require an exact pathname+search match.
  const isActive = (route: string) => {
    const r = buildRoute(route)
    const [pathname, search] = r.split('?')

    if (search !== undefined) {
      return location.pathname === pathname && location.search === `?${search}`
    }

    return location.pathname === pathname || location.pathname.startsWith(`${pathname}/`)
  }

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
  }, [sections, location.pathname])

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
        <SidebarGroup key={section.label ?? index} className="px-0 py-1">
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
                        className={`h-8 px-2 text-sm [&>svg]:size-[18px] hover:bg-slate-100 ${isParentActive(item) ? "font-medium text-slate-900 hover:bg-slate-100 hover:text-slate-900" : ""}`}
                      >
                        {item.icon && <item.icon active={isParentActive(item)} />}
                        <span>{item.title}</span>
                        <ChevronRight
                          className={`ml-auto h-4 w-4 text-muted-foreground transition-transform ${
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
                                className={`h-8 px-2 text-sm hover:bg-slate-100 hover:text-slate-900 ${isActive(subItem.route) ? "bg-[#edf2f6] font-medium text-slate-900 hover:bg-[#edf2f6] hover:text-slate-900 data-[active=true]:bg-[#edf2f6]" : ""}`}
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
                      className={`h-8 px-2 text-sm [&>svg]:size-[18px] hover:bg-slate-100 ${isActive(item.route) ? "bg-[#edf2f6] font-medium text-slate-900 hover:bg-[#edf2f6] hover:text-slate-900" : ""}`}
                    >
                      <Link to={buildRoute(item.route)}>
                        {item.icon && <item.icon active={isActive(item.route)} />}
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
