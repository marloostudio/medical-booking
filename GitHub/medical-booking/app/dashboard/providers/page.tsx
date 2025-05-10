import { requireAuth } from "@/lib/auth-utils"
import ProviderManagement from "@/components/dashboard/provider-management"

export default async function ProvidersPage() {
  const session = await requireAuth()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Provider Management</h1>
      <ProviderManagement />
    </div>
  )
}
