import { PageTemplate } from "@/components/dashboard/page-template"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Download } from "lucide-react"

export default function NotificationHistoryPage() {
  // Sample data - would be fetched from database in real implementation
  const notifications = [
    {
      id: 1,
      recipient: "John Doe",
      type: "SMS",
      content: "Reminder: Your appointment is tomorrow at 9:00 AM",
      status: "Delivered",
      sentAt: "2023-05-14 08:00 AM",
    },
    {
      id: 2,
      recipient: "Jane Smith",
      type: "Email",
      content: "Your lab results are ready",
      status: "Opened",
      sentAt: "2023-05-13 10:30 AM",
    },
    {
      id: 3,
      recipient: "Robert Brown",
      type: "SMS",
      content: "Reminder: Your appointment is tomorrow at 2:15 PM",
      status: "Failed",
      sentAt: "2023-05-13 08:00 AM",
    },
    {
      id: 4,
      recipient: "Emily Johnson",
      type: "Email",
      content: "Appointment confirmation",
      status: "Delivered",
      sentAt: "2023-05-12 03:45 PM",
    },
    {
      id: 5,
      recipient: "Michael Wilson",
      type: "SMS",
      content: "Your prescription is ready for pickup",
      status: "Delivered",
      sentAt: "2023-05-11 11:20 AM",
    },
  ]

  return (
    <PageTemplate title="Notification History" description="View your sent notification history">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search notifications..." className="pl-8" />
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Notification Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="app">App Notification</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="opened">Opened</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Log</CardTitle>
          <CardDescription>Complete history of all sent notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recipient</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell>{notification.recipient}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        notification.type === "SMS"
                          ? "bg-blue-100 text-blue-800"
                          : notification.type === "Email"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {notification.type}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{notification.content}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        notification.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : notification.status === "Opened"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {notification.status}
                    </span>
                  </TableCell>
                  <TableCell>{notification.sentAt}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">Resend</button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageTemplate>
  )
}
