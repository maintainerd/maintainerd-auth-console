import { SmsTemplateDataTable } from "./components/SmsTemplateDataTable"
import { smsTemplateColumns } from "./components/SmsTemplateColumns"
import { MOCK_SMS_TEMPLATES } from "./constants"

export default function SmsTemplatesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">SMS Templates</h1>
        <p className="text-muted-foreground">
          Create and manage SMS templates for authentication, notifications, and marketing campaigns. 
          Design concise messages with variables to deliver personalized communications via text message.
        </p>
      </div>

      <SmsTemplateDataTable columns={smsTemplateColumns} data={MOCK_SMS_TEMPLATES} />
    </div>
  )
}
