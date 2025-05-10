import ProviderManagement from "@/components/dashboard/provider-management"

export default function ProvidersPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Medical Providers</h1>
      <ProviderManagement />
    </div>
  )
}
