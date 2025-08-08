import { useCallback } from "react";

export function useNotifications() {
  // Request permission on mount
  const requestPermission = useCallback(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Show a notification
  const showNotification = useCallback((title: string, options?: NotificationOptions) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, options);
    }
  }, []);

  return { requestPermission, showNotification };
} 