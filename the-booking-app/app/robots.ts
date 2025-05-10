import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/api/", "/admin/", "/_next/", "/login", "/signup"],
    },
    sitemap: "https://thebookinglink.com/sitemap.xml",
  }
}
