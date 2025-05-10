"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"

// Remove useSearchParams and accept tab as a prop
export function SettingsContent({ tab = "general" }: { tab?: string }) {
  const [activeTab, setActiveTab] = useState(tab)
  const router = useRouter()
  const pathname = usePathname()

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab)
    router.push(`${pathname}?tab=${newTab}`)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="flex border-b mb-6">
        <button
          onClick={() => handleTabChange("general")}
          className={`px-4 py-2 ${activeTab === "general" ? "border-b-2 border-blue-500 text-blue-600" : ""}`}
        >
          General
        </button>
        <button
          onClick={() => handleTabChange("profile")}
          className={`px-4 py-2 ${activeTab === "profile" ? "border-b-2 border-blue-500 text-blue-600" : ""}`}
        >
          Profile
        </button>
        <button
          onClick={() => handleTabChange("notifications")}
          className={`px-4 py-2 ${activeTab === "notifications" ? "border-b-2 border-blue-500 text-blue-600" : ""}`}
        >
          Notifications
        </button>
        <button
          onClick={() => handleTabChange("security")}
          className={`px-4 py-2 ${activeTab === "security" ? "border-b-2 border-blue-500 text-blue-600" : ""}`}
        >
          Security
        </button>
      </div>

      <div className="mt-6">
        {activeTab === "general" && <GeneralSettings />}
        {activeTab === "profile" && <ProfileSettings />}
        {activeTab === "notifications" && <NotificationSettings />}
        {activeTab === "security" && <SecuritySettings />}
      </div>
    </div>
  )
}

function GeneralSettings() {
  return <div>General settings content...</div>
}

function ProfileSettings() {
  return <div>Profile settings content...</div>
}

function NotificationSettings() {
  return <div>Notification settings content...</div>
}

function SecuritySettings() {
  return <div>Security settings content...</div>
}
