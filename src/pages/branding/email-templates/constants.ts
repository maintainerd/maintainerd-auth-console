import type { EmailTemplate, EmailTemplateDesign } from "./types"

// Default design themes
export const defaultDesigns: Record<string, EmailTemplateDesign> = {
  modern: {
    primaryColor: "#3b82f6",
    secondaryColor: "#64748b", 
    backgroundColor: "#ffffff",
    textColor: "#1e293b",
    linkColor: "#3b82f6",
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "medium",
    width: 600,
    padding: "normal",
    borderRadius: "medium",
    showLogo: true,
    logoWidth: 120,
    logoHeight: 40,
    showFooter: true,
    showUnsubscribe: true,
    showSocialLinks: false,
    socialLinks: []
  },
  minimal: {
    primaryColor: "#000000",
    secondaryColor: "#6b7280",
    backgroundColor: "#ffffff", 
    textColor: "#111827",
    linkColor: "#000000",
    fontFamily: "system-ui, sans-serif",
    fontSize: "medium",
    width: 500,
    padding: "compact",
    borderRadius: "none",
    showLogo: true,
    logoWidth: 100,
    logoHeight: 30,
    showFooter: true,
    showUnsubscribe: true,
    showSocialLinks: false,
    socialLinks: []
  },
  corporate: {
    primaryColor: "#1e40af",
    secondaryColor: "#475569",
    backgroundColor: "#f8fafc",
    textColor: "#0f172a", 
    linkColor: "#1e40af",
    fontFamily: "Georgia, serif",
    fontSize: "medium",
    width: 650,
    padding: "spacious",
    borderRadius: "small",
    showLogo: true,
    logoWidth: 150,
    logoHeight: 50,
    showFooter: true,
    showUnsubscribe: true,
    showSocialLinks: true,
    socialLinks: [
      { platform: "linkedin", url: "https://linkedin.com/company/acme" },
      { platform: "twitter", url: "https://twitter.com/acme" }
    ]
  }
}

// Mock data for development
export const MOCK_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "1",
    name: "Welcome Email",
    description: "Welcome new users to the platform with account setup instructions",
    type: "welcome",
    category: "authentication", 
    content: {
      subject: "Welcome to {{company.name}}!",
      htmlBody: `
        <h1>Welcome {{user.firstName}}!</h1>
        <p>Thank you for joining {{company.name}}. We're excited to have you on board.</p>
        <p>To get started, please verify your email address by clicking the button below:</p>
        <a href="{{verification.url}}" style="background: {{design.primaryColor}}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Verify Email</a>
        <p>If you have any questions, feel free to reach out to our support team at {{support.email}}.</p>
        <p>Best regards,<br>The {{company.name}} Team</p>
      `,
      textBody: `Welcome {{user.firstName}}!\n\nThank you for joining {{company.name}}. We're excited to have you on board.\n\nTo get started, please verify your email address: {{verification.url}}\n\nIf you have any questions, feel free to reach out to our support team at {{support.email}}.\n\nBest regards,\nThe {{company.name}} Team`,
      preheader: "Complete your account setup"
    },
    design: defaultDesigns.modern,
    variables: [
      {
        name: "verification.url",
        description: "Email verification link",
        example: "https://app.example.com/verify?token=abc123",
        required: true
      }
    ],
    isSystem: true,
    isDefault: true,
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "system",
    previewUrl: "/preview/email/1"
  },
  {
    id: "2", 
    name: "Password Reset",
    description: "Help users reset their forgotten passwords securely",
    type: "password_reset",
    category: "authentication",
    content: {
      subject: "Reset your {{company.name}} password",
      htmlBody: `
        <h1>Password Reset Request</h1>
        <p>Hi {{user.firstName}},</p>
        <p>We received a request to reset your password for your {{company.name}} account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="{{reset.url}}" style="background: {{design.primaryColor}}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Reset Password</a>
        <p><strong>This link will expire in 24 hours.</strong></p>
        <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
        <p>Best regards,<br>The {{company.name}} Team</p>
      `,
      textBody: `Password Reset Request\n\nHi {{user.firstName}},\n\nWe received a request to reset your password for your {{company.name}} account.\n\nReset your password: {{reset.url}}\n\nThis link will expire in 24 hours.\n\nIf you didn't request this password reset, please ignore this email or contact support if you have concerns.\n\nBest regards,\nThe {{company.name}} Team`,
      preheader: "Reset your password securely"
    },
    design: defaultDesigns.modern,
    variables: [
      {
        name: "reset.url",
        description: "Password reset link",
        example: "https://app.example.com/reset?token=xyz789",
        required: true
      }
    ],
    isSystem: true,
    isDefault: true,
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "system",
    previewUrl: "/preview/email/2"
  },
  {
    id: "3",
    name: "User Invitation", 
    description: "Invite new users to join your platform",
    type: "invitation",
    category: "user_management",
    content: {
      subject: "You're invited to join {{company.name}}",
      htmlBody: `
        <h1>You're Invited!</h1>
        <p>Hi there,</p>
        <p>{{inviter.name}} has invited you to join {{company.name}}.</p>
        <p>Click the button below to accept the invitation and create your account:</p>
        <a href="{{invitation.url}}" style="background: {{design.primaryColor}}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Accept Invitation</a>
        <p>This invitation will expire in 7 days.</p>
        <p>If you have any questions, contact us at {{support.email}}.</p>
        <p>Welcome to the team!<br>The {{company.name}} Team</p>
      `,
      textBody: `You're Invited!\n\nHi there,\n\n{{inviter.name}} has invited you to join {{company.name}}.\n\nAccept the invitation: {{invitation.url}}\n\nThis invitation will expire in 7 days.\n\nIf you have any questions, contact us at {{support.email}}.\n\nWelcome to the team!\nThe {{company.name}} Team`,
      preheader: "Join our team today"
    },
    design: defaultDesigns.corporate,
    variables: [
      {
        name: "invitation.url",
        description: "Invitation acceptance link",
        example: "https://app.example.com/invite?token=inv456",
        required: true
      },
      {
        name: "inviter.name",
        description: "Name of the person who sent the invitation",
        example: "Sarah Johnson",
        required: true
      }
    ],
    isSystem: false,
    isDefault: false,
    createdAt: "2024-02-10T14:20:00Z",
    createdBy: "admin",
    previewUrl: "/preview/email/3"
  },
  {
    id: "4",
    name: "Email Verification",
    description: "Verify user email addresses for account security",
    type: "verification", 
    category: "authentication",
    content: {
      subject: "Verify your email address",
      htmlBody: `
        <h1>Verify Your Email</h1>
        <p>Hi {{user.firstName}},</p>
        <p>Please verify your email address to complete your {{company.name}} account setup.</p>
        <p>Click the button below to verify your email:</p>
        <a href="{{verification.url}}" style="background: {{design.primaryColor}}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Verify Email</a>
        <p>This verification link will expire in 48 hours.</p>
        <p>If you didn't create this account, please ignore this email.</p>
        <p>Thanks,<br>The {{company.name}} Team</p>
      `,
      textBody: `Verify Your Email\n\nHi {{user.firstName}},\n\nPlease verify your email address to complete your {{company.name}} account setup.\n\nVerify your email: {{verification.url}}\n\nThis verification link will expire in 48 hours.\n\nIf you didn't create this account, please ignore this email.\n\nThanks,\nThe {{company.name}} Team`,
      preheader: "Complete your account verification"
    },
    design: defaultDesigns.minimal,
    variables: [
      {
        name: "verification.url",
        description: "Email verification link",
        example: "https://app.example.com/verify?token=ver789",
        required: true
      }
    ],
    isSystem: true,
    isDefault: true,
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "system",
    previewUrl: "/preview/email/4"
  },
  {
    id: "5",
    name: "Monthly Newsletter",
    description: "Monthly product updates and company news",
    type: "marketing",
    category: "marketing", 
    content: {
      subject: "{{company.name}} Monthly Update - {{month}} {{year}}",
      htmlBody: `
        <h1>Monthly Update</h1>
        <p>Hi {{user.firstName}},</p>
        <p>Here's what's new at {{company.name}} this month:</p>
        <h2>Product Updates</h2>
        <ul>
          <li>New dashboard design</li>
          <li>Enhanced security features</li>
          <li>Mobile app improvements</li>
        </ul>
        <h2>Company News</h2>
        <p>We're excited to announce our Series A funding round...</p>
        <a href="{{newsletter.url}}" style="background: {{design.primaryColor}}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Read Full Newsletter</a>
        <p>Best regards,<br>The {{company.name}} Team</p>
      `,
      textBody: `Monthly Update\n\nHi {{user.firstName}},\n\nHere's what's new at {{company.name}} this month:\n\nProduct Updates:\n- New dashboard design\n- Enhanced security features\n- Mobile app improvements\n\nCompany News:\nWe're excited to announce our Series A funding round...\n\nRead full newsletter: {{newsletter.url}}\n\nBest regards,\nThe {{company.name}} Team`,
      preheader: "Product updates and company news"
    },
    design: defaultDesigns.corporate,
    variables: [
      {
        name: "newsletter.url",
        description: "Full newsletter URL",
        example: "https://newsletter.example.com/2024/10",
        required: false
      },
      {
        name: "month",
        description: "Current month name",
        example: "October",
        required: true
      },
      {
        name: "year",
        description: "Current year",
        example: "2024",
        required: true
      }
    ],
    isSystem: false,
    isDefault: false,
    createdAt: "2024-10-15T11:00:00Z",
    createdBy: "marketing",
    previewUrl: "/preview/email/5"
  }
]
