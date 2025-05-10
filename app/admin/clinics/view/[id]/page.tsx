"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { collection, doc, getDoc, getDocs, query, where, orderBy, limit, type DocumentData } from "firebase/firestore"
import {
  ArrowLeft,
  Building,
  Phone,
  MapPin,
  Mail,
  User,
  Calendar,
  Users,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
} from "lucide-react"

interface ClinicData {
  id: string
  name: string
  address: string
  phone: string
  email?: string
  website?: string
  description?: string
  specialties?: string[]
  isActive: boolean
  verificationStatus: string
  createdAt: any
  updatedAt?: any
  ownerId?: string
  owner?: {
    id: string
    name: string
    email: string
    phone?: string
  }
  staffCount?: number
  appointmentCount?: number
  patientCount?: number
  settings?: {
    allowOnlineBooking: boolean
    appointmentBuffer: number
    defaultAppointmentDuration: number
    workingHours?: {
      [key: string]: {
        start: string
        end: string
        isOpen: boolean
      }
    }
  }
}

export default function ClinicDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const clinicId = params.id
  const [clinic, setClinic] = useState<ClinicData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [recentStaff, setRecentStaff] = useState<DocumentData[]>([])
  const [recentAppointments, setRecentAppointments] = useState<DocumentData[]>([])

  // Check if user is SuperAdmin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!auth.currentUser) {
        router.push("/login")
        return
      }

      try {
        const userDoc = await getDocs(
          query(
            collection(db, "users"),
            where("email", "==", auth.currentUser.email),
            where("role", "==", "SUPER_ADMIN"),
          ),
        )

        if (userDoc.empty) {
          router.push("/dashboard")
        } else {
          // User is SuperAdmin, fetch clinic data
          fetchClinicData()
        }
      } catch (err) {
        console.error("Error checking admin status:", err)
        setError("Failed to verify admin privileges")
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [router, clinicId])

  const fetchClinicData = async () => {
    try {
      // Get clinic document
      const clinicDoc = await getDoc(doc(db, "clinics", clinicId))

      if (!clinicDoc.exists()) {
        setError("Clinic not found")
        setLoading(false)
        return
      }

      const clinicData = clinicDoc.data()

      // Get owner data if available
      let ownerData = null
      if (clinicData.ownerId) {
        const ownerDoc = await getDoc(doc(db, "users", clinicData.ownerId))

        if (ownerDoc.exists()) {
          const userData = ownerDoc.data()
          ownerData = {
            id: ownerDoc.id,
            name: `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
            email: userData.email || "",
            phone: userData.phone || "",
          }
        }
      }

      // Get staff count
      const staffQuery = query(collection(db, "users"), where("clinicId", "==", clinicId))
      const staffSnapshot = await getDocs(staffQuery)
      const staffCount = staffSnapshot.size

      // Get recent staff members
      const recentStaffQuery = query(
        collection(db, "users"),
        where("clinicId", "==", clinicId),
        orderBy("createdAt", "desc"),
        limit(5),
      )
      const recentStaffSnapshot = await getDocs(recentStaffQuery)
      const recentStaffData = recentStaffSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setRecentStaff(recentStaffData)

      // Get appointment count
      const appointmentQuery = query(collection(db, "clinics", clinicId, "appointments"))
      const appointmentSnapshot = await getDocs(appointmentQuery)
      const appointmentCount = appointmentSnapshot.size

      // Get recent appointments
      const recentAppointmentsQuery = query(
        collection(db, "clinics", clinicId, "appointments"),
        orderBy("createdAt", "desc"),
        limit(5),
      )
      const recentAppointmentsSnapshot = await getDocs(recentAppointmentsQuery)
      const recentAppointmentsData = recentAppointmentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setRecentAppointments(recentAppointmentsData)

      // Get patient count
      const patientQuery = query(collection(db, "clinics", clinicId, "patients"))
      const patientSnapshot = await getDocs(patientQuery)
      const patientCount = patientSnapshot.size

      // Compile all clinic data
      setClinic({
        id: clinicDoc.id,
        name: clinicData.name || "",
        address: clinicData.address || "",
        phone: clinicData.phone || "",
        email: clinicData.email || "",
        website: clinicData.website || "",
        description: clinicData.description || "",
        specialties: clinicData.specialties || [],
        isActive: clinicData.isActive !== false,
        verificationStatus: clinicData.verificationStatus || "pending",
        createdAt: clinicData.createdAt?.toDate() || new Date(),
        updatedAt: clinicData.updatedAt?.toDate(),
        ownerId: clinicData.ownerId,
        owner: ownerData,
        staffCount,
        appointmentCount,
        patientCount,
        settings: clinicData.settings || {
          allowOnlineBooking: true,
          appointmentBuffer: 15,
          defaultAppointmentDuration: 30,
        },
      })
    } catch (err) {
      console.error("Error fetching clinic data:", err)
      setError("Failed to load clinic data")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading clinic details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => router.push("/admin/clinics")}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Clinics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!clinic) {
    return (
      <div className="p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Clinic Not Found</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>The requested clinic could not be found.</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => router.push("/admin/clinics")}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Clinics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => router.push("/admin/clinics")}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Clinics
        </button>

        <div className="flex space-x-3">
          <button
            onClick={() => router.push(`/admin/clinics/edit/${clinicId}`)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Clinic
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Clinic Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Details and information about the clinic.</p>
          </div>
          <div>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                clinic.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {clinic.isActive ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3 mr-1" />
                  Inactive
                </>
              )}
            </span>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Building className="h-5 w-5 mr-2 text-gray-400" />
                Clinic Name
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{clinic.name}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                Address
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{clinic.address}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Phone className="h-5 w-5 mr-2 text-gray-400" />
                Phone
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{clinic.phone}</dd>
            </div>
            {clinic.email && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-gray-400" />
                  Email
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{clinic.email}</dd>
              </div>
            )}
            {clinic.website && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Website</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <a
                    href={clinic.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {clinic.website}
                  </a>
                </dd>
              </div>
            )}
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                Created At
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(clinic.createdAt)}</dd>
            </div>
            {clinic.updatedAt && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(clinic.updatedAt)}</dd>
              </div>
            )}
            {clinic.description && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{clinic.description}</dd>
              </div>
            )}
            {clinic.specialties && clinic.specialties.length > 0 && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Specialties</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="flex flex-wrap gap-2">
                    {clinic.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Owner Information */}
      {clinic.owner && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <User className="h-5 w-5 mr-2 text-gray-400" />
              Owner Information
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{clinic.owner.name}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{clinic.owner.email}</dd>
              </div>
              {clinic.owner.phone && (
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{clinic.owner.phone}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      )}

      {/* Clinic Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Staff</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{clinic.staffCount}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Appointments</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{clinic.appointmentCount}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Patients</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{clinic.patientCount}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clinic Settings */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <Settings className="h-5 w-5 mr-2 text-gray-400" />
            Clinic Settings
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Online Booking</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    clinic.settings?.allowOnlineBooking ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {clinic.settings?.allowOnlineBooking ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Enabled
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 mr-1" />
                      Disabled
                    </>
                  )}
                </span>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-gray-400" />
                Appointment Buffer
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {clinic.settings?.appointmentBuffer} minutes
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Default Appointment Duration</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {clinic.settings?.defaultAppointmentDuration} minutes
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Recent Staff */}
      {recentStaff.length > 0 && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Staff Members</h3>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {recentStaff.map((staff) => (
                <li key={staff.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {staff.firstName} {staff.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{staff.email}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800`}
                      >
                        {staff.role}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Recent Appointments */}
      {recentAppointments.length > 0 && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Appointments</h3>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {recentAppointments.map((appointment) => (
                <li key={appointment.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.patientName || "Unknown Patient"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.date && formatDate(appointment.date.toDate())}
                      </div>
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          appointment.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : appointment.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {appointment.status || "pending"}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
