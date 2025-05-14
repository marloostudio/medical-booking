import { PageTemplate } from "@/components/dashboard/page-template"
import { BookingRulesManager } from "@/components/dashboard/booking-rules-manager"

export default function BookingRulesPage() {
  return (
    <PageTemplate
      title="Booking Rules"
      description="Configure rules that control when and how appointments can be booked"
    >
      <BookingRulesManager />
    </PageTemplate>
  )
}
