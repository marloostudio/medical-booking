"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Calendar,
  Package,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
  ChevronDown,
  ChevronRight,
  User,
  Settings,
} from "lucide-react"

export function ClinicOwnerSidebar() {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    users: true,
    appointments: true,
    patients: true,
    billing: true,
    notifications: true,
    support: true,
  })

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") {
      return true
    }

    // Check if the current path starts with the given path (for nested routes)
    if (path !== "/dashboard" && pathname.startsWith(path)) {
      return true
    }

    return pathname === path
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center">
          <span className="text-xl font-bold text-blue-600">BookingLink</span>
        </Link>
        <p className="text-xs text-gray-500 mt-1">Clinic Owner Dashboard</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {/* Clinic Overview */}
        <Link
          href="/dashboard"
          className={`flex items-center px-3 py-2 rounded-md ${
            isActive("/dashboard") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <LayoutDashboard className="h-5 w-5 mr-3" />
          <span>Clinic Overview</span>
        </Link>

        {/* Manage Users */}
        <div>
          <button
            onClick={() => toggleMenu("users")}
            className="flex items-center justify-between w-full px-3 py-2 text-left rounded-md text-gray-700 hover:bg-gray-100"
          >
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-3" />
              <span>Manage Users</span>
            </div>
            {openMenus.users ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          {openMenus.users && (
            <div className="ml-8 space-y-1 mt-1">
              <Link
                href="/dashboard/users"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/users") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>All Users</span>
              </Link>
              <Link
                href="/dashboard/users/add"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/users/add") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>Add User</span>
              </Link>
              <Link
                href="/dashboard/users/roles"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/users/roles") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>Roles & Permissions</span>
              </Link>
            </div>
          )}
        </div>

        {/* Manage Appointments */}
        <div>
          <button
            onClick={() => toggleMenu("appointments")}
            className="flex items-center justify-between w-full px-3 py-2 text-left rounded-md text-gray-700 hover:bg-gray-100"
          >
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-3" />
              <span>Manage Appointments</span>
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
                href="/dashboard/appointments/history"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/appointments/history")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>History</span>
              </Link>
            </div>
          )}
        </div>

        {/* Manage Plans */}
        <Link
          href="/dashboard/plans"
          className={`flex items-center px-3 py-2 rounded-md ${
            isActive("/dashboard/plans") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <Package className="h-5 w-5 mr-3" />
          <span>Manage Plans</span>
        </Link>

        {/* Patient Records */}
        <div>
          <button
            onClick={() => toggleMenu("patients")}
            className="flex items-center justify-between w-full px-3 py-2 text-left rounded-md text-gray-700 hover:bg-gray-100"
          >
            <div className="flex items-center">
              <User className="h-5 w-5 mr-3" />
              <span>Patient Records</span>
            </div>
            {openMenus.patients ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          {openMenus.patients && (
            <div className="ml-8 space-y-1 mt-1">
              <Link
                href="/dashboard/patients/all"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/patients/all") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
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

        {/* Billing & Invoices */}
        <div>
          <button
            onClick={() => toggleMenu("billing")}
            className="flex items-center justify-between w-full px-3 py-2 text-left rounded-md text-gray-700 hover:bg-gray-100"
          >
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 mr-3" />
              <span>Billing & Invoices</span>
            </div>
            {openMenus.billing ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          {openMenus.billing && (
            <div className="ml-8 space-y-1 mt-1">
              <Link
                href="/dashboard/billing/invoices"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/billing/invoices")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>Invoices</span>
              </Link>
              <Link
                href="/dashboard/billing/subscription"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/billing/subscription")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>Subscription</span>
              </Link>
              <Link
                href="/dashboard/billing/payment-history"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/billing/payment-history")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>Payment History</span>
              </Link>
            </div>
          )}
        </div>

        {/* Clinic Settings */}
        <Link
          href="/dashboard/settings"
          className={`flex items-center px-3 py-2 rounded-md ${
            isActive("/dashboard/settings") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <Settings className="h-5 w-5 mr-3" />
          <span>Clinic Settings</span>
        </Link>

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

        {/* Support */}
        <div>
          <button
            onClick={() => toggleMenu("support")}
            className="flex items-center justify-between w-full px-3 py-2 text-left rounded-md text-gray-700 hover:bg-gray-100"
          >
            <div className="flex items-center">
              <HelpCircle className="h-5 w-5 mr-3" />
              <span>Support</span>
            </div>
            {openMenus.support ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          {openMenus.support && (
            <div className="ml-8 space-y-1 mt-1">
              <Link
                href="/dashboard/support/tickets"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/support/tickets")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>Submit Ticket</span>
              </Link>
              <Link
                href="/dashboard/support/faqs"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/support/faqs") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>FAQs</span>
              </Link>
              <Link
                href="/dashboard/support/contact"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive("/dashboard/support/contact")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>Contact Support</span>
              </Link>
            </div>
          )}
        </div>
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
