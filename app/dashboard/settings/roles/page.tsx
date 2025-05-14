import { PageTemplate } from "@/components/dashboard/page-template"
import { RolesPermissionsManager } from "@/components/dashboard/roles-permissions-manager"

export default function RolesPermissionsPage() {
  return (
    <PageTemplate title="Roles & Permissions" description="Manage user roles and their permissions">
      <RolesPermissionsManager />
    </PageTemplate>
  )
}
