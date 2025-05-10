"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, subDays } from "date-fns"
import { CalendarIcon, BarChart, PieChart, Activity, MessageCircle } from "lucide-react"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  BarChart as RechartsBarChart,
  Pie,
  PieChart as RechartsPieChart,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ReminderAnalyticsProps {
  clinicId: string
}

export function ReminderAnalytics({ clinicId }: ReminderAnalyticsProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          `/api/analytics/reminders?startDate=${dateRange.from.toISOString()}&endDate=${dateRange.to.toISOString()}`,
        )

        if (!response.ok) {
          throw new Error("Failed to fetch reminder analytics")
        }

        const data = await response.json()
        setAnalytics(data)
      } catch (err) {
        console.error("Error fetching reminder analytics:", err)
        setError("Failed to load reminder analytics. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [dateRange])

  // Generate daily data for the chart
  const generateDailyData = () => {
    if (!analytics || !analytics.logs) return []

    const dailyMap = new Map()

    // Initialize with all dates in the range
    let currentDate = new Date(dateRange.from)
    while (currentDate <= dateRange.to) {
      const dateStr = format(currentDate, "yyyy-MM-dd")
      dailyMap.set(dateStr, {
        date: dateStr,
        sent: 0,
        delivered: 0,
        responded: 0,
      })
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1))
    }

    // Populate with actual data
    analytics.logs.forEach((log: any) => {
      const dateStr = format(new Date(log.sentAt), "yyyy-MM-dd")

      if (dailyMap.has(dateStr)) {
        const dayData = dailyMap.get(dateStr)
        dayData.sent += 1

        if (log.status === "delivered" || log.status === "responded") {
          dayData.delivered += 1
        }

        if (log.status === "responded") {
          dayData.responded += 1
        }
      }
    })

    return Array.from(dailyMap.values())
  }

  const dailyData = generateDailyData()

  // Data for channel breakdown pie chart
  const channelData = analytics?.channelBreakdown
    ? [
        { name: "SMS", value: analytics.channelBreakdown.sms },
        { name: "Email", value: analytics.channelBreakdown.email },
        { name: "Push", value: analytics.channelBreakdown.push },
      ]
    : []

  // Data for response types bar chart
  const responseData = analytics?.responseTypes
    ? [
        { name: "Confirm", value: analytics.responseTypes.confirm },
        { name: "Cancel", value: analytics.responseTypes.cancel },
        { name: "Reschedule", value: analytics.responseTypes.reschedule },
        { name: "No Response", value: analytics.responseTypes.none },
      ]
    : []

  // Colors for the pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold">Reminder Analytics</h2>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>
                  {format(dateRange.from, "MMM d, yyyy")} - {format(dateRange.to, "MMM d, yyyy")}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={{
                  from: dateRange.from,
                  to: dateRange.to,
                }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setDateRange({ from: range.from, to: range.to })
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">
            <Activity className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="trends">
            <BarChart className="h-4 w-4 mr-2" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="channels">
            <PieChart className="h-4 w-4 mr-2" />
            Channels
          </TabsTrigger>
          <TabsTrigger value="responses">
            <MessageCircle className="h-4 w-4 mr-2" />
            Responses
          </TabsTrigger>
        </TabsList>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-red-500">{error}</div>
          </div>
        ) : (
          <>
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Reminders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics?.totalReminders || 0}</div>
                    <p className="text-xs text-muted-foreground">During selected period</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analytics?.deliveryRate ? analytics.deliveryRate.toFixed(1) : 0}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {analytics?.deliveredCount || 0} of {analytics?.totalReminders || 0} delivered
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analytics?.responseRate ? analytics.responseRate.toFixed(1) : 0}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {analytics?.respondedCount || 0} of {analytics?.deliveredCount || 0} responded
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Confirmation Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analytics?.responseTypes && analytics.respondedCount
                        ? ((analytics.responseTypes.confirm / analytics.respondedCount) * 100).toFixed(1)
                        : 0}
                      %
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {analytics?.responseTypes?.confirm || 0} confirmations
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Reminder Activity</CardTitle>
                  <CardDescription>Daily reminder activity over the selected period</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      sent: {
                        label: "Sent",
                        color: "hsl(var(--chart-1))",
                      },
                      delivered: {
                        label: "Delivered",
                        color: "hsl(var(--chart-2))",
                      },
                      responded: {
                        label: "Responded",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dailyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line type="monotone" dataKey="sent" stroke="var(--color-sent)" name="Sent" />
                        <Line type="monotone" dataKey="delivered" stroke="var(--color-delivered)" name="Delivered" />
                        <Line type="monotone" dataKey="responded" stroke="var(--color-responded)" name="Responded" />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Reminder Trends</CardTitle>
                  <CardDescription>Reminder activity trends over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      sent: {
                        label: "Sent",
                        color: "hsl(var(--chart-1))",
                      },
                      delivered: {
                        label: "Delivered",
                        color: "hsl(var(--chart-2))",
                      },
                      responded: {
                        label: "Responded",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                    className="h-[400px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dailyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line type="monotone" dataKey="sent" stroke="var(--color-sent)" name="Sent" />
                        <Line type="monotone" dataKey="delivered" stroke="var(--color-delivered)" name="Delivered" />
                        <Line type="monotone" dataKey="responded" stroke="var(--color-responded)" name="Responded" />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="channels" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Channel Distribution</CardTitle>
                  <CardDescription>Breakdown of reminders by channel</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="h-[400px] w-full max-w-md">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={channelData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {channelData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} reminders`, "Count"]} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="responses" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Response Types</CardTitle>
                  <CardDescription>Breakdown of patient responses to reminders</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: {
                        label: "Count",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[400px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={responseData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="value" fill="var(--color-value)" name="Count" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}
