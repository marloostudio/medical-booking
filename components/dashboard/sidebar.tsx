"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Calendar,
  UserCog,
  CreditCard,
  Bell,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    patients: true,
    appointments: true,
    staff: true,
    payments: true,
    notifications: true,
    analytics: true,
    settings: true,
  })

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center">
          <span className="text-xl font-bold text-blue-600">BookingLink</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {/* Dashboard */}
        <Link
          href="/dashboard"
          className={`flex items-center px-3 py-2 rounded-md ${
            isActive("/dashboard") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <LayoutDashboard className="h-5 w-5 mr-3" />
          <span>Dashboard</span>
        </Link>

        {/* Patients */}
        <div>
          <button
            onClick={() => toggleMenu("patients")}
            className="flex items-center justify-between w-full px-3 py-2 text-left rounded-md text-gray-700 hover:bg-gray-100"
          >
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-3" />
              <span>Patients</span>
            </div>
            {openMenus.patients ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          {openMenus.patients && (
            <div className="ml-8 space-y-1 mt-1">
              <Link
                href="/dashboard/patients"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/patients") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>All Patients</span>
              </Link>
              <Link
                href="/dashboard/patients/new"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/patients/new") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>Add Patient</span>
              </Link>
              <Link
                href="/dashboard/patients/import"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/patients/import")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>Import Patients</span>
              </Link>
            </div>
          )}
        </div>

        {/* Appointments */}
        <div>
          <button
            onClick={() => toggleMenu("appointments")}
            className="flex items-center justify-between w-full px-3 py-2 text-left rounded-md text-gray-700 hover:bg-gray-100"
          >
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-3" />
              <span>Appointments</span>
            </div>
            {openMenus.appointments ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          {openMenus.appointments && (
            <div className="ml-8 space-y-1 mt-1">
              <Link
                href="/dashboard/appointments/calendar"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/appointments/calendar")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>Calendar</span>
              </Link>
              <Link
                href="/dashboard/appointments/new"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/appointments/new")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>Book Appointment</span>
              </Link>
              <Link
                href="/dashboard/appointments/upcoming"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/appointments/upcoming")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>Upcoming</span>
              </Link>
              <Link
                href="/dashboard/appointments/past"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/appointments/past")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>Past</span>
              </Link>
            </div>
          )}
        </div>

        {/* Staff & Providers */}
        <div>
          <button
            onClick={() => toggleMenu("staff")}
            className="flex items-center justify-between w-full px-3 py-2 text-left rounded-md text-gray-700 hover:bg-gray-100"
          >
            <div className="flex items-center">
              <UserCog className="h-5 w-5 mr-3" />
              <span>Staff & Providers</span>
            </div>
            {openMenus.staff ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          {openMenus.staff && (
            <div className="ml-8 space-y-1 mt-1">
              <Link
                href="/dashboard/providers"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/providers") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>All Staff</span>
              </Link>
              <Link
                href="/dashboard/settings/availability"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/settings/availability")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>Availability</span>
              </Link>
              <Link
                href="/dashboard/settings/roles"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/settings/roles")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>Roles & Permissions</span>
              </Link>
            </div>
          )}
        </div>

        {/* Payments */}
        <div>
          <button
            onClick={() => toggleMenu("payments")}
            className="flex items-center justify-between w-full px-3 py-2 text-left rounded-md text-gray-700 hover:bg-gray-100"
          >
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 mr-3" />
              <span>Payments</span>
            </div>
            {openMenus.payments ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          {openMenus.payments && (
            <div className="ml-8 space-y-1 mt-1">
              <Link
                href="/dashboard/payments"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/payments") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>Invoices</span>
              </Link>
              <Link
                href="/dashboard/payments/refunds"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/payments/refunds")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>Refunds</span>
              </Link>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div>
          <button
            onClick={() => toggleMenu("notifications")}
            className="flex items-center justify-between w-full px-3 py-2 text-left rounded-md text-gray-700 hover:bg-gray-100"
          >
            <div className="flex items-center">
              <Bell className="h-5 w-5 mr-3" />
              <span>Notifications</span>
            </div>
            {openMenus.notifications ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          {openMenus.notifications && (
            <div className="ml-8 space-y-1 mt-1">
              <Link
                href="/dashboard/notifications/reminders"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/notifications/reminders")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>Reminders</span>
              </Link>
              <Link
                href="/dashboard/notifications/templates"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/notifications/templates")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>Templates</span>
              </Link>
              <Link
                href="/dashboard/notifications/history"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/notifications/history")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>History</span>
              </Link>
            </div>
          )}
        </div>

        {/* Analytics */}
        <div>
          <button
            onClick={() => toggleMenu("analytics")}
            className="flex items-center justify-between w-full px-3 py-2 text-left rounded-md text-gray-700 hover:bg-gray-100"
          >
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-3" />
              <span>Analytics</span>
            </div>
            {openMenus.analytics ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          {openMenus.analytics && (
            <div className="ml-8 space-y-1 mt-1">
              <Link
                href="/dashboard/analytics/appointments"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/analytics/appointments")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>Appointments</span>
              </Link>
              <Link
                href="/dashboard/analytics/patients"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/analytics/patients")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>Patients</span>
              </Link>
              <Link
                href="/dashboard/analytics/reminders"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/analytics/reminders")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>Reminders</span>
              </Link>
            </div>
          )}
        </div>

        {/* Settings */}
        <div>
          <button
            onClick={() => toggleMenu("settings")}
            className="flex items-center justify-between w-full px-3 py-2 text-left rounded-md text-gray-700 hover:bg-gray-100"
          >
            <div className="flex items-center">
              <Settings className="h-5 w-5 mr-3" />
              <span>Settings</span>
            </div>
            {openMenus.settings ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          {openMenus.settings && (
            <div className="ml-8 space-y-1 mt-1">
              <Link
                href="/dashboard/settings/profile"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/settings/profile")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>Profile</span>
              </Link>
              <Link
                href="/dashboard/settings/clinic"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/settings/clinic")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>Clinic Info</span>
              </Link>
              <Link
                href="/dashboard/settings/staff"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/settings/staff")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>Staff</span>
              </Link>
              <Link
                href="/dashboard/settings/appointment-types"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/settings/appointment-types")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>Appointment Types</span>
              </Link>
              <Link
                href="/dashboard/settings/booking-rules"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/settings/booking-rules")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>Booking Rules</span>
              </Link>
              <Link
                href="/dashboard/settings/payment"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/settings/payment")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>Payment</span>
              </Link>
              <Link
                href="/dashboard/settings/platform"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/settings/platform")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>Platform</span>
              </Link>
            </div>
          )}
        </div>

        {/* Help */}
        <Link
          href="/dashboard/help"
          className={`flex items-center px-3 py-2 rounded-md ${
            isActive("/dashboard/help") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <HelpCircle className="h-5 w-5 mr-3" />
          <span>Help & Support</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Link href="/logout" className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
          <LogOut className="h-5 w-5 mr-3" />
          <span>Sign Out</span>
        </Link>
      </div>
    </div>
  )
}
