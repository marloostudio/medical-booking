import type React from "react"
import type { Metadata } from "next"
import { Sidebar } from "@/components/dashboard/sidebar"

export const metadata: Metadata = {
  title: "Dashboard | BookingLink",
  description: "Manage your clinic appointments and patients",
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />
      <div className="flex-1 overflow-auto bg-gray-50 lg:ml-64">
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
