// Export all API modules
export * from './auth/authApi';
export * from './workspace/workspaceApi';
export * from './chat/chatApi';
export * from './file/fileApi';

// Export calendar API
export {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  duplicateEvent,
  addAttendees,
  removeAttendee,
  respondToInvitation,
  getMonthView,
  getWeekView,
  getDayView,
  getCalendarSettings,
  updateCalendarSettings,
  searchEvents,
  getEventsByType,
  shareCalendar,
  getSharedCalendars,
  getUpcomingReminders,
  snoozeReminder,
  exportCalendar,
  importCalendar,
  type CalendarEvent,
  type CreateEventData,
  type UpdateEventData,
  type CalendarSettings
} from './calendar/calendarApi';

// Export notification API
export {
  getNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  getUnreadCount,
  getNotificationSettings,
  updateNotificationSettings,
  subscribeToPush,
  unsubscribeFromPush,
  testPushNotification,
  getNotificationTypes,
  sendNotificationToUser,
  sendNotificationToWorkspace,
  sendSystemNotification,
  handleRealTimeNotification,
  requestNotificationPermission,
  type Notification,
  type CreateNotificationData,
  type NotificationSettings
} from './notification/notificationApi';

// Export call API with specific names to avoid conflicts
export {
  createCall,
  getCall,
  getActiveCalls,
  getScheduledCalls,
  getCallHistory,
  joinCall,
  leaveCall,
  endCall,
  toggleAudio,
  toggleVideo,
  toggleScreenShare,
  toggleRecording,
  getCallMembers,
  muteMember,
  removeMember as removeCallMember,
  inviteToCall,
  getCallInviteLink,
  getCallRecordings,
  downloadRecording,
  deleteRecording,
  type Call,
  type CallMember,
  type CreateCallData,
  type JoinCallData,
  type CallSettings
} from './call/callApi';

// Re-export the axios instance for direct use if needed
export { default as axiosInstance } from './axiosInstance';
