import { requireAuth } from "@/lib/auth-utils"
import { UserManagement } from "@/components/dashboard/user-management"

export default async function UsersPage() {
  const session = await requireAuth()

  if (!session.user.clinicId) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p>You don't have access to a clinic.</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <UserManagement clinicId={session.user.clinicId} />
    </div>
  )
}
