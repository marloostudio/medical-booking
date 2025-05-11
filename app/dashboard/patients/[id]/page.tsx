import { Suspense } from "react"
import { notFound } from "next/navigation"
import { PageTemplate } from "@/components/dashboard/page-template"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { patientService } from "@/services/patient-service"
import { appointmentService } from "@/services/appointment-service"
import { format } from "date-fns"
import Link from "next/link"
import { Edit, Calendar, FileText, Download, Trash2 } from "lucide-react"

// Patient detail component
async function PatientDetail({ params }: { params: { id: string } }) {
  // In a real app, you would get the clinicId from the session or context
  // For now, we'll use a default value
  const clinicId = process.env.DEFAULT_CLINIC_ID || "demo-clinic"
  const patient = await patientService.getPatient(clinicId, params.id)

  if (!patient) {
    notFound()
  }

  // Get patient appointments
  const appointments = await appointmentService.getAppointments(clinicId, {
    patientId: patient.id,
    limit: 10,
  })

  // Get patient documents
  const documents = await patientService.getPatientDocuments(clinicId, patient.id)

  return (
    <PageTemplate
      title={`${patient.firstName} ${patient.lastName}`}
      description="Patient details and medical records"
      actions={
        <div className="flex space-x-2">
          <Link href={`/dashboard/patients/${patient.id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Patient
            </Button>
          </Link>
          <Link href={`/dashboard/appointments/new?patientId=${patient.id}`}>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>
          </Link>
        </div>
      }
    >
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="medical">Medical History</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-sm font-medium">Date of Birth</div>
                  <div className="text-sm">{patient.dateOfBirth}</div>

                  <div className="text-sm font-medium">Gender</div>
                  <div className="text-sm capitalize">{patient.gender}</div>

                  <div className="text-sm font-medium">Email</div>
                  <div className="text-sm">{patient.email}</div>

                  <div className="text-sm font-medium">Phone</div>
                  <div className="text-sm">{patient.phone}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {patient.address ? (
                  <div className="space-y-1">
                    <div className="text-sm">{patient.address.street}</div>
                    <div className="text-sm">
                      {patient.address.city}, {patient.address.state} {patient.address.postalCode}
                    </div>
                    <div className="text-sm">{patient.address.country}</div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No address on file</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {patient.emergencyContact ? (
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-sm font-medium">Name</div>
                    <div className="text-sm">{patient.emergencyContact.name}</div>

                    <div className="text-sm font-medium">Relationship</div>
                    <div className="text-sm">{patient.emergencyContact.relationship}</div>

                    <div className="text-sm font-medium">Phone</div>
                    <div className="text-sm">{patient.emergencyContact.phone}</div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No emergency contact on file</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Insurance Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {patient.insuranceInfo ? (
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-sm font-medium">Provider</div>
                    <div className="text-sm">{patient.insuranceInfo.provider}</div>

                    <div className="text-sm font-medium">Policy Number</div>
                    <div className="text-sm">{patient.insuranceInfo.policyNumber}</div>

                    {patient.insuranceInfo.groupNumber && (
                      <>
                        <div className="text-sm font-medium">Group Number</div>
                        <div className="text-sm">{patient.insuranceInfo.groupNumber}</div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No insurance information on file</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="medical" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Allergies</CardTitle>
              </CardHeader>
              <CardContent>
                {patient.medicalHistory?.allergies && patient.medicalHistory.allergies.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {patient.medicalHistory.allergies.map((allergy, index) => (
                      <li key={index} className="text-sm">
                        {allergy}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-muted-foreground">No allergies on file</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Medications</CardTitle>
              </CardHeader>
              <CardContent>
                {patient.medicalHistory?.medications && patient.medicalHistory.medications.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {patient.medicalHistory.medications.map((medication, index) => (
                      <li key={index} className="text-sm">
                        {medication}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-muted-foreground">No medications on file</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Medical Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                {patient.medicalHistory?.conditions && patient.medicalHistory.conditions.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {patient.medicalHistory.conditions.map((condition, index) => (
                      <li key={index} className="text-sm">
                        {condition}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-muted-foreground">No medical conditions on file</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Surgical History</CardTitle>
              </CardHeader>
              <CardContent>
                {patient.medicalHistory?.surgeries && patient.medicalHistory.surgeries.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {patient.medicalHistory.surgeries.map((surgery, index) => (
                      <li key={index} className="text-sm">
                        {surgery}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-muted-foreground">No surgical history on file</div>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Family Medical History</CardTitle>
              </CardHeader>
              <CardContent>
                {patient.medicalHistory?.familyHistory && patient.medicalHistory.familyHistory.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {patient.medicalHistory.familyHistory.map((history, index) => (
                      <li key={index} className="text-sm">
                        {history}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-muted-foreground">No family medical history on file</div>
                )}
              </CardContent>
            </Card>

            {patient.notes && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm whitespace-pre-wrap">{patient.notes}</div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Appointment History</CardTitle>
                <CardDescription>View past and upcoming appointments</CardDescription>
              </div>
              <Link href={`/dashboard/appointments/new?patientId=${patient.id}`}>
                <Button size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  New Appointment
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {appointments.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date & Time
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Provider
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Type
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {format(appointment.startTime.toDate(), "MMM d, yyyy h:mm a")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.staffId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {appointment.appointmentType.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${
                                appointment.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : appointment.status === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : appointment.status === "completed"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Link href={`/dashboard/appointments/${appointment.id}`}>
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No appointments found</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Patient Documents</CardTitle>
                <CardDescription>View and manage patient documents</CardDescription>
              </div>
              <Link href={`/dashboard/patients/${patient.id}/documents/upload`}>
                <Button size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {documents.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Type
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Uploaded
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {documents.map((document) => (
                        <tr key={document.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{document.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{document.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {format(new Date(document.createdAt), "MMM d, yyyy")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <a href={document.url} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Button>
                              </a>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-800 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No documents found</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>View billing history and insurance details</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Billing information would be loaded here */}
              <div className="text-sm text-muted-foreground">No billing information found</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageTemplate>
  )
}

// Loading state
function PatientDetailLoading() {
  return (
    <PageTemplate title={<Skeleton className="h-8 w-48" />} description={<Skeleton className="h-4 w-64" />}>
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </PageTemplate>
  )
}

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<PatientDetailLoading />}>
      <PatientDetail params={params} />
    </Suspense>
  )
}
