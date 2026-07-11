import { UserListing } from "./components/UserListing"
import { PageHeader } from "@/components/layout"

export default function UsersPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <PageHeader
        title="Users"
        description="Manage user accounts, authentication settings, and security features like 2FA and email verification."
      />
      <UserListing tableInCard />
    </div>
  )
}
