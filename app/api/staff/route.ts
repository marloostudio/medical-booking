import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clinicId = searchParams.get("clinicId")
    const appointmentTypeId = searchParams.get("appointmentTypeId")

    if (!clinicId) {
      return NextResponse.json({ error: "Clinic ID is required" }, { status: 400 })
    }

    // Fetch staff members from Firestore
    const staffRef = collection(db, `clinics/${clinicId}/staff`)
    const staffQuery = staffRef

    // If appointmentTypeId is provided, we could filter staff by capability
    // This would require additional data structure to map staff to appointment types

    const snapshot = await getDocs(staffQuery)

    const staffMembers = []
    snapshot.forEach((doc) => {
      const data = doc.data()
      staffMembers.push({
        id: doc.id,
        name: data.name,
        role: data.role,
        specialties: data.specialties || [],
        imageUrl: data.imageUrl,
      })
    })

    return NextResponse.json({ staffMembers })
  } catch (error) {
    console.error("Error fetching staff members:", error)
    return NextResponse.json({ error: "Failed to fetch staff members" }, { status: 500 })
  }
}
