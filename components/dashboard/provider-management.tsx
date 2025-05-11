"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { User, Phone, Mail, Calendar, Plus, Edit, Trash2, Save, X, AlertCircle } from "lucide-react"
import { auditService } from "@/services/audit-service"
import { useSession } from "next-auth/react"

interface Provider {
  id: string
  firstName: string
  lastName: string
  title: string
  specialties: string[]
  email: string
  phone: string
  bio: string
  availability: {
    monday: { available: boolean; slots: { start: string; end: string }[] }
    tuesday: { available: boolean; slots: { start: string; end: string }[] }
    wednesday: { available: boolean; slots: { start: string; end: string }[] }
    thursday: { available: boolean; slots: { start: string; end: string }[] }
    friday: { available: boolean; slots: { start: string; end: string }[] }
    saturday: { available: boolean; slots: { start: string; end: string }[] }
    sunday: { available: boolean; slots: { start: string; end: string }[] }
  }
  createdAt: any
  updatedAt: any
}

const emptyProvider: Omit<Provider, "id" | "createdAt" | "updatedAt"> = {
  firstName: "",
  lastName: "",
  title: "",
  specialties: [],
  email: "",
  phone: "",
  bio: "",
  availability: {
    monday: { available: true, slots: [{ start: "09:00", end: "17:00" }] },
    tuesday: { available: true, slots: [{ start: "09:00", end: "17:00" }] },
    wednesday: { available: true, slots: [{ start: "09:00", end: "17:00" }] },
    thursday: { available: true, slots: [{ start: "09:00", end: "17:00" }] },
    friday: { available: true, slots: [{ start: "09:00", end: "17:00" }] },
    saturday: { available: false, slots: [{ start: "10:00", end: "14:00" }] },
    sunday: { available: false, slots: [{ start: "10:00", end: "14:00" }] },
  },
}

export default function ProviderManagement() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const [providers, setProviders] = useState<Provider[]>([])
  const [clinicId, setClinicId] = useState("")
  const [userId, setUserId] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [showForm, setShowForm] = useState(false)
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null)
  const [formData, setFormData] = useState<Omit<Provider, "id" | "createdAt" | "updatedAt">>(emptyProvider)
  const [newSpecialty, setNewSpecialty] = useState("")
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  useEffect(() => {
    // First check if we have a session from NextAuth
    if (status === "loading") return

    if (session) {
      // If we have a session, use that
      const userClinicId = session.user?.clinicId as string
      const userId = session.user?.id as string

      if (!userClinicId) {
        setError("No clinic associated with this user")
        setLoading(false)
        return
      }

      setClinicId(userClinicId)
      setUserId(userId)

      // Fetch providers
      fetchProviders(userClinicId)
      return
    }

    // Fallback to Firebase auth if NextAuth session is not available
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
        setUserId(user.uid)

        // Fetch providers
        await fetchProviders(userClinicId)
      } catch (error: any) {
        console.error("Error loading providers:", error)
        setError(error.message || "Failed to load providers")
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router, session, status])

  const fetchProviders = async (clinicId: string) => {
    try {
      setLoading(true)
      const providersRef = collection(db, "clinics", clinicId, "providers")
      const providersSnapshot = await getDocs(providersRef)

      const providersData: Provider[] = []

      providersSnapshot.forEach((doc) => {
        providersData.push({
          id: doc.id,
          ...doc.data(),
        } as Provider)
      })

      setProviders(providersData)
    } catch (error: any) {
      console.error("Error fetching providers:", error)
      setError(error.message || "Failed to fetch providers")
    } finally {
      setLoading(false)
    }
  }

  // Rest of the component code remains the same...

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const addSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData((prev) => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()],
      }))
      setNewSpecialty("")
    }
  }

  const removeSpecialty = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((s) => s !== specialty),
    }))
  }

  const handleAvailabilityChange = (day: string, field: "available", value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day as keyof typeof prev.availability],
          [field]: value,
        },
      },
    }))
  }

  const handleSlotChange = (day: string, index: number, field: "start" | "end", value: string) => {
    setFormData((prev) => {
      const dayAvailability = prev.availability[day as keyof typeof prev.availability]
      const updatedSlots = [...dayAvailability.slots]
      updatedSlots[index] = { ...updatedSlots[index], [field]: value }

      return {
        ...prev,
        availability: {
          ...prev.availability,
          [day]: {
            ...dayAvailability,
            slots: updatedSlots,
          },
        },
      }
    })
  }

  const addSlot = (day: string) => {
    setFormData((prev) => {
      const dayAvailability = prev.availability[day as keyof typeof prev.availability]
      const lastSlot = dayAvailability.slots[dayAvailability.slots.length - 1]

      return {
        ...prev,
        availability: {
          ...prev.availability,
          [day]: {
            ...dayAvailability,
            slots: [...dayAvailability.slots, { start: lastSlot.end, end: "18:00" }],
          },
        },
      }
    })
  }

  const removeSlot = (day: string, index: number) => {
    setFormData((prev) => {
      const dayAvailability = prev.availability[day as keyof typeof prev.availability]

      if (dayAvailability.slots.length <= 1) {
        return prev
      }

      const updatedSlots = dayAvailability.slots.filter((_, i) => i !== index)

      return {
        ...prev,
        availability: {
          ...prev.availability,
          [day]: {
            ...dayAvailability,
            slots: updatedSlots,
          },
        },
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      if (!clinicId) {
        throw new Error("No clinic ID found")
      }

      // Validate form data
      if (!formData.firstName || !formData.lastName || !formData.title) {
        throw new Error("Please fill in all required fields")
      }

      if (editingProvider) {
        // Update existing provider
        await updateDoc(doc(db, "clinics", clinicId, "providers", editingProvider.id), {
          ...formData,
          updatedAt: serverTimestamp(),
        })

        // Log the update
        await auditService.logAction(clinicId, {
          userId,
          action: "update",
          resource: "provider",
          details: `Updated provider: ${formData.firstName} ${formData.lastName}`,
          ipAddress: "0.0.0.0",
          userAgent: navigator.userAgent,
        })

        setSuccess(`Provider ${formData.firstName} ${formData.lastName} updated successfully`)
      } else {
        // Add new provider
        await addDoc(collection(db, "clinics", clinicId, "providers"), {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })

        // Log the creation
        await auditService.logAction(clinicId, {
          userId,
          action: "create",
          resource: "provider",
          details: `Created provider: ${formData.firstName} ${formData.lastName}`,
          ipAddress: "0.0.0.0",
          userAgent: navigator.userAgent,
        })

        setSuccess(`Provider ${formData.firstName} ${formData.lastName} added successfully`)
      }

      // Refresh providers list
      await fetchProviders(clinicId)

      // Reset form
      setFormData(emptyProvider)
      setEditingProvider(null)
      setShowForm(false)

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    } catch (error: any) {
      console.error("Error saving provider:", error)
      setError(error.message || "Failed to save provider")
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (provider: Provider) => {
    setEditingProvider(provider)
    setFormData({
      firstName: provider.firstName,
      lastName: provider.lastName,
      title: provider.title,
      specialties: provider.specialties,
      email: provider.email,
      phone: provider.phone,
      bio: provider.bio,
      availability: provider.availability,
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (providerId: string) => {
    if (confirmDelete !== providerId) {
      setConfirmDelete(providerId)
      return
    }

    try {
      await deleteDoc(doc(db, "clinics", clinicId, "providers", providerId))

      // Log the deletion
      await auditService.logAction(clinicId, {
        userId,
        action: "delete",
        resource: "provider",
        details: `Deleted provider ID: ${providerId}`,
        ipAddress: "0.0.0.0",
        userAgent: navigator.userAgent,
      })

      setSuccess("Provider deleted successfully")

      // Refresh providers list
      await fetchProviders(clinicId)

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    } catch (error: any) {
      console.error("Error deleting provider:", error)
      setError(error.message || "Failed to delete provider")
    } finally {
      setConfirmDelete(null)
    }
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingProvider(null)
    setFormData(emptyProvider)
    setError("")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Medical Providers</h2>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Provider
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{success}</div>}

      {showForm && (
        <div className="mb-8 border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">{editingProvider ? "Edit Provider" : "Add New Provider"}</h3>
            <button
              type="button"
              onClick={cancelForm}
              className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <X className="mr-1 h-4 w-4" />
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title/Position *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Cardiologist, Nurse Practitioner"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio/Description
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                value={formData.bio}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Provider's background, education, specializations, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialties</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {specialty}
                    <button
                      type="button"
                      onClick={() => removeSpecialty(specialty)}
                      className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-200 text-blue-500 hover:bg-blue-300"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Add a specialty"
                />
                <button
                  type="button"
                  onClick={addSpecialty}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Availability</h3>
              <div className="space-y-4">
                {Object.entries(formData.availability).map(([day, { available, slots }]) => (
                  <div key={day} className="border border-gray-200 rounded-md p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={available}
                          onChange={(e) => handleAvailabilityChange(day, "available", e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          id={`${day}-available`}
                        />
                        <label
                          htmlFor={`${day}-available`}
                          className="ml-2 text-sm font-medium text-gray-700 capitalize"
                        >
                          {day}
                        </label>
                      </div>
                      {available && (
                        <button
                          type="button"
                          onClick={() => addSlot(day)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Plus className="mr-1 h-3 w-3" />
                          Add Time Slot
                        </button>
                      )}
                    </div>

                    {available && (
                      <div className="space-y-2 pl-6">
                        {slots.map((slot, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="time"
                              value={slot.start}
                              onChange={(e) => handleSlotChange(day, index, "start", e.target.value)}
                              className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm w-32"
                            />
                            <span>to</span>
                            <input
                              type="time"
                              value={slot.end}
                              onChange={(e) => handleSlotChange(day, index, "end", e.target.value)}
                              className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm w-32"
                            />
                            {slots.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeSlot(day, index)}
                                className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-100 text-red-500 hover:bg-red-200"
                              >
                                &times;
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : editingProvider ? "Update Provider" : "Add Provider"}
              </button>
            </div>
          </form>
        </div>
      )}

      {providers.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No providers</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new provider.</p>
          {!showForm && (
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                Add Provider
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider) => (
            <div key={provider.id} className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
              <div className="px-4 py-5 sm:px-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {provider.firstName} {provider.lastName}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{provider.title}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(provider)}
                      className="inline-flex items-center p-1.5 border border-transparent rounded-full text-blue-600 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(provider.id)}
                      className={`inline-flex items-center p-1.5 border border-transparent rounded-full ${
                        confirmDelete === provider.id
                          ? "text-white bg-red-600 hover:bg-red-700"
                          : "text-red-600 hover:bg-red-100"
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {provider.specialties.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {provider.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="px-4 py-4 sm:px-6">
                {provider.email && (
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    <span>{provider.email}</span>
                  </div>
                )}
                {provider.phone && (
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Phone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    <span>{provider.phone}</span>
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  <span>
                    Available on{" "}
                    {Object.entries(provider.availability)
                      .filter(([_, { available }]) => available)
                      .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1))
                      .join(", ")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
