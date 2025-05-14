import { PageTemplate } from "@/components/dashboard/page-template"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"

export default function DashboardPage() {
  return (
    <PageTemplate title="Dashboard" description="Overview of your clinic's performance and key metrics">
      <DashboardOverview />
    </PageTemplate>
  )
}
