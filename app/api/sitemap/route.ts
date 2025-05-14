import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"

const EXTERNAL_DATA_URL = "https://thebookinglink.com"

export async function GET() {
  try {
    // Fetch public clinic pages
    const clinicsRef = collection(db, "clinics")
    const publicClinicsQuery = query(clinicsRef, where("isPublic", "==", true))
    const clinicsSnapshot = await getDocs(publicClinicsQuery)

    const clinicPages: string[] = []
    clinicsSnapshot.forEach((doc) => {
      clinicPages.push(`/booking/${doc.id}`)
    })

    // Generate the XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <!-- Static pages -->
      <url>
        <loc>${EXTERNAL_DATA_URL}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>${EXTERNAL_DATA_URL}/about</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
      </url>
      <url>
        <loc>${EXTERNAL_DATA_URL}/contact</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
      </url>
      <url>
        <loc>${EXTERNAL_DATA_URL}/pricing</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${EXTERNAL_DATA_URL}/login</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
      </url>
      <url>
        <loc>${EXTERNAL_DATA_URL}/signup</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
      </url>
      <url>
        <loc>${EXTERNAL_DATA_URL}/dashboard/appointments</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
      </url>
      <url>
        <loc>${EXTERNAL_DATA_URL}/dashboard/patients</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
      </url>
      
      <!-- Dynamic pages -->
      ${clinicPages
        .map((page) => {
          return `
        <url>
            <loc>${EXTERNAL_DATA_URL}${page}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.7</priority>
        </url>
      `
        })
        .join("")}
    </urlset>`

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "text/xml",
      },
    })
  } catch (error) {
    console.error("Error generating sitemap:", error)
    return NextResponse.json({ error: "Failed to generate sitemap" }, { status: 500 })
  }
}
