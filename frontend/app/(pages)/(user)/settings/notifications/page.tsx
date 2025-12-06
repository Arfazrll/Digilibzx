"use client"

import { useEffect, useState } from "react"
import { Bell, Book, Calendar, Check, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { fetchNotificationsByUserId, updateNotificationsStatusById } from "@/lib/api"
import { Notification } from "@/types/interfaces"
import LoadingComponent from "@/components/loading"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>()
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const markAsRead = async (id: string) => {
    try {
      await updateNotificationsStatusById(id);
      // Jika berhasil, perbarui status di antarmuka
      setNotifications(prevNotifications =>
        prevNotifications?.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
      toast.success("Notifikasi berhasil ditandai sebagai telah dibaca.");
    } catch (error) {
      toast.error("Gagal memperbarui status notifikasi.");
    }
  };

  // Fetch Notifications
  useEffect(() => {
    async function loadNotifications() {
      setLoading(true);
      try {
        const userIDFromLocal: string = localStorage.getItem("userId") ?? '';
        const data = await fetchNotificationsByUserId(userIDFromLocal);
        setNotifications(data);
        setError('');
      } catch (err) {
        setError(`Failed to load books: ${err}`);
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, []);

  if (loading) {
    return <LoadingComponent description="Tunggu bentar, notifikasinya lagi diambil dari database..."/>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const getIconForNotificationType = (type: Notification["type"]) => {
    switch (type) {
      case "INFO":
        return <Bell className="h-4 w-4 text-blue-500" />
      case "REMINDER":
        return <Calendar className="h-4 w-4 text-yellow-500" />
      case "ALERT":
        return <Book className="h-4 w-4 text-red-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">
          Manage your notifications and stay updated with your library activities.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your Notifications</CardTitle>
          <CardDescription>View and manage your recent notifications.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            {/* <Button
              variant="outline"
              size="sm"
              onClick={markSelectedAsRead}
              disabled={selectedNotifications.length === 0}
            >
              Mark Selected as Read
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={deleteSelectedNotifications}
              disabled={selectedNotifications.length === 0}
            >
              Delete Selected
            </Button> */}
          </div>
          <ScrollArea className="h-[400px] pr-4">
            {notifications?.map((notification, index) => (
              <div key={notification.id}>
                {index > 0 && <Separator className="my-4" />}
                <div className="flex items-start space-x-4">
                  {/* <Checkbox
                    checked={selectedNotifications.includes(notification.id)}
                    onCheckedChange={() => toggleSelectNotification(notification.id)}
                  /> */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getIconForNotificationType(notification.type)}
                        <h3 className={`font-semibold ${notification.read ? 'text-muted-foreground' : ''}`}>
                          {notification.title}
                        </h3>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {notification.date}
                      </span>
                    </div>
                    <p className={`mt-1 text-sm ${notification.read ? 'text-muted-foreground' : ''}`}>
                      {notification.message}
                    </p>
                    <div className="mt-2 flex justify-end space-x-2">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4 mr-1" /> Mark as Read
                        </Button>
                      )}
                      {/* <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button> */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            You have {notifications?.filter(n => !n.read).length} unread notifications.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

