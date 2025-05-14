"use client"

import { useState, useEffect } from "react"
import { realtimeService } from "../../services/realtime-service"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell } from "lucide-react"

interface RealTimeNotificationsProps {
  clinicId: string
  userId: string
}

export default function RealTimeNotifications({ clinicId, userId }: RealTimeNotificationsProps) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Set up real-time listener for notifications
    const unsubscribeNotifications = realtimeService.listenToNotifications(clinicId, userId, (data) => {
      setNotifications(data)
      setLoading(false)
    })

    // Set up real-time listener for unread count
    const unsubscribeUnreadCount = realtimeService.listenToUnreadNotificationsCount(clinicId, userId, (count) => {
      setUnreadCount(count)
    })

    // Clean up listeners on component unmount
    return () => {
      unsubscribeNotifications()
      unsubscribeUnreadCount()
    }
  }, [clinicId, userId])

  // Mark a notification as read
  const markAsRead = async (notificationId: string) => {
    // This would be handled by your notification service
    console.log("Marking notification as read:", notificationId)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Notifications</CardTitle>
        {unreadCount > 0 && (
          <div className="bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs">
            {unreadCount}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`border rounded-lg p-4 ${notification.status !== "read" ? "bg-blue-50" : ""}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{notification.title}</h4>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(notification.sentAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
