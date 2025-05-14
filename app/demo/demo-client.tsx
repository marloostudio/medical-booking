"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export function DemoClient({ initialView }: { initialView: string }) {
  const [view, setView] = useState(initialView)
  const router = useRouter()
  const pathname = usePathname()

  const handleViewChange = (newView: string) => {
    setView(newView)
    router.push(`${pathname}?view=${newView}`)
  }

  return (
    <div>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => handleViewChange("patient")}
          className={`px-4 py-2 ${view === "patient" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Patient View
        </button>
        <button
          onClick={() => handleViewChange("doctor")}
          className={`px-4 py-2 ${view === "doctor" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Doctor View
        </button>
        <button
          onClick={() => handleViewChange("admin")}
          className={`px-4 py-2 ${view === "admin" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Admin View
        </button>
      </div>

      <div className="mt-4">
        {view === "patient" && <PatientDemo />}
        {view === "doctor" && <DoctorDemo />}
        {view === "admin" && <AdminDemo />}
      </div>
    </div>
  )
}

function PatientDemo() {
  return <div>Patient demo content...</div>
}

function DoctorDemo() {
  return <div>Doctor demo content...</div>
}

function AdminDemo() {
  return <div>Admin demo content...</div>
}
