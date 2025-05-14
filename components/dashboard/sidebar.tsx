"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Calendar,
  Settings,
  Bell,
  Users,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  CreditCard,
  BarChart,
  HelpCircle,
  ChevronLeft,
} from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    appointments: true,
    patients: pathname?.includes("/dashboard/patients"),
    settings: pathname?.includes("/dashboard/settings"),
    notifications: pathname?.includes("/dashboard/notifications"),
    reports: pathname?.includes("/dashboard/reports"),
  })

  // Ensure component is mounted to prevent hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path)
  }

  const handleLogout = () => {
    // Clear any local storage or session storage
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("sessionExpiry")

    // Redirect to login page
    router.push("/login")
  }

  if (!mounted) {
    return null // Return null on first render to avoid hydration mismatch
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 z-40 w-full bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <Link href="/dashboard" className="flex items-center">
          <span className="text-xl font-bold text-blue-600">BookingLink</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 rounded-md"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden fixed inset-0 z-30 bg-gray-800 bg-opacity-50 transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white transition-transform duration-300 transform ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-gray-200">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">BookingLink</span>
            </Link>
            <p className="text-xs text-gray-500 mt-1">Medical Appointment System</p>
          </div>

          <div className="overflow-y-auto h-full py-4 px-3">
            <NavItems
              pathname={pathname}
              openMenus={openMenus}
              toggleMenu={toggleMenu}
              isActive={isActive}
              isMobile={true}
              onLogout={handleLogout}
              collapsed={false}
            />
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div
        className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 z-10 transition-all duration-300 ease-in-out ${
          collapsed ? "lg:w-20" : "lg:w-64"
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {!collapsed && (
              <Link href="/dashboard" className="flex items-center">
                <span className="text-xl font-bold text-blue-600">BookingLink</span>
              </Link>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={`p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 ${
                collapsed ? "mx-auto" : "ml-auto"
              }`}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
          </div>
          <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              <NavItems
                pathname={pathname}
                openMenus={openMenus}
                toggleMenu={toggleMenu}
                isActive={isActive}
                isMobile={false}
                onLogout={handleLogout}
                collapsed={collapsed}
              />
            </nav>
          </div>
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className={`flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 w-full ${
                collapsed ? "justify-center" : ""
              }`}
              aria-label="Sign out"
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && <span className="ml-3">Sign Out</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function NavItems({
  pathname,
  openMenus,
  toggleMenu,
  isActive,
  isMobile,
  onLogout,
  collapsed,
}: {
  pathname: string | null
  openMenus: Record<string, boolean>
  toggleMenu: (menu: string) => void
  isActive: (path: string) => boolean
  isMobile: boolean
  onLogout: () => void
  collapsed: boolean
}) {
  return (
    <div className="space-y-2">
      <Link
        href="/dashboard"
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
          isActive("/dashboard") && !pathname?.includes("/dashboard/")
            ? "bg-blue-100 text-blue-600"
            : "text-gray-700 hover:bg-gray-100"
        } ${collapsed && !isMobile ? "justify-center" : ""}`}
        title={collapsed && !isMobile ? "Dashboard" : ""}
      >
        <LayoutDashboard className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />
        {(!collapsed || isMobile) && <span className="ml-3">Dashboard</span>}
      </Link>

      {/* Appointments */}
      <div>
        <button
          onClick={() => toggleMenu("appointments")}
          className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-left rounded-md ${
            isActive("/dashboard/appointments") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
          } ${collapsed && !isMobile ? "justify-center" : ""}`}
          title={collapsed && !isMobile ? "Appointments" : ""}
        >
          <div className={`flex items-center ${collapsed && !isMobile ? "justify-center w-full" : ""}`}>
            <Calendar className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />
            {(!collapsed || isMobile) && <span className="ml-3">Appointments</span>}
          </div>
          {(!collapsed || isMobile) &&
            (openMenus.appointments ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
        </button>

        {openMenus.appointments && (!collapsed || isMobile) && (
          <div className="ml-8 mt-1 space-y-1">
            <Link
              href="/dashboard/appointments/calendar"
              className={`block px-3 py-2 text-sm font-medium rounded-md ${
                isActive("/dashboard/appointments/calendar")
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Calendar
            </Link>
            <Link
              href="/dashboard/appointments/new"
              className={`block px-3 py-2 text-sm font-medium rounded-md ${
                isActive("/dashboard/appointments/new")
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              New Appointment
            </Link>
            <Link
              href="/dashboard/appointments/upcoming"
              className={`block px-3 py-2 text-sm font-medium rounded-md ${
                isActive("/dashboard/appointments/upcoming")
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Upcoming
            </Link>
            <Link
              href="/dashboard/appointments/past"
              className={`block px-3 py-2 text-sm font-medium rounded-md ${
                isActive("/dashboard/appointments/past")
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Past
            </Link>
          </div>
        )}
      </div>

      {/* Patients */}
      <div>
        <button
          onClick={() => toggleMenu("patients")}
          className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-left rounded-md ${
            isActive("/dashboard/patients") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
          } ${collapsed && !isMobile ? "justify-center" : ""}`}
          title={collapsed && !isMobile ? "Patients" : ""}
        >
          <div className={`flex items-center ${collapsed && !isMobile ? "justify-center w-full" : ""}`}>
            <Users className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />
            {(!collapsed || isMobile) && <span className="ml-3">Patients</span>}
          </div>
          {(!collapsed || isMobile) &&
            (openMenus.patients ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
        </button>

        {openMenus.patients && (!collapsed || isMobile) && (
          <div className="ml-8 mt-1 space-y-1">
            <Link
              href="/dashboard/patients/all"
              className={`block px-3 py-2 text-sm font-medium rounded-md ${
                isActive("/dashboard/patients/all") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              All Patients
            </Link>
            <Link
              href="/dashboard/patients/new"
              className={`block px-3 py-2 text-sm font-medium rounded-md ${
                isActive("/dashboard/patients/new") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Add Patient
            </Link>
            <Link
              href="/dashboard/patients/import"
              className={`block px-3 py-2 text-sm font-medium rounded-md ${
                isActive("/dashboard/patients/import") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Import
            </Link>
          </div>
        )}
      </div>

      {/* Billing */}
      <Link
        href="/dashboard/payments"
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
          isActive("/dashboard/payments") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
        } ${collapsed && !isMobile ? "justify-center" : ""}`}
        title={collapsed && !isMobile ? "Billing" : ""}
      >
        <CreditCard className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />
        {(!collapsed || isMobile) && <span className="ml-3">Billing</span>}
      </Link>

      {/* Reports */}
      <div>
        <button
          onClick={() => toggleMenu("reports")}
          className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-left rounded-md ${
            isActive("/dashboard/reports") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
          } ${collapsed && !isMobile ? "justify-center" : ""}`}
          title={collapsed && !isMobile ? "Reports" : ""}
        >
          <div className={`flex items-center ${collapsed && !isMobile ? "justify-center w-full" : ""}`}>
            <BarChart className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />
            {(!collapsed || isMobile) && <span className="ml-3">Reports</span>}
          </div>
          {(!collapsed || isMobile) &&
            (openMenus.reports ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
        </button>

        {openMenus.reports && (!collapsed || isMobile) && (
          <div className="ml-8 mt-1 space-y-1">
            <Link
              href="/dashboard/reports/appointments"
              className={`block px-3 py-2 text-sm font-medium rounded-md ${
                isActive("/dashboard/reports/appointments")
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Appointments
            </Link>
            <Link
              href="/dashboard/reports/patients"
              className={`block px-3 py-2 text-sm font-medium rounded-md ${
                isActive("/dashboard/reports/patients")
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Patients
            </Link>
            <Link
              href="/dashboard/reports/financial"
              className={`block px-3 py-2 text-sm font-medium rounded-md ${
                isActive("/dashboard/reports/financial")
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Financial
            </Link>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div>
        <button
          onClick={() => toggleMenu("notifications")}
          className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-left rounded-md ${
            isActive("/dashboard/notifications") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
          } ${collapsed && !isMobile ? "justify-center" : ""}`}
          title={collapsed && !isMobile ? "Notifications" : ""}
        >
          <div className={`flex items-center ${collapsed && !isMobile ? "justify-center w-full" : ""}`}>
            <Bell className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />
            {(!collapsed || isMobile) && <span className="ml-3">Notifications</span>}
          </div>
          {(!collapsed || isMobile) &&
            (openMenus.notifications ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
        </button>

        {openMenus.notifications && (!collapsed || isMobile) && (
          <div className="ml-8 mt-1 space-y-1">
            <Link
              href="/dashboard/notifications/reminders"
              className={`block px-3 py-2 text-sm font-medium rounded-md ${
                isActive("/dashboard/notifications/reminders")
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Reminders
            </Link>
            <Link
              href="/dashboard/notifications/templates"
              className={`block px-3 py-2 text-sm font-medium rounded-md ${
                isActive("/dashboard/notifications/templates")
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Templates
            </Link>
            <Link
              href="/dashboard/notifications/history"
              className={`block px-3 py-2 text-sm font-medium rounded-md ${
                isActive("/dashboard/notifications/history")
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              History
            </Link>
          </div>
        )}
      </div>

      {/* Settings */}
      <div>
        <button
          onClick={() => toggleMenu("settings")}
          className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-left rounded-md ${
            isActive("/dashboard/settings") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
          } ${collapsed && !isMobile ? "justify-center" : ""}`}
          title={collapsed && !isMobile ? "Settings" : ""}
        >
          <div className={`flex items-center ${collapsed && !isMobile ? "justify-center w-full" : ""}`}>
            <Settings className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />
            {(!collapsed || isMobile) && <span className="ml-3">Settings</span>}
          </div>
          {(!collapsed || isMobile) &&
            (openMenus.settings ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
        </button>

        {openMenus.settings && (!collapsed || isMobile) && (
          <div className="ml-8 mt-1 space-y-1">
            <Link
              href="/dashboard/settings/profile"
              className={`block px-3 py-2 text-sm font-medium rounded-md ${
                isActive("/dashboard/settings/profile")
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Profile
            </Link>
            <Link
              href="/dashboard/settings/clinic"
              className={`block px-3 py-2 text-sm font-medium rounded-md ${
                isActive("/dashboard/settings/clinic") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Clinic
            </Link>
            <Link
              href="/dashboard/settings/office"
              className={`block px-3 py-2 text-sm font-medium rounded-md ${
                isActive("/dashboard/settings/office") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Office Info
            </Link>
            <Link
              href="/dashboard/settings/staff"
              className={`block px-3 py-2 text-sm font-medium rounded-md ${
                isActive("/dashboard/settings/staff") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Staff
            </Link>
            <Link
              href="/dashboard/settings/appointment-types"
              className={`block px-3 py-2 text-sm font-medium rounded-md ${
                isActive("/dashboard/settings/appointment-types")
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Appointment Types
            </Link>
            <Link
              href="/dashboard/settings/availability"
              className={`block px-3 py-2 text-sm font-medium rounded-md ${
                isActive("/dashboard/settings/availability")
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Availability
            </Link>
          </div>
        )}
      </div>

      {/* Help */}
      <Link
        href="/dashboard/help"
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
          isActive("/dashboard/help") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
        } ${collapsed && !isMobile ? "justify-center" : ""}`}
        title={collapsed && !isMobile ? "Help" : ""}
      >
        <HelpCircle className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />
        {(!collapsed || isMobile) && <span className="ml-3">Help</span>}
      </Link>

      {/* Mobile Only: Sign Out Button */}
      {isMobile && (
        <button
          onClick={onLogout}
          className="flex items-center px-3 py-2 w-full text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 mt-4"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Sign Out</span>
        </button>
      )}
    </div>
  )
}

// Add both default and named exports
export default Sidebar
