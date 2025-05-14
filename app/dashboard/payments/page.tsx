import { PageTemplate } from "@/components/dashboard/page-template"
import { PaymentsOverview } from "@/components/dashboard/payments-overview"

export default function PaymentsPage() {
  return (
    <PageTemplate title="Payments & Invoices" description="Manage payments and invoices for your clinic">
      <PaymentsOverview />
    </PageTemplate>
  )
}
