import type { SmsTemplate } from "./types"

// Mock data for development
export const MOCK_SMS_TEMPLATES: SmsTemplate[] = [
  {
    id: "1",
    name: "Welcome SMS",
    description: "Welcome new users to the platform with account setup instructions",
    type: "welcome",
    category: "authentication", 
    content: {
      message: "Welcome to {{company.name}}, {{user.firstName}}! Your account is ready. Verify your phone: {{verification.url}}",
      maxLength: 160
    },
    variables: [
      {
        name: "verification.url",
        description: "Phone verification link",
        example: "https://app.example.com/verify-phone?token=abc123",
        required: true
      }
    ],
    isSystem: false,
    isDefault: false,
    createdAt: "2024-01-10T09:00:00Z",
    createdBy: "admin",
    previewUrl: "/preview/sms/1"
  },
  {
    id: "2",
    name: "Password Reset SMS",
    description: "Send password reset codes to users via SMS",
    type: "password_reset",
    category: "authentication",
    content: {
      message: "Your {{company.name}} password reset code is: {{reset.code}}. This code expires in 10 minutes.",
      maxLength: 160
    },
    variables: [
      {
        name: "reset.code",
        description: "6-digit password reset code",
        example: "123456",
        required: true
      }
    ],
    isSystem: true,
    isDefault: true,
    createdAt: "2024-01-08T14:20:00Z",
    createdBy: "system",
    previewUrl: "/preview/sms/2"
  },
  {
    id: "3",
    name: "User Invitation SMS", 
    description: "Invite new users to join your platform via SMS",
    type: "invitation",
    category: "user_management",
    content: {
      message: "{{inviter.name}} invited you to join {{company.name}}. Complete signup: {{invitation.url}}",
      maxLength: 160
    },
    variables: [
      {
        name: "invitation.url",
        description: "User invitation signup link",
        example: "https://app.example.com/signup?invite=xyz789",
        required: true
      },
      {
        name: "inviter.name",
        description: "Name of the person sending the invitation",
        example: "John Smith",
        required: true
      }
    ],
    isSystem: false,
    isDefault: false,
    createdAt: "2024-01-12T16:45:00Z",
    createdBy: "hr-manager",
    previewUrl: "/preview/sms/3"
  },
  {
    id: "4",
    name: "Phone Verification",
    description: "Verify user phone numbers for account security",
    type: "verification", 
    category: "authentication",
    content: {
      message: "Your {{company.name}} verification code is: {{verification.code}}. Enter this code to verify your phone number.",
      maxLength: 160
    },
    variables: [
      {
        name: "verification.code",
        description: "6-digit phone verification code",
        example: "789012",
        required: true
      }
    ],
    isSystem: true,
    isDefault: true,
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "system",
    previewUrl: "/preview/sms/4"
  },
  {
    id: "5",
    name: "Order Confirmation",
    description: "Transactional SMS for order confirmations and receipts",
    type: "transactional",
    category: "notifications",
    content: {
      message: "Order #{{order.number}} confirmed! Total: {{order.total}}. Track your order: {{tracking.url}}",
      maxLength: 160
    },
    variables: [
      {
        name: "order.number",
        description: "Order number",
        example: "ORD-12345",
        required: true
      },
      {
        name: "order.total",
        description: "Order total amount",
        example: "$99.99",
        required: true
      },
      {
        name: "tracking.url",
        description: "Order tracking link",
        example: "https://app.example.com/track/ORD-12345",
        required: false
      }
    ],
    isSystem: false,
    isDefault: false,
    createdAt: "2024-10-15T11:00:00Z",
    createdBy: "marketing",
    previewUrl: "/preview/sms/5"
  }
]
