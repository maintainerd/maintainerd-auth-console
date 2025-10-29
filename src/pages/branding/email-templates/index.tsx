import { EmailTemplateDataTable } from "./components/EmailTemplateDataTable"
import { emailTemplateColumns } from "./components/EmailTemplateColumns"
import { MOCK_EMAIL_TEMPLATES } from "./constants"

export default function EmailTemplatesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Email Templates</h1>
        <p className="text-muted-foreground">
          Create and manage email templates for authentication, notifications, and marketing campaigns. 
          Customize designs, content, and variables to match your brand and communication needs.
        </p>
      </div>

      <EmailTemplateDataTable columns={emailTemplateColumns} data={MOCK_EMAIL_TEMPLATES} />
    </div>
  )
}
