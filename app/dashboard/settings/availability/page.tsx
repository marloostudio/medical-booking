import { PageTemplate } from "@/components/dashboard/page-template"
import { ProviderAvailabilityManager } from "@/components/dashboard/provider-availability-manager"

export default function ProviderAvailabilityPage() {
  return (
    <PageTemplate title="Provider Availability" description="Set and manage working hours for your providers">
      <ProviderAvailabilityManager />
    </PageTemplate>
  )
}
