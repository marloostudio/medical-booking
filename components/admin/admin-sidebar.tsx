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
  UserCog,
  UserPlus,
  List,
  PlusCircle,
  Clock,
  Sliders,
  FileText,
  DollarSign,
  Package,
  Activity,
  RefreshCw,
  Globe,
  Calendar,
  Lock,
  FileDigit,
  Ticket,
  MessageSquare,
  PhoneCall,
  AlertCircle,
  PieChart,
  UserCheck,
  Tag,
  Mail,
  Send,
} from "lucide-react"

export function AdminSidebar() {
  const [openMenus, setOpenMenus] = useState({
    clinics: true,
    users: false,
    billing: false,
    settings: false,
    support: false,
    analytics: false,
    marketing: false,
  })

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  // For development, we'll use direct links to bypass authentication
  const devPrefix = "/admin"

  return (
    <div className="w-64 bg-white text-gray-800 min-h-screen flex flex-col border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">BookingLink Admin</h2>
        <p className="text-xs text-gray-500 mt-1">Super Admin Panel</p>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {/* Dashboard */}
          <Link
            href={`${devPrefix}/dashboard`}
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
          >
            <BarChart className="mr-3 h-5 w-5 text-teal-600" />
            Dashboard
          </Link>

          {/* Clinics Management */}
          <div>
            <button
              onClick={() => toggleMenu("clinics")}
              className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
            >
              <div className="flex items-center">
                <Building className="mr-3 h-5 w-5 text-teal-600" />
                Clinics Management
              </div>
              {openMenus.clinics ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            {openMenus.clinics && (
              <div className="pl-10 space-y-1 mt-1">
                <Link
                  href={`${devPrefix}/clinics/all`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <List className="inline-block mr-2 h-4 w-4" />
                  All Clinics
                </Link>
                <Link
                  href={`${devPrefix}/clinics/add`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <PlusCircle className="inline-block mr-2 h-4 w-4" />
                  Add New Clinic
                </Link>
                <Link
                  href={`${devPrefix}/clinics/pending`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <Clock className="inline-block mr-2 h-4 w-4" />
                  Pending Approvals
                </Link>
                <Link
                  href={`${devPrefix}/clinics/settings`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <Sliders className="inline-block mr-2 h-4 w-4" />
                  Clinic Settings
                </Link>
              </div>
            )}
          </div>

          {/* Users Management */}
          <div>
            <button
              onClick={() => toggleMenu("users")}
              className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
            >
              <div className="flex items-center">
                <Users className="mr-3 h-5 w-5 text-teal-600" />
                Users Management
              </div>
              {openMenus.users ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            {openMenus.users && (
              <div className="pl-10 space-y-1 mt-1">
                <Link
                  href={`${devPrefix}/users/all`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <List className="inline-block mr-2 h-4 w-4" />
                  All Users
                </Link>
                <Link
                  href={`${devPrefix}/users/admins`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <UserCog className="inline-block mr-2 h-4 w-4" />
                  Admins
                </Link>
                <Link
                  href={`${devPrefix}/users/owners`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <UserPlus className="inline-block mr-2 h-4 w-4" />
                  Clinic Owners
                </Link>
                <Link
                  href={`${devPrefix}/users/roles`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <UserCheck className="inline-block mr-2 h-4 w-4" />
                  Manage User Roles
                </Link>
                <Link
                  href={`${devPrefix}/users/permissions`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <Lock className="inline-block mr-2 h-4 w-4" />
                  User Permissions
                </Link>
              </div>
            )}
          </div>

          {/* Billing & Subscriptions */}
          <div>
            <button
              onClick={() => toggleMenu("billing")}
              className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
            >
              <div className="flex items-center">
                <CreditCard className="mr-3 h-5 w-5 text-teal-600" />
                Billing & Subscriptions
              </div>
              {openMenus.billing ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            {openMenus.billing && (
              <div className="pl-10 space-y-1 mt-1">
                <Link
                  href={`${devPrefix}/billing/subscriptions`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <RefreshCw className="inline-block mr-2 h-4 w-4" />
                  Subscriptions
                </Link>
                <Link
                  href={`${devPrefix}/billing/invoices`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <FileText className="inline-block mr-2 h-4 w-4" />
                  Invoices
                </Link>
                <Link
                  href={`${devPrefix}/billing/plans`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <Package className="inline-block mr-2 h-4 w-4" />
                  Manage Plans
                </Link>
                <Link
                  href={`${devPrefix}/billing/analytics`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <Activity className="inline-block mr-2 h-4 w-4" />
                  Analytics
                </Link>
                <Link
                  href={`${devPrefix}/billing/history`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <FileDigit className="inline-block mr-2 h-4 w-4" />
                  Payments History
                </Link>
                <Link
                  href={`${devPrefix}/billing/refunds`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <DollarSign className="inline-block mr-2 h-4 w-4" />
                  Refunds & Disputes
                </Link>
              </div>
            )}
          </div>

          {/* Application Settings */}
          <div>
            <button
              onClick={() => toggleMenu("settings")}
              className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
            >
              <div className="flex items-center">
                <Settings className="mr-3 h-5 w-5 text-teal-600" />
                Application Settings
              </div>
              {openMenus.settings ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            {openMenus.settings && (
              <div className="pl-10 space-y-1 mt-1">
                <Link
                  href={`${devPrefix}/settings/general`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <Globe className="inline-block mr-2 h-4 w-4" />
                  General Settings
                </Link>
                <Link
                  href={`${devPrefix}/settings/clinic`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <Calendar className="inline-block mr-2 h-4 w-4" />
                  Clinic Settings
                </Link>
                <Link
                  href={`${devPrefix}/settings/notifications`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <Bell className="inline-block mr-2 h-4 w-4" />
                  Notifications
                </Link>
                <Link
                  href={`${devPrefix}/settings/security`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <Shield className="inline-block mr-2 h-4 w-4" />
                  Security & Compliance
                </Link>
                <Link
                  href={`${devPrefix}/settings/audit`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <FileDigit className="inline-block mr-2 h-4 w-4" />
                  Audit Logs
                </Link>
              </div>
            )}
          </div>

          {/* Support & Helpdesk */}
          <div>
            <button
              onClick={() => toggleMenu("support")}
              className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
            >
              <div className="flex items-center">
                <HelpCircle className="mr-3 h-5 w-5 text-teal-600" />
                Support & Helpdesk
              </div>
              {openMenus.support ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            {openMenus.support && (
              <div className="pl-10 space-y-1 mt-1">
                <Link
                  href={`${devPrefix}/support/tickets`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <Ticket className="inline-block mr-2 h-4 w-4" />
                  Support Tickets
                </Link>
                <Link
                  href={`${devPrefix}/support/faqs`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <MessageSquare className="inline-block mr-2 h-4 w-4" />
                  FAQs
                </Link>
                <Link
                  href={`${devPrefix}/support/contact`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <PhoneCall className="inline-block mr-2 h-4 w-4" />
                  Contact Support
                </Link>
                <Link
                  href={`${devPrefix}/support/status`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <AlertCircle className="inline-block mr-2 h-4 w-4" />
                  System Status
                </Link>
              </div>
            )}
          </div>

          {/* Advanced Analytics */}
          <div>
            <button
              onClick={() => toggleMenu("analytics")}
              className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
            >
              <div className="flex items-center">
                <BarChart className="mr-3 h-5 w-5 text-teal-600" />
                Advanced Analytics
              </div>
              {openMenus.analytics ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            {openMenus.analytics && (
              <div className="pl-10 space-y-1 mt-1">
                <Link
                  href={`${devPrefix}/analytics/system`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <Activity className="inline-block mr-2 h-4 w-4" />
                  System Analytics
                </Link>
                <Link
                  href={`${devPrefix}/analytics/users`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <Users className="inline-block mr-2 h-4 w-4" />
                  User Analytics
                </Link>
                <Link
                  href={`${devPrefix}/analytics/usage`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <PieChart className="inline-block mr-2 h-4 w-4" />
                  App Usage
                </Link>
              </div>
            )}
          </div>

          {/* Marketing & Communication */}
          <div>
            <button
              onClick={() => toggleMenu("marketing")}
              className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
            >
              <div className="flex items-center">
                <Mail className="mr-3 h-5 w-5 text-teal-600" />
                Marketing & Communication
              </div>
              {openMenus.marketing ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            {openMenus.marketing && (
              <div className="pl-10 space-y-1 mt-1">
                <Link
                  href={`${devPrefix}/marketing/promotions`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <Tag className="inline-block mr-2 h-4 w-4" />
                  Promotions
                </Link>
                <Link
                  href={`${devPrefix}/marketing/emails`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <Send className="inline-block mr-2 h-4 w-4" />
                  Emails & Communications
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <Link
          href="/"
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Exit Admin Mode
        </Link>
      </div>
    </div>
  )
}
