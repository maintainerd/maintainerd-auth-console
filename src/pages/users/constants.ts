import type { User } from "./components/UserColumns"

export const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Reyco Seguma",
    email: "reyco@example.com",
    roles: ["Admin", "Developer"],
    status: "active",
    avatar: "/avatars/reyco.jpg",
    phone: "+1 (555) 123-4567",
    createdAt: "2024-01-15T10:30:00Z",
    lastLogin: "2024-10-25T14:22:00Z",
    emailVerified: true,
    isActive: true,
    twoFactorEnabled: true,
    loginAttempts: 0,
    lastPasswordChange: "2024-09-15T10:00:00Z"
  },
  {
    id: "2",
    name: "Jane Doe",
    email: "jane@example.com",
    roles: ["User"],
    status: "active",
    avatar: "/avatars/jane.jpg",
    phone: "+1 (555) 234-5678",
    createdAt: "2024-02-20T09:15:00Z",
    lastLogin: "2024-10-24T16:45:00Z",
    emailVerified: true,
    isActive: true,
    twoFactorEnabled: false,
    loginAttempts: 0,
    lastPasswordChange: "2024-08-10T14:30:00Z"
  },
  {
    id: "3",
    name: "John Smith",
    email: "john@example.com",
    roles: ["Manager", "User"],
    status: "active",
    avatar: "/avatars/john.jpg",
    phone: "+1 (555) 345-6789",
    createdAt: "2024-01-10T08:00:00Z",
    lastLogin: "2024-10-25T11:30:00Z",
    emailVerified: true,
    isActive: true,
    twoFactorEnabled: true,
    loginAttempts: 0,
    lastPasswordChange: "2024-07-20T09:15:00Z"
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    roles: ["User"],
    status: "pending",
    phone: "+1 (555) 456-7890",
    createdAt: "2024-10-25T12:00:00Z",
    lastLogin: undefined,
    emailVerified: false,
    isActive: false,
    twoFactorEnabled: false,
    loginAttempts: 0,
    lastPasswordChange: undefined
  },
  {
    id: "5",
    name: "Mike Johnson",
    email: "mike@example.com",
    roles: ["User"],
    status: "suspended",
    avatar: "/avatars/mike.jpg",
    phone: "+1 (555) 567-8901",
    createdAt: "2024-03-05T14:20:00Z",
    lastLogin: "2024-10-20T09:15:00Z",
    emailVerified: true,
    isActive: false,
    twoFactorEnabled: false,
    loginAttempts: 5,
    lastPasswordChange: "2024-06-15T11:20:00Z"
  },
  {
    id: "6",
    name: "Emily Chen",
    email: "emily@example.com",
    roles: ["Admin", "Security"],
    status: "active",
    avatar: "/avatars/emily.jpg",
    phone: "+1 (555) 678-9012",
    createdAt: "2024-01-08T07:45:00Z",
    lastLogin: "2024-10-25T13:10:00Z",
    emailVerified: true,
    isActive: true,
    twoFactorEnabled: true,
    loginAttempts: 0,
    lastPasswordChange: "2024-09-01T16:30:00Z"
  },
  {
    id: "7",
    name: "David Brown",
    email: "david@example.com",
    roles: ["User", "Viewer"],
    status: "inactive",
    phone: "+1 (555) 789-0123",
    createdAt: "2024-04-12T11:30:00Z",
    lastLogin: "2024-09-15T10:20:00Z",
    emailVerified: true,
    isActive: false,
    twoFactorEnabled: false,
    loginAttempts: 2,
    lastPasswordChange: "2024-05-20T08:45:00Z"
  }
]

// Available roles for filtering and role management
export const AVAILABLE_ROLES = [
  "Admin",
  "User", 
  "Manager",
  "Developer",
  "Security",
  "Viewer"
] as const

// Available status options
export const USER_STATUSES = [
  "active",
  "inactive", 
  "pending",
  "suspended"
] as const
