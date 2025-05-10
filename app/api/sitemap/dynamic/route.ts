import { NextResponse } from "next/server"
import { getFirestore } from "firebase-admin/firestore"
import { initializeFirebaseAdmin } from "@/lib/firebase-admin"

export async function GET() {
  try {
    // Initialize Firebase Admin if not already initialized
    initializeFirebaseAdmin()
    const db = getFirestore()

    // Fetch public clinic data
    const clinicsSnapshot = await db.collection("clinics").where("isPublic", "==", true).get()

    const baseUrl = "https://thebookinglink.com"
    const currentDate = new Date().toISOString()

    // Generate sitemap entries for public clinics
    const entries = clinicsSnapshot.docs.map((doc) => {
      const clinicId = doc.id
      return {
        loc: `${baseUrl}/booking/${clinicId}`,
        lastmod: currentDate,
        changefreq: "weekly",
        priority: 0.7,
      }
    })

    // Return the entries as JSON
    return NextResponse.json(entries)
  } catch (error) {
    console.error("Error generating dynamic sitemap entries:", error)
    return NextResponse.json({ error: "Failed to generate sitemap entries" }, { status: 500 })
  }
}
