import type { User, UserProfile } from "./components/UserColumns"

export const MOCK_USERS: User[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    username: "reyco.seguma",
    email: "reyco@example.com",
    roles: ["Admin", "Developer"],
    status: "active",
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
    id: "550e8400-e29b-41d4-a716-446655440002",
    username: "jane.doe",
    email: "jane@example.com",
    roles: ["User"],
    status: "active",
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
    id: "550e8400-e29b-41d4-a716-446655440003",
    username: "john.smith",
    email: "john@example.com",
    roles: ["Manager", "User"],
    status: "active",
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
    id: "550e8400-e29b-41d4-a716-446655440004",
    username: "sarah.wilson",
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
    id: "550e8400-e29b-41d4-a716-446655440005",
    username: "mike.johnson",
    email: "mike@example.com",
    roles: ["User"],
    status: "suspended",
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
    id: "550e8400-e29b-41d4-a716-446655440006",
    username: "emily.chen",
    email: "emily@example.com",
    roles: ["Admin", "Security"],
    status: "active",
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
    id: "550e8400-e29b-41d4-a716-446655440007",
    username: "david.brown",
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

// Mock user profiles (separate from user data)
export const MOCK_USER_PROFILES: UserProfile[] = [
  {
    userId: "550e8400-e29b-41d4-a716-446655440001",
    firstName: "Reyco",
    lastName: "Seguma",
    displayName: "Reyco Seguma",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=reyco.seguma",
    bio: "Technology enthusiast and problem solver",
    birthDate: "1990-05-15",
    gender: "male",
    phoneNumber: "+1 (555) 123-4567",
    address: "123 Tech Street",
    city: "San Francisco",
    country: "US",
    timezone: "America/Los_Angeles",
    language: "en"
  },
  {
    userId: "550e8400-e29b-41d4-a716-446655440002",
    firstName: "Jane",
    lastName: "Doe",
    displayName: "Jane Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane.doe",
    bio: "Creative thinker focused on user experience",
    birthDate: "1988-12-03",
    gender: "female",
    city: "New York",
    country: "US",
    timezone: "America/New_York",
    language: "en"
  },
  {
    userId: "550e8400-e29b-41d4-a716-446655440003",
    firstName: "John",
    lastName: "Smith",
    displayName: "John Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john.smith",
    bio: "Experienced leader with passion for innovation",
    timezone: "America/Chicago",
    language: "en"
  },
  {
    userId: "550e8400-e29b-41d4-a716-446655440004",
    firstName: "Sarah",
    lastName: "Wilson",
    displayName: "Sarah Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah.wilson",
    timezone: "America/Los_Angeles",
    language: "en"
  },
  {
    userId: "550e8400-e29b-41d4-a716-446655440005",
    firstName: "Mike",
    lastName: "Johnson",
    displayName: "Mike Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike.johnson",
    bio: "Enthusiastic team player",
    timezone: "America/Chicago",
    language: "en"
  },
  {
    userId: "550e8400-e29b-41d4-a716-446655440006",
    firstName: "Emily",
    lastName: "Chen",
    displayName: "Emily Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily.chen",
    bio: "Detail-oriented professional with strong analytical skills",
    timezone: "America/New_York",
    language: "en"
  },
  {
    userId: "550e8400-e29b-41d4-a716-446655440007",
    firstName: "David",
    lastName: "Brown",
    displayName: "David Brown",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david.brown",
    bio: "Analytical thinker with passion for insights",
    timezone: "America/Denver",
    language: "en"
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
