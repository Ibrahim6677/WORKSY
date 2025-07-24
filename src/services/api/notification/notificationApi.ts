import axiosInstance from "../axiosInstance";

export interface Notification {
  id: string;
  type: 'message' | 'mention' | 'call' | 'workspace_invite' | 'system';
  title: string;
  message: string;
  data?: {
    workspaceId?: string;
    channelId?: string;
    callId?: string;
    userId?: string;
    messageId?: string;
    [key: string]: any;
  };
  isRead: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationData {
  type: Notification['type'];
  title: string;
  message: string;
  userId: string;
  data?: Notification['data'];
}

export interface NotificationSettings {
  mentions: boolean;
  directMessages: boolean;
  calls: boolean;
  workspaceUpdates: boolean;
  systemNotifications: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  sound: boolean;
  desktop: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ================================
// NOTIFICATION MANAGEMENT
// ================================

// Get user notifications
export const getNotifications = async (
  page: number = 1,
  limit: number = 20,
  unreadOnly: boolean = false
): Promise<{ notifications: Notification[]; total: number; unreadCount: number }> => {
  const response = await axiosInstance.get<ApiResponse<{ notifications: Notification[]; total: number; unreadCount: number }>>(
    `/notifications?page=${page}&limit=${limit}&unreadOnly=${unreadOnly}`
  );
  return response.data.data;
};

// Get notification by ID
export const getNotificationById = async (
  notificationId: string
): Promise<Notification> => {
  const response = await axiosInstance.get<ApiResponse<Notification>>(
    `/notifications/${notificationId}`
  );
  return response.data.data;
};

// Mark notification as read
export const markAsRead = async (notificationId: string): Promise<void> => {
  await axiosInstance.patch(`/notifications/${notificationId}/read`);
};

// Mark all notifications as read
export const markAllAsRead = async (): Promise<void> => {
  await axiosInstance.patch('/notifications/read-all');
};

// Delete notification
export const deleteNotification = async (notificationId: string): Promise<void> => {
  await axiosInstance.delete(`/notifications/${notificationId}`);
};

// Clear all notifications
export const clearAllNotifications = async (): Promise<void> => {
  await axiosInstance.delete('/notifications/clear-all');
};

// Get unread count
export const getUnreadCount = async (): Promise<{ count: number }> => {
  const response = await axiosInstance.get<ApiResponse<{ count: number }>>(
    '/notifications/unread-count'
  );
  return response.data.data;
};

// ================================
// NOTIFICATION SETTINGS
// ================================

// Get notification settings
export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  const response = await axiosInstance.get<ApiResponse<NotificationSettings>>(
    '/notifications/settings'
  );
  return response.data.data;
};

// Update notification settings
export const updateNotificationSettings = async (
  settings: Partial<NotificationSettings>
): Promise<NotificationSettings> => {
  const response = await axiosInstance.patch<ApiResponse<NotificationSettings>>(
    '/notifications/settings',
    settings
  );
  return response.data.data;
};

// ================================
// PUSH NOTIFICATIONS
// ================================

// Subscribe to push notifications
export const subscribeToPush = async (
  subscription: PushSubscription
): Promise<void> => {
  await axiosInstance.post('/notifications/push/subscribe', {
    subscription: subscription.toJSON()
  });
};

// Unsubscribe from push notifications
export const unsubscribeFromPush = async (): Promise<void> => {
  await axiosInstance.post('/notifications/push/unsubscribe');
};

// Test push notification
export const testPushNotification = async (): Promise<void> => {
  await axiosInstance.post('/notifications/push/test');
};

// ================================
// NOTIFICATION TYPES
// ================================

// Get notification types
export const getNotificationTypes = async (): Promise<string[]> => {
  const response = await axiosInstance.get<ApiResponse<string[]>>(
    '/notifications/types'
  );
  return response.data.data;
};

// ================================
// ADMIN FUNCTIONS (if user is admin)
// ================================

// Send notification to user (admin only)
export const sendNotificationToUser = async (
  notificationData: CreateNotificationData
): Promise<Notification> => {
  const response = await axiosInstance.post<ApiResponse<Notification>>(
    '/notifications/send',
    notificationData
  );
  return response.data.data;
};

// Send notification to workspace (admin only)
export const sendNotificationToWorkspace = async (
  workspaceId: string,
  notificationData: Omit<CreateNotificationData, 'userId'>
): Promise<void> => {
  await axiosInstance.post(
    `/notifications/workspace/${workspaceId}/send`,
    notificationData
  );
};

// Send system notification (admin only)
export const sendSystemNotification = async (
  notificationData: Omit<CreateNotificationData, 'userId' | 'type'>
): Promise<void> => {
  await axiosInstance.post('/notifications/system/send', {
    ...notificationData,
    type: 'system'
  });
};

// ================================
// REAL-TIME HELPERS
// ================================

// Helper function to handle real-time notification
export const handleRealTimeNotification = (
  notification: Notification,
  onNotification?: (notification: Notification) => void
): void => {
  // Show browser notification if permission granted
  if ('Notification' in window && Notification.permission === 'granted') {
    const browserNotification = new Notification(notification.title, {
      body: notification.message,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: notification.id,
      requireInteraction: notification.type === 'call',
      data: notification.data
    });

    browserNotification.onclick = () => {
      window.focus();
      browserNotification.close();
      if (onNotification) {
        onNotification(notification);
      }
    };

    // Auto close after 5 seconds (except for calls)
    if (notification.type !== 'call') {
      setTimeout(() => {
        browserNotification.close();
      }, 5000);
    }
  }

  // Call custom handler
  if (onNotification) {
    onNotification(notification);
  }
};

// Request notification permission
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission;
  }
  return 'denied';
};
