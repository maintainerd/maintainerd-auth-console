import {
	Settings,
	Shield,
	Users,
	Webhook,
	LayoutDashboard,
	Palette,
	Server,
	KeyRound,
	Layers,
	TrendingUp,
	Mail,
	Building2,
	type LucideIcon,
} from "lucide-react"
import type { ComponentType } from "react"

// Sidenav icons: lucide, wrapped so the active item renders a bolder stroke and
// inactive items a thinner one (mirroring the active/inactive weight used for the
// nav text). Icons inherit the nav item's text color.
const li =
	(IconCmp: LucideIcon): ComponentType<{ className?: string; active?: boolean }> =>
	({ className, active }) =>
		<IconCmp className={className} strokeWidth={active ? 2.25 : 1.5} />

export const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navSections: [
    {
      label: "Overview",
      items: [
        {
          title: "Dashboard",
          route: "/dashboard",
          icon: li(LayoutDashboard),
        },
      ],
    },
    {
      label: "Identity & Access",
      items: [
        {
          title: "User Management",
          route: "/user-management",
          icon: li(Users),
          items: [
            { title: "Users", route: "/users" },
            { title: "Roles", route: "/roles" },
            { title: "Invitations", route: "/invites" },
          ],
        },
        {
          title: "Authentication",
          route: "/authentication",
          icon: li(KeyRound),
          items: [
            { title: "Identity Providers", route: "/providers/identity" },
            { title: "Registration", route: "/registration-flows" },
          ],
        },
      ],
    },
    {
      label: "Applications & APIs",
      items: [
        {
          title: "Applications",
          route: "/applications",
          icon: li(Layers),
          items: [
            { title: "Clients", route: "/clients" },
            { title: "Workload Identity", route: "/workload-identity" },
          ],
        },
        {
          title: "APIs & Resources",
          route: "/apis-resources",
          icon: li(Server),
          items: [
            { title: "Services", route: "/services" },
            { title: "APIs", route: "/apis" },
            { title: "Policies", route: "/policies" },
          ],
        },
      ],
    },
    {
      label: "Security",
      items: [
        {
          title: "Security",
          route: "/security",
          icon: li(Shield),
        },
      ],
    },
    {
      label: "Branding & Messaging",
      items: [
        {
          title: "Branding",
          route: "/branding",
          icon: li(Palette),
        },
        {
          title: "Messaging",
          route: "/messaging",
          icon: li(Mail),
        },
      ],
    },
    {
      label: "Operations",
      items: [
        {
          title: "Events & Webhooks",
          route: "/events",
          icon: li(Webhook),
        },
        {
          title: "Monitoring",
          route: "/monitoring",
          icon: li(TrendingUp),
        },
      ],
    },
    {
      label: "Administration",
      items: [
        {
          title: "Tenants",
          route: "/tenants",
          icon: li(Building2),
        },
        {
          title: "Settings",
          route: "/settings",
          icon: li(Settings),
        },
      ],
    },
  ],
}
