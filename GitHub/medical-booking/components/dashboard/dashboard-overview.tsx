"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { subDays, startOfDay, endOfDay } from "date-fns"
import {
  CalendarIcon,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  BarChart2,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"

export function DashboardOverview() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [timeframe, setTimeframe] = useState<string>("today")
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    canceledAppointments: 0,
    totalPatients: 0,
    newPatients: 0,
    revenue: 0,
    appointmentsTrend: 5, // Percentage change
    patientsTrend: 12,
    revenueTrend: 8,
  })
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([])
  const [recentPatients, setRecentPatients] = useState<any[]>([])

  // Temporary clinic ID for development
  const clinicId = "demo-clinic-123"

  useEffect(() => {
    fetchDashboardData()
  }, [timeframe])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // In a real app, these would be actual Firestore queries
      // For demo purposes, we'll use mock data

      // Calculate date range based on selected timeframe
      let startDate = new Date()
      let endDate = new Date()

      switch (timeframe) {
        case "today":
          startDate = startOfDay(new Date())
          endDate = endOfDay(new Date())
          break
        case "week":
          startDate = startOfDay(subDays(new Date(), 7))
          endDate = endOfDay(new Date())
          break
        case "month":
          startDate = startOfDay(subDays(new Date(), 30))
          endDate = endOfDay(new Date())
          break
        case "year":
          startDate = startOfDay(subDays(new Date(), 365))
          endDate = endOfDay(new Date())
          break
      }

      // Mock data based on timeframe
      const multiplier = timeframe === "today" ? 1 : timeframe === "week" ? 7 : timeframe === "month" ? 30 : 365

      setStats({
        totalAppointments: 12 * multiplier,
        completedAppointments: 8 * multiplier,
        canceledAppointments: 2 * multiplier,
        totalPatients: 156,
        newPatients: 4 * multiplier,
        revenue: 1250 * multiplier,
        appointmentsTrend: 5,
        patientsTrend: 12,
        revenueTrend: 8,
      })

      // Mock upcoming appointments
      setUpcomingAppointments([
        {
          id: 1,
          patient: "John Doe",
          time: "9:00 AM",
          date: "Today",
          type: "Check-up",
          status: "confirmed",
          provider: "Dr. Sarah Johnson",
        },
        {
          id: 2,
          patient: "Jane Smith",
          time: "11:30 AM",
          date: "Today",
          type: "Consultation",
          status: "confirmed",
          provider: "Dr. Michael Brown",
        },
        {
          id: 3,
          patient: "Robert Johnson",
          time: "2:15 PM",
          date: "Tomorrow",
          type: "Follow-up",
          status: "pending",
          provider: "Dr. Sarah Johnson",
        },
        {
          id: 4,
          patient: "Emily Wilson",
          time: "10:00 AM",
          date: "May 15, 2023",
          type: "Annual Physical",
          status: "confirmed",
          provider: "Dr. Michael Brown",
        },
      ])

      // Mock recent patients
      setRecentPatients([
        { id: 1, name: "John Doe", lastVisit: "2 days ago", status: "Active" },
        { id: 2, name: "Jane Smith", lastVisit: "1 week ago", status: "Active" },
        { id: 3, name: "Robert Johnson", lastVisit: "2 weeks ago", status: "Inactive" },
        { id: 4, name: "Emily Wilson", lastVisit: "1 month ago", status: "Active" },
      ])
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
          <p className="text-muted-foreground">Here's an overview of your clinic's performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAppointments}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className={`flex items-center ${stats.appointmentsTrend >= 0 ? "text-green-500" : "text-red-500"}`}>
                {stats.appointmentsTrend >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                {Math.abs(stats.appointmentsTrend)}%
              </span>
              <span>from previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatients}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {stats.patientsTrend}%
              </span>
              <span>from previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newPatients}</div>
            <p className="text-xs text-muted-foreground">In the selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue.toLocaleString()}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {stats.revenueTrend}%
              </span>
              <span>from previous period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>You have {upcomingAppointments.length} appointments scheduled</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>
                        {appointment.patient
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{appointment.patient}</p>
                      <p className="text-xs text-muted-foreground">{appointment.type}</p>
                      <p className="text-xs text-muted-foreground">{appointment.provider}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className="text-sm">
                        {appointment.time}, {appointment.date}
                      </p>
                    </div>
                    <Badge variant={appointment.status === "confirmed" ? "default" : "outline"}>
                      {appointment.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/appointments">
                  View All Appointments
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Appointment Calendar</CardTitle>
            <CardDescription>Schedule and manage your appointments</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
            <Button className="mt-4 w-full" asChild>
              <Link href="/dashboard/appointments/new">Book New Appointment</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
            <CardDescription>You have {recentPatients.length} recently active patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPatients.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>
                        {patient.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{patient.name}</p>
                      <p className="text-xs text-muted-foreground">Last visit: {patient.lastVisit}</p>
                    </div>
                  </div>
                  <Badge variant={patient.status === "Active" ? "default" : "outline"}>{patient.status}</Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/patients">
                  View All Patients
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Appointment Statistics</CardTitle>
            <CardDescription>Overview of appointment status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{stats.completedAppointments}</span>
                  <span className="text-xs text-muted-foreground">
                    ({Math.round((stats.completedAppointments / stats.totalAppointments) * 100)}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center">
                  <XCircle className="h-4 w-4 text-red-500 mr-2" />
                  <span>Canceled</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{stats.canceledAppointments}</span>
                  <span className="text-xs text-muted-foreground">
                    ({Math.round((stats.canceledAppointments / stats.totalAppointments) * 100)}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                  <span>Pending</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">
                    {stats.totalAppointments - stats.completedAppointments - stats.canceledAppointments}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    (
                    {Math.round(
                      ((stats.totalAppointments - stats.completedAppointments - stats.canceledAppointments) /
                        stats.totalAppointments) *
                        100,
                    )}
                    %)
                  </span>
                </div>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/analytics">
                  View Detailed Analytics
                  <BarChart2 className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
