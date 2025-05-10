import { BookingPageContent } from "./booking-page-content"

export default function BookingPage({
  params,
  searchParams,
}: {
  params: { clinicId: string }
  searchParams: { appointmentTypeId?: string; staffId?: string; date?: string }
}) {
  const { clinicId } = params
  const { appointmentTypeId, staffId, date } = searchParams

  return <BookingPageContent clinicId={clinicId} appointmentTypeId={appointmentTypeId} staffId={staffId} date={date} />
}
