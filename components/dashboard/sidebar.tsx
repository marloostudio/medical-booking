"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import {
  Calendar,
  Users,
  Settings,
  BarChart2,
  Bell,
  FileText,
  CreditCard,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  LogOut,
  Home,
  UserPlus,
  Clock,
  FileSpreadsheet,
  CalendarDays,
  CalendarPlus,
  ListChecks,
  UserCog,
  Stethoscope,
  DollarSign,
  Receipt,
  RefreshCcw,
  MessageSquare,
  BellRing,
  Shield,
  Activity,
  PieChart,
  LineChart,
  Building,
  Globe,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"

type MenuSection = {
  id: string
  title: string
  icon: React.ReactNode
  items: MenuItem[]
}

type MenuItem = {
  title: string
  href: string
  icon: React.ReactNode
}

export function Sidebar() {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    dashboard: true,
    patients: false,
    appointments: false,
    staff: false,
    payments: false,
    notifications: false,
    admin: false,
    analytics: false,
    settings: false,
  })

  // Update open state based on current path
  useEffect(() => {
    const pathSegments = pathname.split("/")
    if (pathSegments.length > 1) {
      const section = pathSegments[1] // e.g., /dashboard/patients -> dashboard
      const subsection = pathSegments.length > 2 ? pathSegments[2] : null // e.g., /dashboard/patients -> patients

      if (subsection && !openMenus[subsection]) {
        setOpenMenus((prev) => ({
          ...prev,
          [subsection]: true,
        }))
      }
    }
  }, [pathname])

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  const menuSections: MenuSection[] = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: <Home className="h-5 w-5 text-teal-600" />,
      items: [
        {
          title: "Overview",
          href: "/dashboard",
          icon: <BarChart2 className="h-4 w-4 mr-2" />,
        },
      ],
    },
    {
      id: "patients",
      title: "Patients",
      icon: <Users className="h-5 w-5 text-teal-600" />,
      items: [
        {
          title: "View Patients",
          href: "/dashboard/patients",
          icon: <Users className="h-4 w-4 mr-2" />,
        },
        {
          title: "Add Patient",
          href: "/dashboard/patients/new",
          icon: <UserPlus className="h-4 w-4 mr-2" />,
        },
        {
          title: "Import Patients",
          href: "/dashboard/patients/import",
          icon: <FileSpreadsheet className="h-4 w-4 mr-2" />,
        },
      ],
    },
    {
      id: "appointments",
      title: "Appointments",
      icon: <Calendar className="h-5 w-5 text-teal-600" />,
      items: [
        {
          title: "Calendar View",
          href: "/dashboard/appointments/calendar",
          icon: <CalendarDays className="h-4 w-4 mr-2" />,
        },
        {
          title: "Book Appointment",
          href: "/dashboard/appointments/new",
          icon: <CalendarPlus className="h-4 w-4 mr-2" />,
        },
        {
          title: "Appointment Types",
          href: "/dashboard/settings/appointment-types",
          icon: <ListChecks className="h-4 w-4 mr-2" />,
        },
        {
          title: "Upcoming Appointments",
          href: "/dashboard/appointments/upcoming",
          icon: <Clock className="h-4 w-4 mr-2" />,
        },
        {
          title: "Past Appointments",
          href: "/dashboard/appointments/past",
          icon: <FileText className="h-4 w-4 mr-2" />,
        },
      ],
    },
    {
      id: "staff",
      title: "Staff & Providers",
      icon: <Stethoscope className="h-5 w-5 text-teal-600" />,
      items: [
        {
          title: "Manage Staff",
          href: "/dashboard/settings/staff",
          icon: <UserCog className="h-4 w-4 mr-2" />,
        },
        {
          title: "Provider Availability",
          href: "/dashboard/settings/availability",
          icon: <Clock className="h-4 w-4 mr-2" />,
        },
        {
          title: "Roles & Permissions",
          href: "/dashboard/settings/roles",
          icon: <Shield className="h-4 w-4 mr-2" />,
        },
      ],
    },
    {
      id: "payments",
      title: "Payments",
      icon: <CreditCard className="h-5 w-5 text-teal-600" />,
      items: [
        {
          title: "Invoices & Payments",
          href: "/dashboard/payments",
          icon: <Receipt className="h-4 w-4 mr-2" />,
        },
        {
          title: "Process Refunds",
          href: "/dashboard/payments/refunds",
          icon: <RefreshCcw className="h-4 w-4 mr-2" />,
        },
        {
          title: "Payment Settings",
          href: "/dashboard/settings/payment",
          icon: <DollarSign className="h-4 w-4 mr-2" />,
        },
      ],
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: <Bell className="h-5 w-5 text-teal-600" />,
      items: [
        {
          title: "Appointment Reminders",
          href: "/dashboard/notifications/reminders",
          icon: <BellRing className="h-4 w-4 mr-2" />,
        },
        {
          title: "Message Templates",
          href: "/dashboard/notifications/templates",
          icon: <MessageSquare className="h-4 w-4 mr-2" />,
        },
        {
          title: "Notification History",
          href: "/dashboard/notifications/history",
          icon: <FileText className="h-4 w-4 mr-2" />,
        },
      ],
    },
    {
      id: "analytics",
      title: "Analytics",
      icon: <BarChart2 className="h-5 w-5 text-teal-600" />,
      items: [
        {
          title: "Appointment Reports",
          href: "/dashboard/analytics/appointments",
          icon: <LineChart className="h-4 w-4 mr-2" />,
        },
        {
          title: "Patient Reports",
          href: "/dashboard/analytics/patients",
          icon: <PieChart className="h-4 w-4 mr-2" />,
        },
        {
          title: "Reminder Reports",
          href: "/dashboard/analytics/reminders",
          icon: <Activity className="h-4 w-4 mr-2" />,
        },
      ],
    },
    {
      id: "settings",
      title: "Settings",
      icon: <Settings className="h-5 w-5 text-teal-600" />,
      items: [
        {
          title: "Profile Settings",
          href: "/dashboard/settings/profile",
          icon: <User className="h-4 w-4 mr-2" />,
        },
        {
          title: "Clinic Information",
          href: "/dashboard/settings/clinic",
          icon: <Building className="h-4 w-4 mr-2" />,
        },
        {
          title: "Booking Rules",
          href: "/dashboard/settings/booking-rules",
          icon: <ListChecks className="h-4 w-4 mr-2" />,
        },
        {
          title: "Platform Settings",
          href: "/dashboard/settings/platform",
          icon: <Globe className="h-4 w-4 mr-2" />,
        },
      ],
    },
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-blue-600">BookingLink</h2>
        <p className="text-xs text-gray-500 mt-1">Clinic Management Portal</p>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {menuSections.map((section) => (
            <div key={section.id}>
              <button
                onClick={() => toggleMenu(section.id)}
                className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded-md"
              >
                <div className="flex items-center">
                  {section.icon}
                  <span className="ml-3 font-medium">{section.title}</span>
                </div>
                {openMenus[section.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              {openMenus[section.id] && (
                <div className="pl-10 space-y-1 mt-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block px-4 py-2 text-sm rounded-md flex items-center",
                        pathname === item.href
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-100 hover:text-blue-600",
                      )}
                    >
                      {item.icon}
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Help & Support */}
          <Link
            href="/dashboard/help"
            className={cn(
              "flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded-md",
              pathname === "/dashboard/help" && "bg-blue-50 text-blue-600",
            )}
          >
            <HelpCircle className="mr-3 h-5 w-5" />
            Help & Support
          </Link>
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <Link
          href="/logout"
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded-md"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </Link>
      </div>
    </div>
  )
}
