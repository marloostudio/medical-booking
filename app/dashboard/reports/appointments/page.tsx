"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Calendar, UserX, X } from "lucide-react"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip,
} from "recharts"

export default function AppointmentReportsPage() {
  // Sample data for charts
  const appointmentData = [
    { month: "Jan", appointments: 120, noShows: 8, cancellations: 12 },
    { month: "Feb", appointments: 150, noShows: 10, cancellations: 15 },
    { month: "Mar", appointments: 180, noShows: 12, cancellations: 18 },
    { month: "Apr", appointments: 200, noShows: 15, cancellations: 20 },
    { month: "May", appointments: 220, noShows: 12, cancellations: 22 },
    { month: "Jun", appointments: 250, noShows: 18, cancellations: 25 },
  ]

  const timeSlotData = [
    { time: "8-9 AM", count: 45 },
    { time: "9-10 AM", count: 60 },
    { time: "10-11 AM", count: 75 },
    { time: "11-12 PM", count: 65 },
    { time: "12-1 PM", count: 30 },
    { time: "1-2 PM", count: 50 },
    { time: "2-3 PM", count: 70 },
    { time: "3-4 PM", count: 55 },
    { time: "4-5 PM", count: 40 },
  ]

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Appointment Reports</h1>
        <p className="text-muted-foreground">Generate and view reports about appointment statistics</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last30">Last 30 Days</SelectItem>
              <SelectItem value="last90">Last 90 Days</SelectItem>
              <SelectItem value="last6months">Last 6 Months</SelectItem>
              <SelectItem value="lastyear">Last Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              <SelectItem value="dr-smith">Dr. Smith</SelectItem>
              <SelectItem value="dr-johnson">Dr. Johnson</SelectItem>
              <SelectItem value="dr-williams">Dr. Williams</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Appointment Trends</TabsTrigger>
          <TabsTrigger value="noShows">No-Shows</TabsTrigger>
          <TabsTrigger value="timeSlots">Popular Time Slots</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                  Total Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1,120</div>
                <p className="text-sm text-green-600">↑ 12% from last period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <UserX className="h-5 w-5 mr-2 text-red-500" />
                  No-Show Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">6.8%</div>
                <p className="text-sm text-red-600">↑ 1.2% from last period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <X className="h-5 w-5 mr-2 text-orange-500" />
                  Cancellation Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">9.3%</div>
                <p className="text-sm text-green-600">↓ 0.5% from last period</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Appointment Overview</CardTitle>
              <CardDescription>6-month trend of appointments, no-shows, and cancellations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={appointmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="appointments"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Total Appointments"
                    />
                    <Line type="monotone" dataKey="noShows" stroke="#ef4444" strokeWidth={2} name="No-Shows" />
                    <Line
                      type="monotone"
                      dataKey="cancellations"
                      stroke="#f97316"
                      strokeWidth={2}
                      name="Cancellations"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Popular Appointment Times</CardTitle>
              <CardDescription>Distribution of appointments by time slot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeSlotData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" name="Appointment Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Trends</CardTitle>
              <CardDescription>Detailed analysis of appointment trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border border-dashed rounded-lg">
                <p className="text-muted-foreground">Appointment trends content will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="noShows">
          <Card>
            <CardHeader>
              <CardTitle>No-Show Analysis</CardTitle>
              <CardDescription>Detailed analysis of appointment no-shows</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border border-dashed rounded-lg">
                <p className="text-muted-foreground">No-show analysis content will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeSlots">
          <Card>
            <CardHeader>
              <CardTitle>Popular Time Slots</CardTitle>
              <CardDescription>Analysis of most popular appointment time slots</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border border-dashed rounded-lg">
                <p className="text-muted-foreground">Time slot analysis content will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
