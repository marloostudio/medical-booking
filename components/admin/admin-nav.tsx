import {
  Home,
  Users,
  Building,
  Settings,
  Shield,
  BarChart2,
  Bell,
  Calendar,
  CreditCard,
  HelpCircle,
} from "lucide-react"
import Link from "next/link"

interface AdminNavProps {
  currentPath: string
}

export default function AdminNav({ currentPath }: AdminNavProps) {
  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: Home },
    { href: "/admin/clinics", label: "Clinics", icon: Building },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/appointments", label: "Appointments", icon: Calendar },
    { href: "/admin/billing", label: "Billing", icon: CreditCard },
    { href: "/admin/notifications", label: "Notifications", icon: Bell },
    { href: "/admin/reports", label: "Reports", icon: BarChart2 },
    { href: "/admin/system", label: "System", icon: Shield },
    { href: "/admin/support", label: "Support", icon: HelpCircle },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ]

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-teal-600">BookingLink Admin</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => {
                const isActive = currentPath === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? "border-teal-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="relative inline-block">
                <img className="h-8 w-8 rounded-full" src="/admin-interface.png" alt="Admin" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-green-400 ring-2 ring-white"></span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
