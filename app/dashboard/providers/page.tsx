import { requirePermission } from "@/lib/auth-utils"
import ProviderManagement from "@/components/dashboard/provider-management"

export default async function ProvidersPage() {
  // Ensure the user has permission to view providers
  await requirePermission("providers", "view")

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Medical Providers</h1>
      <ProviderManagement />
    </div>
  )
}
