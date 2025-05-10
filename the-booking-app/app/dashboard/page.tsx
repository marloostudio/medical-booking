"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { EmailVerificationAlert } from "@/components/auth/email-verification-alert"

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{
    email: string
    isEmailVerified: boolean
    firstName: string
    lastName: string
    clinicName: string
  } | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))

          if (userDoc.exists()) {
            const userData = userDoc.data()

            // Get clinic data
            const clinicDoc = await getDoc(doc(db, "clinics", userData.clinicId))
            const clinicName = clinicDoc.exists() ? clinicDoc.data().name : "Your Clinic"

            setUser({
              email: firebaseUser.email || "",
              isEmailVerified: firebaseUser.emailVerified,
              firstName: userData.firstName || "",
              lastName: userData.lastName || "",
              clinicName,
            })
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      } else {
        // No user is signed in, redirect to login
        router.push("/login")
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>
  }

  if (!user) {
    return <div className="p-8">Please sign in to access the dashboard</div>
  }

  return (
    <div className="p-8">
      {user && !user.isEmailVerified && <EmailVerificationAlert isVerified={user.isEmailVerified} email={user.email} />}

      <h1 className="text-2xl font-bold mb-4">Welcome, {user.firstName}!</h1>
      <h2 className="text-xl mb-6">{user.clinicName} Dashboard</h2>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Appointments</h2>
          <p>Manage your appointments</p>
          <a href="/dashboard/appointments" className="text-blue-600 hover:underline mt-2 inline-block">
            View Appointments
          </a>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Settings</h2>
          <p>Update your account settings</p>
          <a href="/dashboard/settings" className="text-blue-600 hover:underline mt-2 inline-block">
            View Settings
          </a>
        </div>
      </div>
    </div>
  )
}
