import axiosInstance from "../axiosInstance";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string; // ISO date string
  end: string; // ISO date string
  allDay: boolean;
  type: 'meeting' | 'reminder' | 'deadline' | 'personal' | 'holiday';
  status: 'confirmed' | 'tentative' | 'cancelled';
  location?: string;
  workspaceId?: string;
  channelId?: string;
  createdBy: string;
  attendees: {
    id: string;
    name: string;
    email: string;
    status: 'pending' | 'accepted' | 'declined';
    isRequired: boolean;
  }[];
  recurrence?: {
    rule: string; // RRULE format
    exceptions?: string[]; // dates to exclude
  };
  reminders: {
    type: 'email' | 'notification' | 'popup';
    minutesBefore: number;
  }[];
  attachments?: {
    id: string;
    name: string;
    url: string;
  }[];
  callDetails?: {
    id: string;
    joinUrl: string;
    phoneNumber?: string;
    accessCode?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventData {
  title: string;
  description?: string;
  start: string;
  end: string;
  allDay?: boolean;
  type?: CalendarEvent['type'];
  location?: string;
  workspaceId?: string;
  channelId?: string;
  attendeeIds?: string[];
  recurrence?: CalendarEvent['recurrence'];
  reminders?: CalendarEvent['reminders'];
  createCall?: boolean;
}

export interface UpdateEventData {
  title?: string;
  description?: string;
  start?: string;
  end?: string;
  allDay?: boolean;
  type?: CalendarEvent['type'];
  status?: CalendarEvent['status'];
  location?: string;
  attendeeIds?: string[];
  recurrence?: CalendarEvent['recurrence'];
  reminders?: CalendarEvent['reminders'];
}

export interface CalendarSettings {
  defaultView: 'month' | 'week' | 'day' | 'agenda';
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday
  timeFormat: '12h' | '24h';
  timezone: string;
  showWeekends: boolean;
  defaultReminders: CalendarEvent['reminders'];
  workingHours: {
    start: string; // "09:00"
    end: string; // "17:00"
    days: number[]; // [1,2,3,4,5] for Mon-Fri
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ================================
// EVENT MANAGEMENT
// ================================

// Get events for a date range
export const getEvents = async (
  startDate: string,
  endDate: string,
  workspaceId?: string
): Promise<CalendarEvent[]> => {
  const params = new URLSearchParams({
    start: startDate,
    end: endDate
  });
  
  if (workspaceId) {
    params.append('workspaceId', workspaceId);
  }

  const response = await axiosInstance.get<ApiResponse<CalendarEvent[]>>(
    `/calendar/events?${params.toString()}`
  );
  return response.data.data;
};

// Get event by ID
export const getEventById = async (eventId: string): Promise<CalendarEvent> => {
  const response = await axiosInstance.get<ApiResponse<CalendarEvent>>(
    `/calendar/events/${eventId}`
  );
  return response.data.data;
};

// Create new event
export const createEvent = async (
  eventData: CreateEventData
): Promise<CalendarEvent> => {
  const response = await axiosInstance.post<ApiResponse<CalendarEvent>>(
    '/calendar/events',
    eventData
  );
  return response.data.data;
};

// Update event
export const updateEvent = async (
  eventId: string,
  updates: UpdateEventData,
  updateSeries: boolean = false
): Promise<CalendarEvent> => {
  const response = await axiosInstance.patch<ApiResponse<CalendarEvent>>(
    `/calendar/events/${eventId}?updateSeries=${updateSeries}`,
    updates
  );
  return response.data.data;
};

// Delete event
export const deleteEvent = async (
  eventId: string,
  deleteSeries: boolean = false
): Promise<void> => {
  await axiosInstance.delete(
    `/calendar/events/${eventId}?deleteSeries=${deleteSeries}`
  );
};

// Duplicate event
export const duplicateEvent = async (
  eventId: string,
  newStart: string,
  newEnd: string
): Promise<CalendarEvent> => {
  const response = await axiosInstance.post<ApiResponse<CalendarEvent>>(
    `/calendar/events/${eventId}/duplicate`,
    { start: newStart, end: newEnd }
  );
  return response.data.data;
};

// ================================
// EVENT ATTENDEES
// ================================

// Add attendees to event
export const addAttendees = async (
  eventId: string,
  attendeeIds: string[]
): Promise<void> => {
  await axiosInstance.post(`/calendar/events/${eventId}/attendees`, {
    attendeeIds
  });
};

// Remove attendee from event
export const removeAttendee = async (
  eventId: string,
  attendeeId: string
): Promise<void> => {
  await axiosInstance.delete(
    `/calendar/events/${eventId}/attendees/${attendeeId}`
  );
};

// Respond to event invitation
export const respondToInvitation = async (
  eventId: string,
  response: 'accepted' | 'declined' | 'tentative'
): Promise<void> => {
  await axiosInstance.patch(`/calendar/events/${eventId}/respond`, {
    response
  });
};

// ================================
// CALENDAR VIEWS
// ================================

// Get month view data
export const getMonthView = async (
  year: number,
  month: number,
  workspaceId?: string
): Promise<CalendarEvent[]> => {
  const params = new URLSearchParams({
    year: year.toString(),
    month: month.toString()
  });
  
  if (workspaceId) {
    params.append('workspaceId', workspaceId);
  }

  const response = await axiosInstance.get<ApiResponse<CalendarEvent[]>>(
    `/calendar/month?${params.toString()}`
  );
  return response.data.data;
};

// Get week view data
export const getWeekView = async (
  date: string,
  workspaceId?: string
): Promise<CalendarEvent[]> => {
  const params = new URLSearchParams({ date });
  
  if (workspaceId) {
    params.append('workspaceId', workspaceId);
  }

  const response = await axiosInstance.get<ApiResponse<CalendarEvent[]>>(
    `/calendar/week?${params.toString()}`
  );
  return response.data.data;
};

// Get day view data
export const getDayView = async (
  date: string,
  workspaceId?: string
): Promise<CalendarEvent[]> => {
  const params = new URLSearchParams({ date });
  
  if (workspaceId) {
    params.append('workspaceId', workspaceId);
  }

  const response = await axiosInstance.get<ApiResponse<CalendarEvent[]>>(
    `/calendar/day?${params.toString()}`
  );
  return response.data.data;
};

// ================================
// CALENDAR SETTINGS
// ================================

// Get calendar settings
export const getCalendarSettings = async (): Promise<CalendarSettings> => {
  const response = await axiosInstance.get<ApiResponse<CalendarSettings>>(
    '/calendar/settings'
  );
  return response.data.data;
};

// Update calendar settings
export const updateCalendarSettings = async (
  settings: Partial<CalendarSettings>
): Promise<CalendarSettings> => {
  const response = await axiosInstance.patch<ApiResponse<CalendarSettings>>(
    '/calendar/settings',
    settings
  );
  return response.data.data;
};

// ================================
// EVENT SEARCH & FILTERING
// ================================

// Search events
export const searchEvents = async (
  query: string,
  workspaceId?: string,
  startDate?: string,
  endDate?: string
): Promise<CalendarEvent[]> => {
  const params = new URLSearchParams({ query });
  
  if (workspaceId) params.append('workspaceId', workspaceId);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const response = await axiosInstance.get<ApiResponse<CalendarEvent[]>>(
    `/calendar/search?${params.toString()}`
  );
  return response.data.data;
};

// Get events by type
export const getEventsByType = async (
  type: CalendarEvent['type'],
  startDate: string,
  endDate: string,
  workspaceId?: string
): Promise<CalendarEvent[]> => {
  const params = new URLSearchParams({
    type,
    start: startDate,
    end: endDate
  });
  
  if (workspaceId) {
    params.append('workspaceId', workspaceId);
  }

  const response = await axiosInstance.get<ApiResponse<CalendarEvent[]>>(
    `/calendar/events/type?${params.toString()}`
  );
  return response.data.data;
};

// ================================
// CALENDAR SHARING & PERMISSIONS
// ================================

// Share calendar
export const shareCalendar = async (
  workspaceId: string,
  permissions: 'read' | 'write' | 'admin'
): Promise<{ shareUrl: string }> => {
  const response = await axiosInstance.post<ApiResponse<{ shareUrl: string }>>(
    `/calendar/share`,
    { workspaceId, permissions }
  );
  return response.data.data;
};

// Get shared calendars
export const getSharedCalendars = async (): Promise<any[]> => {
  const response = await axiosInstance.get<ApiResponse<any[]>>(
    '/calendar/shared'
  );
  return response.data.data;
};

// ================================
// EVENT REMINDERS
// ================================

// Get upcoming reminders
export const getUpcomingReminders = async (
  hours: number = 24
): Promise<CalendarEvent[]> => {
  const response = await axiosInstance.get<ApiResponse<CalendarEvent[]>>(
    `/calendar/reminders/upcoming?hours=${hours}`
  );
  return response.data.data;
};

// Snooze reminder
export const snoozeReminder = async (
  eventId: string,
  minutes: number
): Promise<void> => {
  await axiosInstance.post(`/calendar/reminders/${eventId}/snooze`, {
    minutes
  });
};

// ================================
// CALENDAR EXPORT/IMPORT
// ================================

// Export calendar to ICS
export const exportCalendar = async (
  startDate: string,
  endDate: string,
  workspaceId?: string
): Promise<Blob> => {
  const params = new URLSearchParams({
    start: startDate,
    end: endDate
  });
  
  if (workspaceId) {
    params.append('workspaceId', workspaceId);
  }

  const response = await axiosInstance.get(
    `/calendar/export?${params.toString()}`,
    { responseType: 'blob' }
  );
  return response.data;
};

// Import calendar from ICS
export const importCalendar = async (
  file: File,
  workspaceId?: string
): Promise<{ imported: number; errors: string[] }> => {
  const formData = new FormData();
  formData.append('file', file);
  
  if (workspaceId) {
    formData.append('workspaceId', workspaceId);
  }

  const response = await axiosInstance.post<ApiResponse<{ imported: number; errors: string[] }>>(
    '/calendar/import',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return response.data.data;
};
