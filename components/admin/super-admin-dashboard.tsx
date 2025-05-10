"use client"

import { useState } from "react"
import {
  Users,
  Building2,
  Calendar,
  CreditCard,
  Bell,
  BarChart2,
  Settings,
  HelpCircle,
  Shield,
  UserCog,
  UserPlus,
  Stethoscope,
  User,
  KeyRound,
  List,
  Sliders,
  MapPin,
  Package,
  ClipboardList,
  RefreshCw,
  XCircle,
  DollarSign,
  FileText,
  CreditCardIcon as CardIcon,
  Tag,
  FileEdit,
  ClipboardCheck,
  MessageSquare,
  Send,
  Activity,
  Download,
  Globe,
  Key,
  Lock,
  Database,
  FileDigit,
  Ticket,
  PhoneCall,
  BadgeIcon as StatusIcon,
  FileCheck,
  FileCog,
  FileX,
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import AdminNav from "@/components/admin/admin-nav"

export default function SuperAdminDashboard() {
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const toggleSection = (section: string) => {
    if (expandedSections.includes(section)) {
      setExpandedSections(expandedSections.filter((s) => s !== section))
    } else {
      setExpandedSections([...expandedSections, section])
    }
  }

  const sections = [
    {
      id: "user-management",
      title: "User Management",
      icon: <Users className="h-5 w-5 text-teal-600" />,
      items: [
        {
          title: "Admins",
          icon: <UserCog className="h-4 w-4 mr-2" />,
          description: "Manage clinic admins, add/edit/delete.",
        },
        {
          title: "Clinic Owners",
          icon: <UserPlus className="h-4 w-4 mr-2" />,
          description: "View and manage clinic owner profiles.",
        },
        {
          title: "Staff",
          icon: <Stethoscope className="h-4 w-4 mr-2" />,
          description: "Manage medical staff and receptionists.",
        },
        {
          title: "Patients",
          icon: <User className="h-4 w-4 mr-2" />,
          description: "Overview and control of patient data.",
        },
        {
          title: "Permissions & Roles",
          icon: <KeyRound className="h-4 w-4 mr-2" />,
          description: "Create and manage role-based permissions.",
        },
      ],
    },
    {
      id: "clinic-management",
      title: "Clinic Management",
      icon: <Building2 className="h-5 w-5 text-teal-600" />,
      items: [
        {
          title: "Clinic List",
          icon: <List className="h-4 w-4 mr-2" />,
          description: "View, add, edit, or remove clinics.",
        },
        {
          title: "Settings",
          icon: <Sliders className="h-4 w-4 mr-2" />,
          description: "Configure clinic preferences and defaults.",
        },
        {
          title: "Locations",
          icon: <MapPin className="h-4 w-4 mr-2" />,
          description: "Manage multiple locations under one clinic.",
        },
        {
          title: "Subscription Plans",
          icon: <Package className="h-4 w-4 mr-2" />,
          description: "View and assign subscription tiers.",
        },
      ],
    },
    {
      id: "appointment-management",
      title: "Appointment Management",
      icon: <Calendar className="h-5 w-5 text-teal-600" />,
      items: [
        {
          title: "Appointment Logs",
          icon: <ClipboardList className="h-4 w-4 mr-2" />,
          description: "View all clinic appointments.",
        },
        {
          title: "Rescheduling Policies",
          icon: <RefreshCw className="h-4 w-4 mr-2" />,
          description: "Set or update policies for appointment changes.",
        },
        {
          title: "Cancellation Policies",
          icon: <XCircle className="h-4 w-4 mr-2" />,
          description: "Define global cancellation rules.",
        },
      ],
    },
    {
      id: "subscription-billing",
      title: "Subscription & Billing",
      icon: <CreditCard className="h-5 w-5 text-teal-600" />,
      items: [
        {
          title: "Billing Overview",
          icon: <DollarSign className="h-4 w-4 mr-2" />,
          description: "Track subscription payments and dues.",
        },
        {
          title: "Invoices",
          icon: <FileText className="h-4 w-4 mr-2" />,
          description: "Generate and review billing documents.",
        },
        {
          title: "Payment Methods",
          icon: <CardIcon className="h-4 w-4 mr-2" />,
          description: "Configure or update payment options.",
        },
        {
          title: "Pricing Plans",
          icon: <Package className="h-4 w-4 mr-2" />,
          description: "Manage subscription tiers and associated features.",
        },
        {
          title: "Discounts & Coupons",
          icon: <Tag className="h-4 w-4 mr-2" />,
          description: "Create and manage promotional offers.",
        },
      ],
    },
    {
      id: "notifications-communication",
      title: "Notifications & Communication",
      icon: <Bell className="h-5 w-5 text-teal-600" />,
      items: [
        {
          title: "Templates",
          icon: <FileEdit className="h-4 w-4 mr-2" />,
          description: "Configure email/SMS templates for reminders.",
        },
        {
          title: "Logs",
          icon: <ClipboardCheck className="h-4 w-4 mr-2" />,
          description: "View sent notifications and responses.",
        },
        {
          title: "Message Center",
          icon: <MessageSquare className="h-4 w-4 mr-2" />,
          description: "Centralized communication hub for system alerts.",
        },
        {
          title: "Broadcast Messages",
          icon: <Send className="h-4 w-4 mr-2" />,
          description: "Send announcements to all clinics or users.",
        },
      ],
    },
    {
      id: "reports-analytics",
      title: "Reports & Analytics",
      icon: <BarChart2 className="h-5 w-5 text-teal-600" />,
      items: [
        {
          title: "Usage Reports",
          icon: <Activity className="h-4 w-4 mr-2" />,
          description: "Track clinic performance and bookings.",
        },
        {
          title: "Financial Reports",
          icon: <DollarSign className="h-4 w-4 mr-2" />,
          description: "Overview of revenue and subscription metrics.",
        },
        {
          title: "User Activity",
          icon: <Users className="h-4 w-4 mr-2" />,
          description: "Monitor logins and actions performed by users.",
        },
        {
          title: "System Health",
          icon: <Activity className="h-4 w-4 mr-2" />,
          description: "Status of integrated services (e.g., Twilio, SendGrid).",
        },
        {
          title: "Export Data",
          icon: <Download className="h-4 w-4 mr-2" />,
          description: "Download reports in CSV/PDF format.",
        },
      ],
    },
    {
      id: "system-settings",
      title: "System Settings",
      icon: <Settings className="h-5 w-5 text-teal-600" />,
      items: [
        {
          title: "Global Settings",
          icon: <Globe className="h-4 w-4 mr-2" />,
          description: "Configure application-wide settings.",
        },
        {
          title: "API Integrations",
          icon: <Key className="h-4 w-4 mr-2" />,
          description: "Connect third-party services (Twilio, SendGrid, etc.).",
        },
        {
          title: "Security Settings",
          icon: <Lock className="h-4 w-4 mr-2" />,
          description: "Manage access controls and data protection policies.",
        },
        {
          title: "Backup & Restore",
          icon: <Database className="h-4 w-4 mr-2" />,
          description: "System backup and rollback options.",
        },
        {
          title: "Audit Log",
          icon: <FileDigit className="h-4 w-4 mr-2" />,
          description: "Track changes and admin actions.",
        },
      ],
    },
    {
      id: "support-help",
      title: "Support & Help",
      icon: <HelpCircle className="h-5 w-5 text-teal-600" />,
      items: [
        {
          title: "Knowledge Base",
          icon: <FileCheck className="h-4 w-4 mr-2" />,
          description: "Access tutorials and FAQs.",
        },
        {
          title: "Ticket System",
          icon: <Ticket className="h-4 w-4 mr-2" />,
          description: "Manage support requests from clinics.",
        },
        {
          title: "Contact Support",
          icon: <PhoneCall className="h-4 w-4 mr-2" />,
          description: "Reach out to BookingLink technical support.",
        },
        {
          title: "System Status",
          icon: <StatusIcon className="h-4 w-4 mr-2" />,
          description: "Check for downtime or maintenance.",
        },
      ],
    },
    {
      id: "legal-compliance",
      title: "Legal & Compliance",
      icon: <Shield className="h-5 w-5 text-teal-600" />,
      items: [
        {
          title: "GDPR Settings",
          icon: <FileCog className="h-4 w-4 mr-2" />,
          description: "Manage data privacy and compliance requirements.",
        },
        {
          title: "Terms & Policies",
          icon: <FileCheck className="h-4 w-4 mr-2" />,
          description: "Update legal documents for clinics.",
        },
        {
          title: "Data Export/Deletion",
          icon: <FileX className="h-4 w-4 mr-2" />,
          description: "Compliance with user data requests.",
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav currentPath="/admin/dashboard" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <div className="text-sm text-gray-500">
            Version: {new Date().toISOString().split("T")[0]}
            {/* Adding a date stamp to verify deployment */}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Platform Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-teal-50 p-4 rounded-md border border-teal-200">
                <div className="flex items-center">
                  <Building2 className="h-8 w-8 text-teal-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Total Clinics</p>
                    <p className="text-2xl font-bold text-gray-900">24</p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">156</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-md border border-purple-200">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Appointments</p>
                    <p className="text-2xl font-bold text-gray-900">1,248</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-md border border-green-200">
                <div className="flex items-center">
                  <CreditCard className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">$12,450</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Admin Control Panel</h2>
            <p className="text-gray-500 mt-1">Manage all aspects of the BookingLink platform</p>
          </div>

          <div className="p-6">
            <Accordion type="multiple" value={expandedSections} className="space-y-4">
              {sections.map((section) => (
                <AccordionItem
                  key={section.id}
                  value={section.id}
                  className="border border-gray-200 rounded-md overflow-hidden"
                >
                  <AccordionTrigger
                    onClick={() => toggleSection(section.id)}
                    className="px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center">
                      {section.icon}
                      <span className="ml-2 font-medium">{section.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-4">
                    <div className="space-y-3">
                      {section.items.map((item, index) => (
                        <div
                          key={index}
                          className="p-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100"
                        >
                          <div className="flex items-center">
                            {item.icon}
                            <div>
                              <h3 className="font-medium text-gray-900">{item.title}</h3>
                              <p className="text-sm text-gray-500">{item.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  )
}
