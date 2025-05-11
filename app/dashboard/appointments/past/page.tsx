import { PageTemplate } from "@/components/dashboard/page-template"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function PastAppointmentsPage() {
  // Sample data - would be fetched from database in real implementation
  const appointments = [
    {
      id: 1,
      patient: "John Doe",
      date: "2023-04-10",
      time: "09:00 AM",
      type: "Check-up",
      provider: "Dr. Smith",
      status: "Completed",
    },
    {
      id: 2,
      patient: "Jane Smith",
      date: "2023-04-05",
      time: "10:30 AM",
      type: "Follow-up",
      provider: "Dr. Johnson",
      status: "Completed",
    },
    {
      id: 3,
      patient: "Robert Brown",
      date: "2023-03-22",
      time: "02:15 PM",
      type: "Consultation",
      provider: "Dr. Williams",
      status: "No-show",
    },
  ]

  return (
    <PageTemplate title="Past Appointments" description="View your past appointment history">
      <Card>
        <CardHeader>
          <CardTitle>Past Appointments</CardTitle>
          <CardDescription>Historical record of all completed appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.patient}</TableCell>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.type}</TableCell>
                  <TableCell>{appointment.provider}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        appointment.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "No-show"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">View Details</button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageTemplate>
  )
}
