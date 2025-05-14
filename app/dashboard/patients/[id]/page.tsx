"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Edit, Trash2, UserCog } from "lucide-react"
import Link from "next/link"

// Dummy patient data for demonstration
const dummyPatients = {
  p1: {
    id: "p1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    dateOfBirth: "1985-06-15",
    gender: "Male",
    address: "123 Main St, Anytown, CA 12345",
    insuranceProvider: "Blue Cross Blue Shield",
    policyNumber: "BC123456789",
    allergies: "Penicillin",
    lastVisit: "2023-04-10",
    upcomingAppointment: "2023-06-15",
  },
  p2: {
    id: "p2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "(555) 987-6543",
    dateOfBirth: "1990-11-22",
    gender: "Female",
    address: "456 Oak Ave, Somewhere, NY 54321",
    insuranceProvider: "Aetna",
    policyNumber: "AT987654321",
    allergies: "None",
    lastVisit: "2023-05-05",
    upcomingAppointment: "2023-06-20",
  },
  p3: {
    id: "p3",
    name: "Michael Brown",
    email: "michael.b@example.com",
    phone: "(555) 456-7890",
    dateOfBirth: "1978-03-30",
    gender: "Male",
    address: "789 Pine St, Elsewhere, TX 67890",
    insuranceProvider: "UnitedHealthcare",
    policyNumber: "UH567891234",
    allergies: "Sulfa drugs",
    lastVisit: "2023-03-15",
    upcomingAppointment: null,
  },
  p4: {
    id: "p4",
    name: "Emily Davis",
    email: "emily.d@example.com",
    phone: "(555) 234-5678",
    dateOfBirth: "1992-09-18",
    gender: "Female",
    address: "321 Maple Dr, Nowhere, FL 13579",
    insuranceProvider: "Cigna",
    policyNumber: "CI246813579",
    allergies: "Latex",
    lastVisit: "2023-05-20",
    upcomingAppointment: "2023-07-10",
  },
  p5: {
    id: "p5",
    name: "Robert Wilson",
    email: "robert.w@example.com",
    phone: "(555) 876-5432",
    dateOfBirth: "1965-12-03",
    gender: "Male",
    address: "654 Cedar Ln, Anywhere, WA 97531",
    insuranceProvider: "Medicare",
    policyNumber: "MC135792468",
    allergies: "None",
    lastVisit: "2023-04-25",
    upcomingAppointment: "2023-06-30",
  },
}

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const [patient, setPatient] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      const patientData = dummyPatients[params.id as keyof typeof dummyPatients]
      if (patientData) {
        setPatient(patientData)
      } else {
        // Redirect to all patients if patient not found
        router.push("/dashboard/patients/all")
      }
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [params.id, router])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-100 animate-pulse rounded-md"></div>
        <Card>
          <CardHeader>
            <div className="h-6 w-48 bg-gray-100 animate-pulse rounded-md"></div>
            <div className="h-4 w-72 bg-gray-100 animate-pulse rounded-md"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-100 animate-pulse rounded-md"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!patient) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/patients/all">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{patient.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Book Appointment
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" size="icon">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Profile</CardTitle>
          <CardDescription>View and manage patient information.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="medical">Medical Records</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Personal Information</h3>
                    <div className="mt-2 border rounded-md p-4 space-y-2">
                      <div className="grid grid-cols-3">
                        <span className="text-sm font-medium">Date of Birth:</span>
                        <span className="text-sm col-span-2">{patient.dateOfBirth}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="text-sm font-medium">Gender:</span>
                        <span className="text-sm col-span-2">{patient.gender}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                    <div className="mt-2 border rounded-md p-4 space-y-2">
                      <div className="grid grid-cols-3">
                        <span className="text-sm font-medium">Email:</span>
                        <span className="text-sm col-span-2">{patient.email}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="text-sm font-medium">Phone:</span>
                        <span className="text-sm col-span-2">{patient.phone}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="text-sm font-medium">Address:</span>
                        <span className="text-sm col-span-2">{patient.address}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Insurance Information</h3>
                    <div className="mt-2 border rounded-md p-4 space-y-2">
                      <div className="grid grid-cols-3">
                        <span className="text-sm font-medium">Provider:</span>
                        <span className="text-sm col-span-2">{patient.insuranceProvider}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="text-sm font-medium">Policy Number:</span>
                        <span className="text-sm col-span-2">{patient.policyNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Medical Information</h3>
                    <div className="mt-2 border rounded-md p-4 space-y-2">
                      <div className="grid grid-cols-3">
                        <span className="text-sm font-medium">Allergies:</span>
                        <span className="text-sm col-span-2">{patient.allergies}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="text-sm font-medium">Last Visit:</span>
                        <span className="text-sm col-span-2">{patient.lastVisit}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="text-sm font-medium">Next Appointment:</span>
                        <span className="text-sm col-span-2">
                          {patient.upcomingAppointment || "No upcoming appointments"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="flex items-center gap-2">
                  <UserCog className="h-4 w-4" />
                  Manage Patient
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="appointments" className="mt-6">
              <div className="text-center py-10">
                <h3 className="text-lg font-medium">Appointment History</h3>
                <p className="text-gray-500 mt-2">
                  This section will display the patient's appointment history and allow scheduling new appointments.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="medical" className="mt-6">
              <div className="text-center py-10">
                <h3 className="text-lg font-medium">Medical Records</h3>
                <p className="text-gray-500 mt-2">
                  This section will display the patient's medical records, history, and allow adding new records.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="billing" className="mt-6">
              <div className="text-center py-10">
                <h3 className="text-lg font-medium">Billing Information</h3>
                <p className="text-gray-500 mt-2">
                  This section will display the patient's billing history, invoices, and payment information.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
