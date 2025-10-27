export type OnboardingStatus = "active" | "inactive" | "draft"
export type OnboardingType = "signup" | "invited_signup"
export type OnboardingTemplate = "basic" | "multi_step" | "social_first" | "minimal" | "corporate" | "custom"

export type OnboardingFlow = {
  id: string
  name: string
  description: string
  type: OnboardingType
  status: OnboardingStatus
  template: OnboardingTemplate
  url: string
  assignedRoles: string[]
  roleCount: number
  pages: OnboardingPage[]
  pageCount: number
  completions: number
  conversionRate: number
  createdAt: string
  createdBy: string
  updatedAt: string
  isDefault: boolean
}

export type OnboardingPage = {
  id: string
  title: string
  order: number
  fields: OnboardingField[]
  isRequired: boolean
}

export type OnboardingField = {
  id: string
  name: string
  type: "text" | "email" | "password" | "select" | "checkbox" | "textarea"
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
}

export const onboardingStatuses: OnboardingStatus[] = ["active", "inactive", "draft"]
export const onboardingTypes: OnboardingType[] = ["signup", "invited_signup"]
export const onboardingTemplates: OnboardingTemplate[] = [
  "basic",
  "multi_step", 
  "social_first",
  "minimal",
  "corporate",
  "custom"
]

export const templateDescriptions: Record<OnboardingTemplate, string> = {
  basic: "Simple single-page signup with essential fields",
  multi_step: "Multi-step wizard with progressive disclosure",
  social_first: "Social login prominent with email fallback",
  minimal: "Minimal fields for quick signup",
  corporate: "Professional layout with company branding",
  custom: "Custom template with advanced configuration"
}

// Mock data for development
export const mockOnboardingFlows: OnboardingFlow[] = [
  {
    id: "1",
    name: "Default Signup",
    description: "Standard user registration flow with email verification",
    type: "signup",
    status: "active",
    template: "basic",
    url: "https://auth.example.com/signup/default",
    assignedRoles: ["user", "member"],
    roleCount: 2,
    pages: [
      {
        id: "page1",
        title: "Account Information",
        order: 1,
        isRequired: true,
        fields: [
          {
            id: "email",
            name: "email",
            type: "email",
            label: "Email Address",
            placeholder: "Enter your email",
            required: true
          },
          {
            id: "password",
            name: "password", 
            type: "password",
            label: "Password",
            placeholder: "Create a password",
            required: true
          }
        ]
      }
    ],
    pageCount: 1,
    completions: 1247,
    conversionRate: 78.5,
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "admin@example.com",
    updatedAt: "2024-01-20T14:22:00Z",
    isDefault: true
  },
  {
    id: "2", 
    name: "Enterprise Onboarding",
    description: "Multi-step onboarding for enterprise customers with company details",
    type: "invited_signup",
    status: "active",
    template: "multi_step",
    url: "https://auth.example.com/signup/enterprise",
    assignedRoles: ["enterprise_user", "team_member"],
    roleCount: 2,
    pages: [
      {
        id: "page1",
        title: "Personal Information",
        order: 1,
        isRequired: true,
        fields: [
          {
            id: "firstName",
            name: "firstName",
            type: "text",
            label: "First Name",
            required: true
          },
          {
            id: "lastName",
            name: "lastName",
            type: "text",
            label: "Last Name", 
            required: true
          }
        ]
      },
      {
        id: "page2",
        title: "Company Details",
        order: 2,
        isRequired: true,
        fields: [
          {
            id: "company",
            name: "company",
            type: "text",
            label: "Company Name",
            required: true
          },
          {
            id: "role",
            name: "role",
            type: "select",
            label: "Job Role",
            required: true,
            options: ["Developer", "Manager", "Admin", "Other"]
          }
        ]
      }
    ],
    pageCount: 2,
    completions: 89,
    conversionRate: 92.1,
    createdAt: "2024-01-10T09:15:00Z",
    createdBy: "admin@example.com",
    updatedAt: "2024-01-18T16:45:00Z",
    isDefault: false
  },
  {
    id: "3",
    name: "Quick Social Signup",
    description: "Social-first signup with minimal friction",
    type: "signup",
    status: "active", 
    template: "social_first",
    url: "https://auth.example.com/signup/social",
    assignedRoles: ["user"],
    roleCount: 1,
    pages: [
      {
        id: "page1",
        title: "Quick Signup",
        order: 1,
        isRequired: true,
        fields: [
          {
            id: "email",
            name: "email",
            type: "email",
            label: "Email (optional)",
            required: false
          }
        ]
      }
    ],
    pageCount: 1,
    completions: 2156,
    conversionRate: 85.3,
    createdAt: "2024-01-12T11:20:00Z",
    createdBy: "admin@example.com", 
    updatedAt: "2024-01-19T13:10:00Z",
    isDefault: false
  },
  {
    id: "4",
    name: "Beta Tester Signup",
    description: "Invitation-only signup for beta testing program",
    type: "invited_signup",
    status: "draft",
    template: "minimal",
    url: "https://auth.example.com/signup/beta",
    assignedRoles: ["beta_tester", "user"],
    roleCount: 2,
    pages: [
      {
        id: "page1",
        title: "Beta Access",
        order: 1,
        isRequired: true,
        fields: [
          {
            id: "inviteCode",
            name: "inviteCode",
            type: "text",
            label: "Invitation Code",
            required: true
          },
          {
            id: "feedback",
            name: "feedback",
            type: "checkbox",
            label: "I agree to provide feedback",
            required: true
          }
        ]
      }
    ],
    pageCount: 1,
    completions: 0,
    conversionRate: 0,
    createdAt: "2024-01-22T15:30:00Z",
    createdBy: "admin@example.com",
    updatedAt: "2024-01-22T15:30:00Z",
    isDefault: false
  }
]
