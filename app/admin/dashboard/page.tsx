import type { Metadata } from "next"
import SuperAdminDashboard from "@/components/admin/super-admin-dashboard"

export const metadata: Metadata = {
  title: "Super Admin Dashboard | BookingLink",
  description: "Comprehensive administration panel for BookingLink platform management",
}

export default function AdminDashboardPage() {
  return <SuperAdminDashboard />
}
