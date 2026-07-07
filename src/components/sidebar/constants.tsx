import {
	Settings,
	Shield,
	Users,
	Webhook,
	MessageSquare,
	LifeBuoy,
	LayoutDashboard,
	Palette,
	Server,
	KeyRound,
	Layers,
	TrendingUp,
	Mail,
	Building2,
} from "lucide-react"

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
          icon: LayoutDashboard,
        },
      ],
    },
    {
      label: "Identity & Access",
      items: [
        {
          title: "User Management",
          route: "/user-management",
          icon: Users,
          items: [
            { title: "Users", route: "/users" },
            { title: "Roles", route: "/roles" },
            { title: "Invitations", route: "/invites" },
          ],
        },
        {
          title: "Authentication",
          route: "/authentication",
          icon: KeyRound,
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
          icon: Layers,
          items: [
            { title: "Clients", route: "/clients" },
            { title: "Workload Identity", route: "/workload-identity" },
          ],
        },
        {
          title: "APIs & Resources",
          route: "/apis-resources",
          icon: Server,
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
          icon: Shield,
          items: [
            { title: "Password Policy", route: "/security/password" },
            { title: "Multi-Factor Auth", route: "/security/mfa" },
            { title: "Account Lockout", route: "/security/lockout" },
            { title: "Sessions", route: "/security/session" },
            { title: "Tokens", route: "/security/token" },
            { title: "Registration", route: "/security/registration" },
            { title: "Threat Protection", route: "/security/threat" },
            { title: "IP Restrictions", route: "/security/ip-restrictions" },
          ],
        },
      ],
    },
    {
      label: "Branding & Messaging",
      items: [
        {
          title: "Branding",
          route: "/branding",
          icon: Palette,
          items: [
            { title: "Themes", route: "/branding/templates" },
            { title: "Email Templates", route: "/branding/email-templates" },
            { title: "SMS Templates", route: "/branding/sms-templates" },
          ],
        },
        {
          title: "Messaging",
          route: "/messaging",
          icon: Mail,
          items: [
            { title: "Email Delivery", route: "/messaging/email" },
            { title: "SMS Delivery", route: "/messaging/sms" },
          ],
        },
      ],
    },
    {
      label: "Operations",
      items: [
        {
          title: "Events & Webhooks",
          route: "/events",
          icon: Webhook,
          items: [
            { title: "Webhooks", route: "/webhooks" },
            { title: "Event Routes", route: "/events/routes" },
            { title: "Event Types", route: "/events/types" },
          ],
        },
        {
          title: "Monitoring",
          route: "/monitoring",
          icon: TrendingUp,
          items: [
            { title: "Sign-in Logs", route: "/logs" },
            { title: "Audit Log", route: "/audit-log" },
          ],
        },
      ],
    },
    {
      label: "Administration",
      items: [
        {
          title: "Tenants",
          route: "/tenants",
          icon: Building2,
        },
        {
          title: "Settings",
          route: "/settings",
          icon: Settings,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: MessageSquare,
    },
  ],
}
