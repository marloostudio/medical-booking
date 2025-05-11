"use client"

import { useEffect, useState } from "react"
import { PageTemplate } from "@/components/dashboard/page-template"
import { AddPatientForm } from "@/components/dashboard/add-patient-form"
import { useToast } from "@/components/ui/use-toast"
import { getAuth } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Skeleton } from "@/components/ui/skeleton"

export default function NewPatientPage() {
  const [clinicId, setClinicId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchClinicId = async () => {
      try {
        const auth = getAuth()
        const user = auth.currentUser

        if (!user) {
          setError("You must be logged in to add patients")
          setLoading(false)
          return
        }

        // Get user document to find their clinic ID
        const userDoc = await getDoc(doc(db, "users", user.uid))

        if (!userDoc.exists()) {
          setError("User profile not found")
          setLoading(false)
          return
        }

        const userData = userDoc.data()
        if (!userData.clinicId) {
          // Try to use the default clinic ID from environment variables
          const defaultClinicId = process.env.NEXT_PUBLIC_DEFAULT_CLINIC_ID || process.env.DEFAULT_CLINIC_ID

          if (defaultClinicId) {
            setClinicId(defaultClinicId)
          } else {
            setError("No clinic associated with this account")
          }
          setLoading(false)
          return
        }

        setClinicId(userData.clinicId)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching clinic ID:", err)
        setError("Failed to load clinic information")
        setLoading(false)
        toast({
          title: "Error",
          description: "Failed to load clinic information. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchClinicId()
  }, [toast])

  if (loading) {
    return (
      <PageTemplate title="New Patient" description="Add a new patient to your clinic">
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </PageTemplate>
    )
  }

  if (error) {
    return (
      <PageTemplate title="New Patient" description="Add a new patient to your clinic">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      </PageTemplate>
    )
  }

  if (!clinicId) {
    return (
      <PageTemplate title="New Patient" description="Add a new patient to your clinic">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
          <p className="font-medium">No Clinic Found</p>
          <p>You need to be associated with a clinic to add patients.</p>
        </div>
      </PageTemplate>
    )
  }

  return (
    <PageTemplate title="New Patient" description="Add a new patient to your clinic">
      <AddPatientForm clinicId={clinicId} />
    </PageTemplate>
  )
}
