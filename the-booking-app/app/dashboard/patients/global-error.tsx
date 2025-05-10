"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function PatientsGlobalError() {
  const router = useRouter()

  useEffect(() => {
    router.push("/dashboard")
  }, [router])

  return null
}
