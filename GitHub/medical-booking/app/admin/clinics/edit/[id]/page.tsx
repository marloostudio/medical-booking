"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore"
import { ArrowLeft, Save } from "lucide-react"

export default function EditClinicPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const clinicId = params.id
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    ownerEmail: "",
    ownerFirstName: "",
    ownerLastName: "",
    isActive: true,
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
      const clinicDoc = await getDoc(doc(db, "clinics", clinicId))

      if (!clinicDoc.exists()) {
        setError("Clinic not found")
        return
      }

      const clinicData = clinicDoc.data()

      // Get owner data if available
      let ownerData = {
        firstName: "",
        lastName: "",
        email: "",
      }

      if (clinicData.ownerId) {
        const ownerDoc = await getDoc(doc(db, "users", clinicData.ownerId))

        if (ownerDoc.exists()) {
          const userData = ownerDoc.data()
          ownerData = {
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
          }
        }
      }

      setFormData({
        name: clinicData.name || "",
        address: clinicData.address || "",
        phone: clinicData.phone || "",
        ownerEmail: ownerData.email,
        ownerFirstName: ownerData.firstName,
        ownerLastName: ownerData.lastName,
        isActive: clinicData.isActive !== false, // Default to true if not set
      })
    } catch (err) {
      console.error("Error fetching clinic data:", err)
      setError("Failed to load clinic data")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess(false)

    try {
      // Update clinic data
      await updateDoc(doc(db, "clinics", clinicId), {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        isActive: formData.isActive,
        updatedAt: new Date(),
      })

      // Update owner if we have owner details
      if (formData.ownerEmail) {
        // Find if user exists with that email
        const userQuery = query(collection(db, "users"), where("email", "==", formData.ownerEmail))
        const userSnapshot = await getDocs(userQuery)

        if (!userSnapshot.empty) {
          const userId = userSnapshot.docs[0].id

          // Update user data
          await updateDoc(doc(db, "users", userId), {
            firstName: formData.ownerFirstName,
            lastName: formData.ownerLastName,
            role: "CLINIC_OWNER",
            updatedAt: new Date(),
          })

          // Update clinic with owner ID
          await updateDoc(doc(db, "clinics", clinicId), {
            ownerId: userId,
          })
        }
      }

      setSuccess(true)
    } catch (err) {
      console.error("Error updating clinic:", err)
      setError("Failed to update clinic")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading clinic data...</div>
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <button
          onClick={() => router.push("/admin/clinics")}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Clinics
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6">Edit Clinic</h1>

      {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Clinic updated successfully!
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit} className="space-y-4">
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Clinic Active
            </label>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
