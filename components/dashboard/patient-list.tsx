"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, UserPlus, Eye, Edit, Trash2, AlertCircle } from "lucide-react"
import { auth } from "@/lib/firebase"
import { patientService } from "@/services/patient-service"
import { staffService } from "@/services/staff-service"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"

export function PatientList() {
  const router = useRouter()
  const { toast } = useToast()
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [clinicId, setClinicId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true)

        // Get the current user
        const user = auth.currentUser
        if (!user) {
          throw new Error("User not authenticated")
        }

        // Get the staff member to find the clinic ID
        const staffMember = await staffService.getStaffByEmail(user.email || "")
        if (!staffMember) {
          throw new Error("Staff record not found")
        }

        setClinicId(staffMember.clinicId)

        // Fetch patients for the clinic
        const fetchedPatients = await patientService.getClinicPatients(staffMember.clinicId)
        setPatients(fetchedPatients)
      } catch (error: any) {
        console.error("Error fetching patients:", error)
        setError(error.message || "Failed to load patients")
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [])

  const handleSearch = async () => {
    if (!clinicId) return

    try {
      setLoading(true)

      if (searchTerm.trim() === "") {
        // If search is empty, fetch all patients
        const fetchedPatients = await patientService.getClinicPatients(clinicId)
        setPatients(fetchedPatients)
      } else {
        // Search for patients
        const searchResults = await patientService.searchPatients(clinicId, searchTerm)
        setPatients(searchResults)
      }
    } catch (error: any) {
      console.error("Error searching patients:", error)
      toast({
        variant: "destructive",
        title: "Search Error",
        description: error.message || "Failed to search patients",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddPatient = () => {
    router.push("/dashboard/patients/new")
  }

  const handleViewPatient = (id: string) => {
    router.push(`/dashboard/patients/${id}`)
  }

  const handleEditPatient = (id: string) => {
    router.push(`/dashboard/patients/${id}/edit`)
  }

  const handleDeletePatient = async (id: string) => {
    if (!confirm("Are you sure you want to delete this patient? This action cannot be undone.")) {
      return
    }

    try {
      await patientService.deletePatient(id)

      // Remove the patient from the list
      setPatients(patients.filter((patient) => patient.id !== id))

      toast({
        title: "Patient Deleted",
        description: "The patient has been deleted successfully",
      })
    } catch (error: any) {
      console.error("Error deleting patient:", error)
      toast({
        variant: "destructive",
        title: "Delete Error",
        description: error.message || "Failed to delete patient",
      })
    }
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading patients</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search patients..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button onClick={handleAddPatient}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Patient
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : patients.length === 0 ? (
        <div className="text-center py-10 border rounded-md">
          <h3 className="text-lg font-medium text-gray-900">No patients found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new patient.</p>
          <div className="mt-6">
            <Button onClick={handleAddPatient}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
          </div>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date of Birth</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>
                    {patient.dateOfBirth ? format(new Date(patient.dateOfBirth), "MMM d, yyyy") : "N/A"}
                  </TableCell>
                  <TableCell>{patient.contactNumber || "N/A"}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewPatient(patient.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditPatient(patient.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeletePatient(patient.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
