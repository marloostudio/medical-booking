"use client"

import { useEffect } from "react"

export default function CacheBuster() {
  useEffect(() => {
    // Add a meta tag to prevent caching
    const meta = document.createElement("meta")
    meta.httpEquiv = "Cache-Control"
    meta.content = "no-cache, no-store, must-revalidate"
    document.head.appendChild(meta)

    const pragma = document.createElement("meta")
    pragma.httpEquiv = "Pragma"
    pragma.content = "no-cache"
    document.head.appendChild(pragma)

    const expires = document.createElement("meta")
    expires.httpEquiv = "Expires"
    expires.content = "0"
    document.head.appendChild(expires)

    // Force reload assets
    const links = document.querySelectorAll("link[rel='stylesheet']")
    links.forEach((link) => {
      const href = link.getAttribute("href")
      if (href) {
        link.setAttribute("href", `${href}?v=${new Date().getTime()}`)
      }
    })

    const scripts = document.querySelectorAll("script[src]")
    scripts.forEach((script) => {
      const src = script.getAttribute("src")
      if (src) {
        script.setAttribute("src", `${src}?v=${new Date().getTime()}`)
      }
    })
  }, [])

  return null
}
