import { RoleListing } from "./components/RoleListing"
import { PageHeader } from "@/components/layout"

export default function RolesPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <PageHeader
        title="Roles"
        description="Create and manage roles with specific permissions to control what users can access and do."
      />
      <RoleListing tableInCard />
    </div>
  )
}
