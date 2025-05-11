"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, UserPlus, Calendar, Edit, ChevronLeft, ChevronRight } from "lucide-react"
import { patientService, type Patient } from "@/services/patient-service"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function PatientSearch() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(false)
  const [clinicId, setClinicId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("lastName")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    gender: "",
    insuranceProvider: "",
  })
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const patientsPerPage = 10

  // Get clinic ID
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/login")
        return
      }

      try {
        // Get user data to find clinic ID
        const userDoc = await getDoc(doc(db, "users", user.uid))

        if (!userDoc.exists()) {
          throw new Error("User profile not found")
        }

        const userData = userDoc.data()
        const userClinicId = userData.clinicId

        if (!userClinicId) {
          throw new Error("No clinic associated with this user")
        }

        setClinicId(userClinicId)

        // Load initial patients
        searchPatients(userClinicId, "")
      } catch (error) {
        console.error("Error getting clinic ID:", error)
      }
    })

    return () => unsubscribe()
  }, [router])

  const searchPatients = async (clinic: string, term: string) => {
    if (!clinic) return

    setLoading(true)
    try {
      const results = await patientService.searchPatients(clinic, term, {
        sortBy,
        sortDirection,
        filters: {
          gender: filters.gender || undefined,
          insuranceProvider: filters.insuranceProvider || undefined,
        },
      })

      setPatients(results)
      setTotalPages(Math.ceil(results.length / patientsPerPage))
    } catch (error) {
      console.error("Error searching patients:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (!clinicId) return
    setPage(1)
    searchPatients(clinicId, searchTerm)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    if (clinicId) {
      searchPatients(clinicId, searchTerm)
    }
  }

  const handleSortDirectionChange = () => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc"
    setSortDirection(newDirection)
    if (clinicId) {
      searchPatients(clinicId, searchTerm)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    if (!clinicId) return
    setPage(1)
    searchPatients(clinicId, searchTerm)
  }

  const resetFilters = () => {
    setFilters({
      gender: "",
      insuranceProvider: "",
    })
    if (clinicId) {
      searchPatients(clinicId, searchTerm)
    }
  }

  const paginatedPatients = patients.slice((page - 1) * patientsPerPage, page * patientsPerPage)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search patients by name, email, or phone..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
        <Button variant="outline" onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}>
          Advanced Search
        </Button>
        <Link href="/dashboard/patients/new">
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </Link>
      </div>

      {showAdvancedSearch && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Gender</label>
                <Select value={filters.gender} onValueChange={(value) => handleFilterChange("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any gender</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Insurance Provider</label>
                <Input
                  type="text"
                  placeholder="Insurance provider name"
                  value={filters.insuranceProvider}
                  onChange={(e) => handleFilterChange("insuranceProvider", e.target.value)}
                />
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={applyFilters} className="flex-1">
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={resetFilters}>
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lastName">Last Name</SelectItem>
              <SelectItem value="firstName">First Name</SelectItem>
              <SelectItem value="dateOfBirth">Date of Birth</SelectItem>
              <SelectItem value="updatedAt">Last Updated</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={handleSortDirectionChange}>
            {sortDirection === "asc" ? "↑" : "↓"}
          </Button>
        </div>
        <div className="text-sm text-gray-500">
          {patients.length > 0
            ? `Showing ${paginatedPatients.length} of ${patients.length} patients`
            : "No patients found"}
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {patients.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No patients found. Try a different search term or add a new patient.</p>
            </div>
          ) : (
            <>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Date of Birth</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell>
                          <div className="font-medium">
                            {patient.lastName}, {patient.firstName}
                          </div>
                          <div className="text-sm text-gray-500 capitalize">{patient.gender}</div>
                        </TableCell>
                        <TableCell>{patient.dateOfBirth}</TableCell>
                        <TableCell>
                          <div>{patient.email}</div>
                          <div className="text-sm text-gray-500">{patient.phone}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Link href={`/dashboard/patients/${patient.id}`}>
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </Link>
                            <Link href={`/dashboard/patients/${patient.id}/edit`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </Link>
                            <Link href={`/dashboard/appointments/new?patientId=${patient.id}`}>
                              <Button variant="ghost" size="sm">
                                <Calendar className="h-4 w-4 mr-1" />
                                Book
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
