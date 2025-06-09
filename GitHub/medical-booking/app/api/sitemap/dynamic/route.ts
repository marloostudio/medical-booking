import { NextResponse } from "next/server"
import { getCollection } from "@/lib/firebase-admin"

// Use Node.js runtime instead of Edge
export const runtime = "nodejs"

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thebookinglink.com"
    const currentDate = new Date().toISOString()

    // Create a basic sitemap structure with static pages
    const sitemap = [
      {
        loc: baseUrl,
        lastmod: currentDate,
        changefreq: "daily",
        priority: 1.0,
      },
      {
        loc: `${baseUrl}/about`,
        lastmod: currentDate,
        changefreq: "monthly",
        priority: 0.8,
      },
      {
        loc: `${baseUrl}/contact`,
        lastmod: currentDate,
        changefreq: "monthly",
        priority: 0.8,
      },
      {
        loc: `${baseUrl}/pricing`,
        lastmod: currentDate,
        changefreq: "monthly",
        priority: 0.9,
      },
    ]

    try {
      // Safely get clinic data
      const clinicsCollection = getCollection("clinics")

      if (clinicsCollection) {
        const snapshot = await clinicsCollection.where("isPublic", "==", true).get()

        // Add clinic pages to sitemap
        snapshot.forEach((doc) => {
          const clinicId = doc.id
          sitemap.push({
            loc: `${baseUrl}/booking/${clinicId}`,
            lastmod: currentDate,
            changefreq: "weekly",
            priority: 0.7,
          })
        })
      }
    } catch (firestoreError) {
      console.error("Error fetching Firestore data for sitemap:", firestoreError)
      // Continue with the static sitemap even if Firestore fails
    }

    return NextResponse.json(sitemap)
  } catch (error) {
    console.error("Error generating dynamic sitemap:", error)
    return NextResponse.json({ error: "Failed to generate sitemap" }, { status: 500 })
  }
}
