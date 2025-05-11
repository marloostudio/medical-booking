"use client"

import { useState } from "react"
import { Users, Building2, Calendar, CreditCard, Bell, HelpCircle, Shield } from "lucide-react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function SuperAdminDashboard() {
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const toggleSection = (section: string) => {
    if (expandedSections.includes(section)) {
      setExpandedSections(expandedSections.filter((s) => s !== section))
    } else {
      setExpandedSections([...expandedSections, section])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
            <div className="text-sm text-gray-500">Version: {new Date().toISOString().split("T")[0]}</div>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-teal-500 pl-4 py-2">
                  <p className="text-sm text-gray-500">Today, 10:30 AM</p>
                  <p className="font-medium">New clinic registered: Wellness Center</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="text-sm text-gray-500">Yesterday, 3:45 PM</p>
                  <p className="font-medium">Subscription upgraded: Family Care Clinic</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <p className="text-sm text-gray-500">Yesterday, 11:20 AM</p>
                  <p className="font-medium">Support ticket resolved: #4582</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4 py-2">
                  <p className="text-sm text-gray-500">May 9, 2025, 2:15 PM</p>
                  <p className="font-medium">New admin user added: Sarah Johnson</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">System Health</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span>API Services</span>
                  </div>
                  <span className="text-green-600 font-medium">Operational</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span>Database</span>
                  </div>
                  <span className="text-green-600 font-medium">Operational</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span>Authentication</span>
                  </div>
                  <span className="text-green-600 font-medium">Operational</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span>Notification Service</span>
                  </div>
                  <span className="text-yellow-600 font-medium">Degraded</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Quick Actions</h2>
              <p className="text-gray-500 mt-1">Manage key aspects of the BookingLink platform</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center mb-3">
                    <Building2 className="h-6 w-6 text-teal-600 mr-2" />
                    <h3 className="font-medium">Add New Clinic</h3>
                  </div>
                  <p className="text-sm text-gray-500">Register a new clinic in the system</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center mb-3">
                    <Users className="h-6 w-6 text-blue-600 mr-2" />
                    <h3 className="font-medium">Manage Users</h3>
                  </div>
                  <p className="text-sm text-gray-500">Add, edit or remove user accounts</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center mb-3">
                    <CreditCard className="h-6 w-6 text-green-600 mr-2" />
                    <h3 className="font-medium">Subscription Plans</h3>
                  </div>
                  <p className="text-sm text-gray-500">Manage available subscription tiers</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center mb-3">
                    <Bell className="h-6 w-6 text-purple-600 mr-2" />
                    <h3 className="font-medium">Notification Templates</h3>
                  </div>
                  <p className="text-sm text-gray-500">Configure email and SMS templates</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center mb-3">
                    <Shield className="h-6 w-6 text-red-600 mr-2" />
                    <h3 className="font-medium">Security Settings</h3>
                  </div>
                  <p className="text-sm text-gray-500">Manage platform security policies</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center mb-3">
                    <HelpCircle className="h-6 w-6 text-orange-600 mr-2" />
                    <h3 className="font-medium">Support Tickets</h3>
                  </div>
                  <p className="text-sm text-gray-500">View and manage support requests</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
