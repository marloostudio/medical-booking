"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"

// Remove useSearchParams and accept tab as a prop
export function SystemCheckClient({ initialTab = "environment" }: { initialTab?: string }) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const router = useRouter()
  const pathname = usePathname()

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    router.push(`${pathname}?tab=${tab}`)
  }

  return (
    <div>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => handleTabChange("environment")}
          className={`px-4 py-2 ${activeTab === "environment" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Environment
        </button>
        <button
          onClick={() => handleTabChange("database")}
          className={`px-4 py-2 ${activeTab === "database" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Database
        </button>
        <button
          onClick={() => handleTabChange("services")}
          className={`px-4 py-2 ${activeTab === "services" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Services
        </button>
      </div>

      <div className="mt-4">
        {activeTab === "environment" && <EnvironmentCheck />}
        {activeTab === "database" && <DatabaseCheck />}
        {activeTab === "services" && <ServicesCheck />}
      </div>
    </div>
  )
}

function EnvironmentCheck() {
  return <div>Environment variables check...</div>
}

function DatabaseCheck() {
  return <div>Database connection check...</div>
}

function ServicesCheck() {
  return <div>External services check...</div>
}
