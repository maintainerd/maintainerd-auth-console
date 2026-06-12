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
  // Sidebar navigation grouped into labeled sections (enterprise IA).
  navSections: [
    {
      label: "Overview",
      items: [
        {
          title: "Get Started",
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
            { title: "Auth Flows", route: "/auth-flows" },
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
            { title: "API Keys", route: "/api-keys" },
          ],
        },
        {
          title: "APIs & Resources",
          route: "/apis-resources",
          icon: Server,
          items: [
            { title: "Services", route: "/services" },
            { title: "APIs", route: "/apis" },
            { title: "Permissions", route: "/permissions" },
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
            { title: "Multi-Factor (MFA)", route: "/security/settings" },
            { title: "Password Policy", route: "/security/password-policies" },
            { title: "Sessions", route: "/security/sessions" },
            { title: "Threat Detection", route: "/security/threats" },
            { title: "Account Lockout", route: "/security/lockout" },
            { title: "Registration", route: "/security/registration" },
            { title: "Tokens", route: "/security/tokens" },
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
            { title: "Branding Templates", route: "/branding/templates" },
            { title: "Login Page", route: "/branding/login" },
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
            { title: "Analytics", route: "/analytics" },
            { title: "Audit Logs", route: "/logs" },
          ],
        },
      ],
    },
    {
      label: "Administration",
      items: [
        {
          title: "Organization",
          route: "/organization",
          icon: Building2,
          items: [
            { title: "Tenants", route: "/tenants" },
            { title: "Tenant Members", route: "/tenant/members" },
            { title: "Tenant Settings", route: "/tenant/settings" },
          ],
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
      title: "Give Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Give Feedback",
      url: "#",
      icon: MessageSquare,
    },
  ],
}
