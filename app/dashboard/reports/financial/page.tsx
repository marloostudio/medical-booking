import { PageTemplate, PageCard } from "@/components/dashboard/page-template"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function FinancialReportsPage() {
  // Sample data - would normally come from your database
  const revenueData = [
    { month: "Jan", revenue: 12000, expenses: 8000 },
    { month: "Feb", revenue: 14000, expenses: 8500 },
    { month: "Mar", revenue: 16000, expenses: 9000 },
    { month: "Apr", revenue: 18000, expenses: 9500 },
    { month: "May", revenue: 20000, expenses: 10000 },
    { month: "Jun", revenue: 22000, expenses: 10500 },
  ]

  return (
    <PageTemplate title="Financial Reports" description="Generate and view financial reports for your clinic">
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
        </div>

        <Button variant="outline">Export Report</Button>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="outstanding">Outstanding</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <PageCard title="Total Revenue">
              <div className="text-center p-4">
                <p className="text-4xl font-bold">$102,000</p>
                <p className="text-sm text-muted-foreground">Last 6 months</p>
              </div>
            </PageCard>

            <PageCard title="Total Expenses">
              <div className="text-center p-4">
                <p className="text-4xl font-bold">$55,500</p>
                <p className="text-sm text-muted-foreground">Last 6 months</p>
              </div>
            </PageCard>

            <PageCard title="Net Profit">
              <div className="text-center p-4">
                <p className="text-4xl font-bold">$46,500</p>
                <p className="text-sm text-muted-foreground">45.6% margin</p>
              </div>
            </PageCard>
          </div>

          <PageCard title="Revenue vs Expenses" description="6-month overview of financial performance">
            <div className="h-[400px] w-full">
              <ChartContainer
                config={{
                  revenue: {
                    label: "Revenue",
                    color: "hsl(var(--chart-1))",
                  },
                  expenses: {
                    label: "Expenses",
                    color: "hsl(var(--chart-2))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="revenue" fill="var(--color-revenue)" />
                    <Bar dataKey="expenses" fill="var(--color-expenses)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </PageCard>
        </TabsContent>

        <TabsContent value="revenue">
          <PageCard title="Revenue Breakdown" description="Detailed analysis of revenue sources">
            <div className="text-center py-8 text-muted-foreground">Revenue breakdown content would go here</div>
          </PageCard>
        </TabsContent>

        <TabsContent value="expenses">
          <PageCard title="Expense Categories" description="Breakdown of expenses by category">
            <div className="text-center py-8 text-muted-foreground">Expense categories content would go here</div>
          </PageCard>
        </TabsContent>

        <TabsContent value="outstanding">
          <PageCard title="Outstanding Balances" description="Patients with outstanding balances">
            <div className="text-center py-8 text-muted-foreground">Outstanding balances content would go here</div>
          </PageCard>
        </TabsContent>
      </Tabs>
    </PageTemplate>
  )
}
