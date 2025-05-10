"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { GA_MEASUREMENT_ID, pageview } from "@/lib/analytics"
import Script from "next/script"

export function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return

    // Track page view with current URL
    const url = pathname + window.location.search
    pageview(url)
  }, [pathname])

  if (!GA_MEASUREMENT_ID) return null

  return (
    <>
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              cookie_flags: 'SameSite=None;Secure'
            });
          `,
        }}
      />
    </>
  )
}
