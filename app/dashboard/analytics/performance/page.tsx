"use client"

import { PageTemplate, PageCard } from "@/components/dashboard/page-template"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip } from "recharts"

// Sample data - would normally come from your database
const performanceData = [
  { month: "Jan", appointments: 120, utilization: 75, revenue: 15000 },
  { month: "Feb", appointments: 135, utilization: 78, revenue: 16500 },
  { month: "Mar", appointments: 150, utilization: 82, revenue: 18000 },
  { month: "Apr", appointments: 165, utilization: 85, revenue: 19500 },
  { month: "May", appointments: 180, utilization: 88, revenue: 21000 },
  { month: "Jun", appointments: 195, utilization: 90, revenue: 22500 },
]

export default function PerformanceAnalyticsPage() {
  return (
    <PageTemplate title="Performance Analytics" description="View performance metrics and insights for your clinic">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              <SelectItem value="dr1">Dr. Smith</SelectItem>
              <SelectItem value="dr2">Dr. Johnson</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline">Export Data</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <PageCard title="Appointment Volume">
          <div className="text-center p-4">
            <p className="text-4xl font-bold">945</p>
            <p className="text-sm text-muted-foreground">Last 6 months</p>
            <p className="text-xs text-green-500 mt-2">↑ 12% from previous period</p>
          </div>
        </PageCard>

        <PageCard title="Avg. Utilization Rate">
          <div className="text-center p-4">
            <p className="text-4xl font-bold">83%</p>
            <p className="text-sm text-muted-foreground">Of available slots</p>
            <p className="text-xs text-green-500 mt-2">↑ 5% from previous period</p>
          </div>
        </PageCard>

        <PageCard title="Revenue Per Provider">
          <div className="text-center p-4">
            <p className="text-4xl font-bold">$18,750</p>
            <p className="text-sm text-muted-foreground">Monthly average</p>
            <p className="text-xs text-green-500 mt-2">↑ 8% from previous period</p>
          </div>
        </PageCard>
      </div>

      <Tabs defaultValue="trends">
        <TabsList className="mb-6">
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          <TabsTrigger value="providers">Provider Comparison</TabsTrigger>
          <TabsTrigger value="kpis">Key KPIs</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <PageCard title="Performance Trends" description="6-month overview of key performance metrics">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="appointments" stroke="#8884d8" strokeWidth={2} name="Appointments" />
                  <Line type="monotone" dataKey="utilization" stroke="#82ca9d" strokeWidth={2} name="Utilization %" />
                  <Line type="monotone" dataKey="revenue" stroke="#ffc658" strokeWidth={2} name="Revenue ($100s)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </PageCard>
        </TabsContent>

        <TabsContent value="providers">
          <PageCard title="Provider Performance Comparison" description="Compare performance metrics across providers">
            <div className="text-center py-8 text-muted-foreground">Provider comparison content would go here</div>
          </PageCard>
        </TabsContent>

        <TabsContent value="kpis">
          <PageCard title="Key Performance Indicators" description="Detailed breakdown of important KPIs">
            <div className="text-center py-8 text-muted-foreground">KPI breakdown content would go here</div>
          </PageCard>
        </TabsContent>
      </Tabs>
    </PageTemplate>
  )
}
