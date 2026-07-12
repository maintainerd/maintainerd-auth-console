import { useMemo } from "react"
import { Link, useLocation } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import type { ComponentType } from "react"
import { data } from "@/components/sidebar/constants"
import type { NavSection } from "@/components/sidebar/NavMain"

type Crumb = { label: string; href?: string }
type Trail = { crumbs: Crumb[]; icon?: ComponentType<{ className?: string; active?: boolean }> }

const norm = (route: string) => (route.startsWith("/") ? route : `/${route}`)

const humanize = (segment: string) =>
  segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

// A segment we should not show as a crumb (numeric id or long hex/uuid).
const isIdSegment = (segment: string) =>
  /^\d+$/.test(segment) || /^[0-9a-fA-F-]{16,}$/.test(segment)

// Route → breadcrumb trail + the owning top-level item's icon, derived once from
// the sidebar nav so labels and the leading icon stay in sync with the menu.
// Grouped items contribute their (non-linked) parent title plus the leaf; the
// icon is always the top-level item's icon (sub-items have none).
const ROUTE_INDEX: Map<string, Trail> = (() => {
  const index = new Map<string, Trail>()
  for (const section of data.navSections as NavSection[]) {
    for (const item of section.items) {
      const icon = item.icon
      if (item.items?.length) {
        for (const sub of item.items) {
          index.set(norm(sub.route), {
            icon,
            crumbs: [{ label: item.title }, { label: sub.title, href: norm(sub.route) }],
          })
        }
      } else {
        index.set(norm(item.route), {
          icon,
          crumbs: [{ label: item.title, href: norm(item.route) }],
        })
      }
    }
  }
  return index
})()

function resolveBreadcrumb(pathname: string): Trail {
  const path = pathname.replace(/\/+$/, "") || "/"

  // Exact match first, then the longest matching route prefix (detail/edit pages).
  let base = ROUTE_INDEX.get(path)
  let matchedLen = base ? path.length : 0
  if (!base) {
    for (const [route, trail] of ROUTE_INDEX) {
      if ((path === route || path.startsWith(`${route}/`)) && route.length > matchedLen) {
        base = trail
        matchedLen = route.length
      }
    }
  }

  if (base) {
    const extra = path
      .slice(matchedLen)
      .split("/")
      .filter((s) => s && !isIdSegment(s))
      .map((s) => ({ label: humanize(s) }))
    return { icon: base.icon, crumbs: [...base.crumbs, ...extra] }
  }

  // Fallback: humanize the raw path segments (no matching nav icon).
  return {
    crumbs: path
      .split("/")
      .filter((s) => s && !isIdSegment(s))
      .map((s) => ({ label: humanize(s) })),
  }
}

export function Breadcrumbs() {
  const { pathname } = useLocation()
  const { crumbs, icon: Icon } = useMemo(() => resolveBreadcrumb(pathname), [pathname])

  if (crumbs.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2">
      {Icon && <Icon className="size-4 shrink-0 text-slate-500" />}
      <ol className="flex min-w-0 items-center gap-1.5 text-sm">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1
          return (
            <li key={`${crumb.label}-${i}`} className="flex min-w-0 items-center gap-1.5">
              {i > 0 && <ChevronRight className="size-4 shrink-0 text-slate-300" />}
              {isLast || !crumb.href ? (
                <span
                  className={
                    isLast
                      ? "truncate font-medium text-slate-900"
                      : "truncate text-slate-500"
                  }
                >
                  {crumb.label}
                </span>
              ) : (
                <Link to={crumb.href} className="truncate text-slate-500 hover:text-slate-900">
                  {crumb.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
