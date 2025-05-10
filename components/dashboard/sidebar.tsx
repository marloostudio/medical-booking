"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  Bell,
  BarChart2,
  FileText,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

interface SidebarProps {
  userRole?: string
}

export function Sidebar({ userRole = "CLINIC_OWNER" }: SidebarProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

  const toggleMenu = (menuId: string) => {
    if (expandedMenus.includes(menuId)) {
      setExpandedMenus(expandedMenus.filter((id) => id !== menuId))
    } else {
      setExpandedMenus([...expandedMenus, menuId])
    }
  }

  const isMenuExpanded = (menuId: string) => expandedMenus.includes(menuId)

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  const menuItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      submenu: [],
    },
    {
      id: "appointments",
      name: "Appointments",
      href: "/dashboard/appointments",
      icon: <Calendar className="h-5 w-5" />,
      submenu: [
        { name: "Calendar", href: "/dashboard/appointments/calendar" },
        { name: "Upcoming", href: "/dashboard/appointments/upcoming" },
        { name: "Past", href: "/dashboard/appointments/past" },
      ],
    },
    {
      id: "patients",
      name: "Patients",
      href: "/dashboard/patients-placeholder",
      icon: <Users className="h-5 w-5" />,
      submenu: [
        { name: "All Patients", href: "/dashboard/patients-placeholder/all" },
        { name: "New Patient", href: "/dashboard/patients-placeholder/new" },
        { name: "Import", href: "/dashboard/patients-placeholder/import" },
      ],
    },
    {
      id: "notifications",
      name: "Notifications",
      href: "/dashboard/notifications",
      icon: <Bell className="h-5 w-5" />,
      submenu: [
        { name: "Templates", href: "/dashboard/settings/reminder-templates" },
        { name: "History", href: "/dashboard/notifications/history" },
      ],
    },
    {
      id: "reports",
      name: "Reports",
      href: "/dashboard/reports",
      icon: <FileText className="h-5 w-5" />,
      submenu: [
        { name: "Appointment Reports", href: "/dashboard/reports/appointments" },
        { name: "Patient Reports", href: "/dashboard/reports/patients" },
        { name: "Financial Reports", href: "/dashboard/reports/financial" },
      ],
    },
    {
      id: "analytics",
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: <BarChart2 className="h-5 w-5" />,
      submenu: [
        { name: "Reminders", href: "/dashboard/analytics/reminders" },
        { name: "Performance", href: "/dashboard/analytics/performance" },
      ],
    },
    {
      id: "settings",
      name: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
      submenu: [
        { name: "Profile", href: "/dashboard/settings/profile" },
        { name: "Clinic", href: "/dashboard/settings/clinic" },
        { name: "Staff", href: "/dashboard/settings/staff" },
        { name: "Security", href: "/dashboard/settings/security" },
        { name: "Billing", href: "/dashboard/settings/billing" },
      ],
    },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 z-40 w-full bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-bold text-blue-600">
            BookingLink
          </Link>
          <button
            type="button"
            className="text-gray-600 hover:text-blue-600 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white lg:pt-5 lg:pb-4">
        <div className="flex items-center flex-shrink-0 px-6">
          <Link href="/dashboard" className="text-xl font-bold text-blue-600">
            BookingLink
          </Link>
        </div>
        <div className="mt-6 h-0 flex-1 flex flex-col overflow-y-auto">
          <nav className="px-3 mt-6">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <div key={item.id}>
                  {item.submenu.length > 0 ? (
                    <>
                      <button
                        onClick={() => toggleMenu(item.id)}
                        className={`group flex items-center justify-between px-3 py-2 w-full text-sm font-medium rounded-md ${
                          isActive(item.href)
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <div className="flex items-center">
                          <span
                            className={`${isActive(item.href) ? "text-blue-500" : "text-gray-500 group-hover:text-gray-500"}`}
                          >
                            {item.icon}
                          </span>
                          <span className="ml-3">{item.name}</span>
                        </div>
                        {isMenuExpanded(item.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      {isMenuExpanded(item.id) && (
                        <div className="ml-8 mt-1 space-y-1">
                          {item.submenu.map((subitem) => (
                            <Link
                              key={subitem.href}
                              href={subitem.href}
                              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                                isActive(subitem.href)
                                  ? "bg-blue-50 text-blue-600"
                                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                              }`}
                            >
                              <span className="truncate">{subitem.name}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        isActive(item.href)
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <span
                        className={`${isActive(item.href) ? "text-blue-500" : "text-gray-500 group-hover:text-gray-500"}`}
                      >
                        {item.icon}
                      </span>
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 flex">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <Link href="/dashboard" className="text-xl font-bold text-blue-600">
                  BookingLink
                </Link>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {menuItems.map((item) => (
                  <div key={item.id}>
                    {item.submenu.length > 0 ? (
                      <>
                        <button
                          onClick={() => toggleMenu(item.id)}
                          className={`group flex items-center justify-between px-3 py-2 w-full text-base font-medium rounded-md ${
                            isActive(item.href)
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          <div className="flex items-center">
                            <span
                              className={`${isActive(item.href) ? "text-blue-500" : "text-gray-500 group-hover:text-gray-500"}`}
                            >
                              {item.icon}
                            </span>
                            <span className="ml-3">{item.name}</span>
                          </div>
                          {isMenuExpanded(item.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                        {isMenuExpanded(item.id) && (
                          <div className="ml-8 mt-1 space-y-1">
                            {item.submenu.map((subitem) => (
                              <Link
                                key={subitem.href}
                                href={subitem.href}
                                className={`group flex items-center px-3 py-2 text-base font-medium rounded-md ${
                                  isActive(subitem.href)
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <span className="truncate">{subitem.name}</span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={`group flex items-center px-3 py-2 text-base font-medium rounded-md ${
                          isActive(item.href)
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span
                          className={`${isActive(item.href) ? "text-blue-500" : "text-gray-500 group-hover:text-gray-500"}`}
                        >
                          {item.icon}
                        </span>
                        <span className="ml-3">{item.name}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
