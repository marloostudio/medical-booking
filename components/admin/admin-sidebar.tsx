"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Building,
  Users,
  CreditCard,
  Settings,
  BarChart,
  Bell,
  Shield,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  LogOut,
} from "lucide-react"

export function AdminSidebar() {
  const [openMenus, setOpenMenus] = useState({
    clinics: true,
    users: false,
    billing: false,
    settings: false,
  })

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  // For development, we'll use direct links to bypass authentication
  const devPrefix = "/dev"

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-xl font-bold">BookingLink Admin</h2>
        <p className="text-xs text-gray-400 mt-1">Super Admin Panel</p>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {/* Dashboard */}
          <Link
            href={`${devPrefix}/admin-dashboard`}
            className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md"
          >
            <BarChart className="mr-3 h-5 w-5" />
            Dashboard
          </Link>

          {/* Clinics */}
          <div>
            <button
              onClick={() => toggleMenu("clinics")}
              className="w-full flex items-center justify-between px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md"
            >
              <div className="flex items-center">
                <Building className="mr-3 h-5 w-5" />
                Clinics
              </div>
              {openMenus.clinics ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            {openMenus.clinics && (
              <div className="pl-10 space-y-1 mt-1">
                <Link
                  href={`${devPrefix}/admin-dashboard/clinics/all`}
                  className="block px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white rounded-md"
                >
                  All Clinics
                </Link>
                <Link
                  href={`${devPrefix}/admin-dashboard/clinics/add`}
                  className="block px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white rounded-md"
                >
                  Add New Clinic
                </Link>
                <Link
                  href={`${devPrefix}/admin-dashboard/clinics/pending`}
                  className="block px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white rounded-md"
                >
                  Pending Approvals
                </Link>
              </div>
            )}
          </div>

          {/* Users */}
          <div>
            <button
              onClick={() => toggleMenu("users")}
              className="w-full flex items-center justify-between px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md"
            >
              <div className="flex items-center">
                <Users className="mr-3 h-5 w-5" />
                Users
              </div>
              {openMenus.users ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            {openMenus.users && (
              <div className="pl-10 space-y-1 mt-1">
                <Link
                  href={`${devPrefix}/admin-dashboard/users/all`}
                  className="block px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white rounded-md"
                >
                  All Users
                </Link>
                <Link
                  href={`${devPrefix}/admin-dashboard/users/admins`}
                  className="block px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white rounded-md"
                >
                  Admins
                </Link>
                <Link
                  href={`${devPrefix}/admin-dashboard/users/owners`}
                  className="block px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white rounded-md"
                >
                  Clinic Owners
                </Link>
              </div>
            )}
          </div>

          {/* Billing */}
          <div>
            <button
              onClick={() => toggleMenu("billing")}
              className="w-full flex items-center justify-between px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md"
            >
              <div className="flex items-center">
                <CreditCard className="mr-3 h-5 w-5" />
                Billing
              </div>
              {openMenus.billing ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            {openMenus.billing && (
              <div className="pl-10 space-y-1 mt-1">
                <Link
                  href={`${devPrefix}/admin-dashboard/billing/subscriptions`}
                  className="block px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white rounded-md"
                >
                  Subscriptions
                </Link>
                <Link
                  href={`${devPrefix}/admin-dashboard/billing/invoices`}
                  className="block px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white rounded-md"
                >
                  Invoices
                </Link>
                <Link
                  href={`${devPrefix}/admin-dashboard/billing/plans`}
                  className="block px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white rounded-md"
                >
                  Manage Plans
                </Link>
              </div>
            )}
          </div>

          {/* Analytics */}
          <Link
            href={`${devPrefix}/admin-dashboard/analytics`}
            className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md"
          >
            <BarChart className="mr-3 h-5 w-5" />
            Analytics
          </Link>

          {/* Notifications */}
          <Link
            href={`${devPrefix}/admin-dashboard/notifications`}
            className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md"
          >
            <Bell className="mr-3 h-5 w-5" />
            Notifications
          </Link>

          {/* Security */}
          <Link
            href={`${devPrefix}/admin-dashboard/security`}
            className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md"
          >
            <Shield className="mr-3 h-5 w-5" />
            Security
          </Link>

          {/* Settings */}
          <div>
            <button
              onClick={() => toggleMenu("settings")}
              className="w-full flex items-center justify-between px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md"
            >
              <div className="flex items-center">
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </div>
              {openMenus.settings ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            {openMenus.settings && (
              <div className="pl-10 space-y-1 mt-1">
                <Link
                  href={`${devPrefix}/admin-dashboard/settings/general`}
                  className="block px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white rounded-md"
                >
                  General
                </Link>
                <Link
                  href={`${devPrefix}/admin-dashboard/settings/appearance`}
                  className="block px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white rounded-md"
                >
                  Appearance
                </Link>
                <Link
                  href={`${devPrefix}/admin-dashboard/settings/emails`}
                  className="block px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white rounded-md"
                >
                  Email Templates
                </Link>
                <Link
                  href={`${devPrefix}/admin-dashboard/settings/integrations`}
                  className="block px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white rounded-md"
                >
                  Integrations
                </Link>
              </div>
            )}
          </div>

          {/* Support */}
          <Link
            href={`${devPrefix}/admin-dashboard/support`}
            className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md"
          >
            <HelpCircle className="mr-3 h-5 w-5" />
            Support
          </Link>
        </nav>
      </div>

      <div className="p-4 border-t border-gray-800">
        <Link
          href="/"
          className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Exit Admin Mode
        </Link>
      </div>
    </div>
  )
}
