import { PageContainer, PageHeader } from '@/components/layout'
import { LoginTemplateListing } from './components/LoginTemplateListing'

export default function LoginBrandingPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Login Templates"
        description="Design and customize login pages for your applications. Create multiple branded login experiences with custom themes, layouts, and content that can be applied to different onboarding flows."
      />
      <LoginTemplateListing />
    </PageContainer>
  )
}
