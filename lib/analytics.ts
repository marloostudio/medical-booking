// Google Analytics measurement ID
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

// Log page view
export const pageview = (url: string, title?: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: title,
    })
  }
}

// Track page view (alias for pageview for backward compatibility)
export const trackPageView = (url: string, title?: string) => {
  pageview(url, title)
}

// Log event
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Track user
export const setUser = (userId: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("set", { user_id: userId })
  }
}

// Track UTM parameters
export const trackUtm = () => {
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search)
    const utmSource = urlParams.get("utm_source")
    const utmMedium = urlParams.get("utm_medium")
    const utmCampaign = urlParams.get("utm_campaign")
    const utmTerm = urlParams.get("utm_term")
    const utmContent = urlParams.get("utm_content")

    if (utmSource || utmMedium || utmCampaign || utmTerm || utmContent) {
      const utmData: Record<string, string> = {}

      if (utmSource) utmData.utm_source = utmSource
      if (utmMedium) utmData.utm_medium = utmMedium
      if (utmCampaign) utmData.utm_campaign = utmCampaign
      if (utmTerm) utmData.utm_term = utmTerm
      if (utmContent) utmData.utm_content = utmContent

      // Store UTM parameters in localStorage for future use
      localStorage.setItem("utm_data", JSON.stringify(utmData))

      // Send UTM data to Google Analytics
      if (window.gtag) {
        window.gtag("event", "utm_tracking", {
          ...utmData,
        })
      }
    }
  }
}
