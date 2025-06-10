import { requireAuth } from "@/lib/auth-utils"
import { DashboardContent } from "./dashboard-content"

export default async function DashboardPage() {
  const session = await requireAuth()

  return <DashboardContent />
}
