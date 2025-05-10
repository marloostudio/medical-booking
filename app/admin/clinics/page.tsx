"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  addDoc,
} from "firebase/firestore"
import { Plus, Edit, Trash2, CheckCircle, XCircle } from "lucide-react"

export default function AdminClinicsPage() {
  const router = useRouter()
  const [clinics, setClinics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    ownerEmail: "",
    ownerFirstName: "",
    ownerLastName: "",
  })

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
          // User is SuperAdmin, fetch clinics
          fetchClinics()
        }
      } catch (err) {
        console.error("Error checking admin status:", err)
        setError("Failed to verify admin privileges")
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [router])

  const fetchClinics = async () => {
    try {
      const clinicsSnapshot = await getDocs(collection(db, "clinics"))
      const clinicsList = []

      for (const clinicDoc of clinicsSnapshot.docs) {
        const clinicData = clinicDoc.data()

        // Fetch owner info
        let ownerInfo = { name: "No owner assigned" }

        if (clinicData.ownerId) {
          const ownerDoc = await getDocs(query(collection(db, "users"), where("uid", "==", clinicData.ownerId)))

          if (!ownerDoc.empty) {
            const userData = ownerDoc.docs[0].data()
            ownerInfo = {
              name: `${userData.firstName} ${userData.lastName}`,
              email: userData.email,
            }
          }
        }

        clinicsList.push({
          id: clinicDoc.id,
          ...clinicData,
          owner: ownerInfo,
        })
      }

      setClinics(clinicsList)
    } catch (err) {
      console.error("Error fetching clinics:", err)
      setError("Failed to load clinics")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddClinic = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      // First, check if user with email exists
      const userSnapshot = await getDocs(query(collection(db, "users"), where("email", "==", formData.ownerEmail)))

      let ownerId

      if (userSnapshot.empty) {
        // Create a new user record
        const newUser = await addDoc(collection(db, "users"), {
          firstName: formData.ownerFirstName,
          lastName: formData.ownerLastName,
          email: formData.ownerEmail,
          role: "CLINIC_OWNER",
          createdAt: serverTimestamp(),
          isEmailVerified: false,
          createdBy: auth.currentUser?.uid,
        })

        ownerId = newUser.id
      } else {
        // Use existing user
        ownerId = userSnapshot.docs[0].id

        // Update role to CLINIC_OWNER if it's not already
        if (userSnapshot.docs[0].data().role !== "CLINIC_OWNER") {
          await updateDoc(doc(db, "users", ownerId), {
            role: "CLINIC_OWNER",
          })
        }
      }

      // Create the clinic
      await addDoc(collection(db, "clinics"), {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        ownerId,
        createdAt: serverTimestamp(),
        isActive: true,
        verificationStatus: "approved",
        createdBy: auth.currentUser?.uid,
      })

      // Reset form and refresh
      setFormData({
        name: "",
        address: "",
        phone: "",
        ownerEmail: "",
        ownerFirstName: "",
        ownerLastName: "",
      })

      setShowAddForm(false)
      fetchClinics()
    } catch (err) {
      console.error("Error adding clinic:", err)
      setError("Failed to add clinic")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (clinicId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "clinics", clinicId), {
        isActive: !currentStatus,
      })

      // Refresh the list
      fetchClinics()
    } catch (err) {
      console.error("Error updating clinic status:", err)
      setError("Failed to update clinic status")
    }
  }

  const handleDeleteClinic = async (clinicId: string) => {
    if (!window.confirm("Are you sure you want to delete this clinic? This action cannot be undone.")) {
      return
    }

    try {
      await deleteDoc(doc(db, "clinics", clinicId))

      // Refresh the list
      fetchClinics()
    } catch (err) {
      console.error("Error deleting clinic:", err)
      setError("Failed to delete clinic")
    }
  }

  if (loading && clinics.length === 0) {
    return <div className="p-8">Loading clinics...</div>
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Clinics</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          {showAddForm ? "Cancel" : "Add Clinic"}
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

      {showAddForm && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Add New Clinic</h2>
          <form onSubmit={handleAddClinic} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Clinic Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="ownerFirstName" className="block text-sm font-medium text-gray-700">
                  Owner First Name
                </label>
                <input
                  type="text"
                  id="ownerFirstName"
                  name="ownerFirstName"
                  value={formData.ownerFirstName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="ownerLastName" className="block text-sm font-medium text-gray-700">
                  Owner Last Name
                </label>
                <input
                  type="text"
                  id="ownerLastName"
                  name="ownerLastName"
                  value={formData.ownerLastName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="ownerEmail" className="block text-sm font-medium text-gray-700">
                  Owner Email
                </label>
                <input
                  type="email"
                  id="ownerEmail"
                  name="ownerEmail"
                  value={formData.ownerEmail}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
              >
                {loading ? "Creating..." : "Create Clinic"}
              </button>
            </div>
          </form>
        </div>
      )}

      {clinics.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">No clinics found</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-2">Click on a clinic name to view detailed information</p>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Clinic
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Owner
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
                {clinics.map((clinic) => (
                  <tr key={clinic.id}>
                    <td
                      className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-gray-50"
                      onClick={() => router.push(`/admin/clinics/view/${clinic.id}`)}
                    >
                      <div className="text-sm font-medium text-gray-900">{clinic.name}</div>
                      <div className="text-sm text-gray-500">{clinic.address}</div>
                      <div className="text-sm text-gray-500">{clinic.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{clinic.owner.name}</div>
                      {clinic.owner.email && <div className="text-sm text-gray-500">{clinic.owner.email}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(clinic.id, clinic.isActive)}
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
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => router.push(`/admin/clinics/edit/${clinic.id}`)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeleteClinic(clinic.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
