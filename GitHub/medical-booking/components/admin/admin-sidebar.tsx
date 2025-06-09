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

          {/* 1. Clinics Management */}
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
                  <div className="flex items-center">
                    <List className="h-4 w-4 mr-2" />
                    <span>All Clinics</span>
                  </div>
                  <div className="pl-6 mt-1 text-xs text-gray-500">Search, filter, view details, edit</div>
                </Link>
                <Link
                  href={`${devPrefix}/clinics/add`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <div className="flex items-center">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    <span>Add New Clinic</span>
                  </div>
                  <div className="pl-6 mt-1 text-xs text-gray-500">Create clinic, set details, assign owners</div>
                </Link>
                <Link
                  href={`${devPrefix}/clinics/pending`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Pending Approvals</span>
                  </div>
                  <div className="pl-6 mt-1 text-xs text-gray-500">Approve, reject, request info</div>
                </Link>
                <Link
                  href={`${devPrefix}/clinics/settings`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <div className="flex items-center">
                    <Sliders className="h-4 w-4 mr-2" />
                    <span>Clinic Settings</span>
                  </div>
                  <div className="pl-6 mt-1 text-xs text-gray-500">Default settings, configurations</div>
                </Link>
              </div>
            )}
          </div>

          {/* 2. Users Management */}
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
                  <div className="flex items-center">
                    <List className="h-4 w-4 mr-2" />
                    <span>All Users</span>
                  </div>
                  <div className="pl-6 mt-1 text-xs text-gray-500">Search, filter, view profiles, reset passwords</div>
                </Link>
                <Link
                  href={`${devPrefix}/users/admins`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <div className="flex items-center">
                    <UserCog className="h-4 w-4 mr-2" />
                    <span>Admins</span>
                  </div>
                  <div className="pl-6 mt-1 text-xs text-gray-500">Manage admin users and permissions</div>
                </Link>
                <Link
                  href={`${devPrefix}/users/owners`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <div className="flex items-center">
                    <UserPlus className="h-4 w-4 mr-2" />
                    <span>Clinic Owners</span>
                  </div>
                  <div className="pl-6 mt-1 text-xs text-gray-500">View, add, remove clinic owners</div>
                </Link>
                <Link
                  href={`${devPrefix}/users/roles`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <div className="flex items-center">
                    <UserCheck className="h-4 w-4 mr-2" />
                    <span>Manage User Roles</span>
                  </div>
                  <div className="pl-6 mt-1 text-xs text-gray-500">Create, modify roles and assign to users</div>
                </Link>
                <Link
                  href={`${devPrefix}/users/permissions`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <div className="flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    <span>User Permissions</span>
                  </div>
                  <div className="pl-6 mt-1 text-xs text-gray-500">Grant specific permissions, view logs</div>
                </Link>
              </div>
            )}
          </div>

          {/* 3. Billing & Subscriptions */}
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
                  <div className="flex items-center">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    <span>Subscriptions</span>
                  </div>
                  <div className="pl-6 mt-1 text-xs text-gray-500">Active, canceled, pending subscriptions</div>
                </Link>
                <Link
                  href={`${devPrefix}/billing/invoices`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    <span>Invoices</span>
                  </div>
                  <div className="pl-6 mt-1 text-xs text-gray-500">View, download, email invoices</div>
                </Link>
                <Link
                  href={`${devPrefix}/billing/plans`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    <span>Manage Plans</span>
                  </div>
                  <div className="pl-6 mt-1 text-xs text-gray-500">Create, edit, delete subscription plans</div>
                </Link>
                <Link
                  href={`${devPrefix}/billing/analytics`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <div className="flex items-center">
                    <Activity className="h-4 w-4 mr-2" />
                    <span>Analytics</span>
                  </div>
                  <div className="pl-6 mt-1 text-xs text-gray-500">Revenue trends, subscription breakdown</div>
                </Link>
                <Link
                  href={`${devPrefix}/billing/history`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <div className="flex items-center">
                    <FileDigit className="h-4 w-4 mr-2" />
                    <span>Payments History</span>
                  </div>
                  <div className="pl-6 mt-1 text-xs text-gray-500">All payments, issue refunds</div>
                </Link>
                <Link
                  href={`${devPrefix}/billing/refunds`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span>Refunds & Disputes</span>
                  </div>
                  <div className="pl-6 mt-1 text-xs text-gray-500">Track and resolve billing disputes</div>
                </Link>
              </div>
            )}
          </div>

          {/* 4. Application Settings */}
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
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    <span>General Settings</span>
                  </div>
                  <div className="pl-6 mt-1 text-xs text-gray-500">System emails, timezone, language, branding</div>
                </Link>
                <Link
                  href={`${devPrefix}/settings/clinic`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Clinic Settings</span>
                  </div>
                  <div className="pl-6 mt-1 text-xs text-gray-500">Default hours, holidays, cancellation rules</div>
                </Link>
                <Link
                  href={`${devPrefix}/settings/notifications`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <div className="flex items-center">
                    <Bell className="h-4 w-4 mr-2" />
                    <span>Notifications</span>
                  </div>
                  <div className="pl-6 mt-1 text-xs text-gray-500">Email templates, automatic alerts</div>
                </Link>
                <Link
                  href={`${devPrefix}/settings/security`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    <span>Security & Compliance</span>
                  </div>
                  <div className="pl-6 mt-1 text-xs text-gray-500">2FA, password policies, GDPR settings</div>
                </Link>
                <Link
                  href={`${devPrefix}/settings/audit`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <div className="flex items-center">
                    <FileDigit className="h-4 w-4 mr-2" />
                    <span>Audit Logs</span>
                  </div>
                  <div className="pl-6 mt-1 text-xs text-gray-500">Track system and user actions</div>
                </Link>
              </div>
            )}
          </div>

          {/* 5. Support & Helpdesk */}
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
                  <div className="flex items-center">
                    <Ticket className="h-4 w-4 mr-2" />
                    <span>Support Tickets</span>
                  </div>
                  <div className="pl-6 mt-1 text-xs text-gray-500">Assign, prioritize, resolve tickets</div>
                </Link>
                <Link
                  href={`${devPrefix}/support/faqs`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    <span>FAQs</span>
                  </div>
                  <div className="pl-6 mt-1 text-xs text-gray-500">Edit, add, delete, categorize FAQs</div>
                </Link>
                <Link
                  href={`${devPrefix}/support/contact`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <div className="flex items-center">
                    <PhoneCall className="h-4 w-4 mr-2" />
                    <span>Contact Support</span>
                  </div>
                  <div className="pl-6 mt-1 text-xs text-gray-500">Direct contact info, help center links</div>
                </Link>
                <Link
                  href={`${devPrefix}/support/status`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span>System Status</span>
                  </div>
                  <div className="pl-6 mt-1 text-xs text-gray-500">Server uptime, maintenance notifications</div>
                </Link>
              </div>
            )}
          </div>

          {/* 6. Advanced Analytics */}
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
                  <div className="flex items-center">
                    <Activity className="h-4 w-4 mr-2" />
                    <span>System Analytics</span>
                  </div>
                  <div className="pl-6 mt-1 text-xs text-gray-500">App performance, response times, server health</div>
                </Link>
                <Link
                  href={`${devPrefix}/analytics/users`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>User Analytics</span>
                  </div>
                  <div className="pl-6 mt-1 text-xs text-gray-500">User behavior, engagement, feature usage</div>
                </Link>
                <Link
                  href={`${devPrefix}/analytics/usage`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <div className="flex items-center">
                    <PieChart className="h-4 w-4 mr-2" />
                    <span>App Usage</span>
                  </div>
                  <div className="pl-6 mt-1 text-xs text-gray-500">Usage patterns, peak times, feature adoption</div>
                </Link>
              </div>
            )}
          </div>

          {/* 7. Marketing & Communication */}
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
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    <span>Campaigns & Promotions</span>
                  </div>
                  <div className="pl-6 mt-1 text-xs text-gray-500">Create promotional campaigns, discount codes</div>
                </Link>
                <Link
                  href={`${devPrefix}/marketing/templates`}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <div className="flex items-center">
                    <Send className="h-4 w-4 mr-2" />
                    <span>Communication Templates</span>
                  </div>
                  <div className="pl-6 mt-1 text-xs text-gray-500">Email templates, push notifications, SMS</div>
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
