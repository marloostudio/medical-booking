"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, UserPlus, Filter } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Dummy patient data for demonstration
const dummyPatients = [
  {
    id: "p1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    dateOfBirth: "1985-06-15",
    lastVisit: "2023-04-10",
  },
  {
    id: "p2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "(555) 987-6543",
    dateOfBirth: "1990-11-22",
    lastVisit: "2023-05-05",
  },
  {
    id: "p3",
    name: "Michael Brown",
    email: "michael.b@example.com",
    phone: "(555) 456-7890",
    dateOfBirth: "1978-03-30",
    lastVisit: "2023-03-15",
  },
  {
    id: "p4",
    name: "Emily Davis",
    email: "emily.d@example.com",
    phone: "(555) 234-5678",
    dateOfBirth: "1992-09-18",
    lastVisit: "2023-05-20",
  },
  {
    id: "p5",
    name: "Robert Wilson",
    email: "robert.w@example.com",
    phone: "(555) 876-5432",
    dateOfBirth: "1965-12-03",
    lastVisit: "2023-04-25",
  },
]

export default function AllPatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [patients, setPatients] = useState(dummyPatients)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Filter patients based on search term
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm),
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handlePatientClick = (patientId: string) => {
    router.push(`/dashboard/patients/${patientId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">All Patients</h1>
        <Link href="/dashboard/patients/new">
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add New Patient
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Patient Directory</CardTitle>
            <div className="flex w-full sm:w-auto gap-2">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search patients..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-md"></div>
              ))}
            </div>
          ) : filteredPatients.length > 0 ? (
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="py-3 px-4 text-left font-medium">Name</th>
                      <th className="py-3 px-4 text-left font-medium">Email</th>
                      <th className="py-3 px-4 text-left font-medium">Phone</th>
                      <th className="py-3 px-4 text-left font-medium">Date of Birth</th>
                      <th className="py-3 px-4 text-left font-medium">Last Visit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((patient) => (
                      <tr
                        key={patient.id}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => handlePatientClick(patient.id)}
                      >
                        <td className="py-3 px-4">{patient.name}</td>
                        <td className="py-3 px-4">{patient.email}</td>
                        <td className="py-3 px-4">{patient.phone}</td>
                        <td className="py-3 px-4">{patient.dateOfBirth}</td>
                        <td className="py-3 px-4">{patient.lastVisit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No patients found matching your search criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
