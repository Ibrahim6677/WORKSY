import axios from 'axios';

// Google Calendar API configuration
const GOOGLE_CALENDAR_API_BASE_URL = 'https://www.googleapis.com/calendar/v3';

export interface GoogleCalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted';
  }>;
  location?: string;
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{
      method: 'email' | 'popup';
      minutes: number;
    }>;
  };
}

export interface GoogleCalendarConfig {
  accessToken: string;
  calendarId?: string; // Default is 'primary'
}

class GoogleCalendarService {
  private config: GoogleCalendarConfig | null = null;

  // Initialize with access token
  init(config: GoogleCalendarConfig) {
    this.config = config;
  }

  // Get authorization headers
  private getAuthHeaders() {
    if (!this.config?.accessToken) {
      throw new Error('Google Calendar not initialized. Please authenticate first.');
    }
    return {
      'Authorization': `Bearer ${this.config.accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  // Get calendar ID (default to primary)
  private getCalendarId() {
    return this.config?.calendarId || 'primary';
  }

  // Get user's calendars
  async getCalendars() {
    try {
      const response = await axios.get(
        `${GOOGLE_CALENDAR_API_BASE_URL}/users/me/calendarList`,
        { headers: this.getAuthHeaders() }
      );
      return response.data.items;
    } catch (error) {
      console.error('Error fetching calendars:', error);
      throw new Error('Failed to fetch calendars');
    }
  }

  // Get events from calendar
  async getEvents(startDate?: Date, endDate?: Date) {
    try {
      const params = new URLSearchParams();
      
      if (startDate) {
        params.append('timeMin', startDate.toISOString());
      }
      if (endDate) {
        params.append('timeMax', endDate.toISOString());
      }
      
      params.append('singleEvents', 'true');
      params.append('orderBy', 'startTime');

      const response = await axios.get(
        `${GOOGLE_CALENDAR_API_BASE_URL}/calendars/${this.getCalendarId()}/events?${params.toString()}`,
        { headers: this.getAuthHeaders() }
      );
      
      return response.data.items;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new Error('Failed to fetch events');
    }
  }

  // Create a new event
  async createEvent(event: GoogleCalendarEvent) {
    try {
      const response = await axios.post(
        `${GOOGLE_CALENDAR_API_BASE_URL}/calendars/${this.getCalendarId()}/events`,
        event,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error('Failed to create event');
    }
  }

  // Update an existing event
  async updateEvent(eventId: string, event: GoogleCalendarEvent) {
    try {
      const response = await axios.put(
        `${GOOGLE_CALENDAR_API_BASE_URL}/calendars/${this.getCalendarId()}/events/${eventId}`,
        event,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw new Error('Failed to update event');
    }
  }

  // Delete an event
  async deleteEvent(eventId: string) {
    try {
      await axios.delete(
        `${GOOGLE_CALENDAR_API_BASE_URL}/calendars/${this.getCalendarId()}/events/${eventId}`,
        { headers: this.getAuthHeaders() }
      );
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw new Error('Failed to delete event');
    }
  }

  // Get a specific event
  async getEvent(eventId: string) {
    try {
      const response = await axios.get(
        `${GOOGLE_CALENDAR_API_BASE_URL}/calendars/${this.getCalendarId()}/events/${eventId}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching event:', error);
      throw new Error('Failed to fetch event');
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.config?.accessToken;
  }

  // Clear authentication
  logout() {
    this.config = null;
  }
}

// Export singleton instance
export const googleCalendarService = new GoogleCalendarService();

// Helper functions
export const formatEventForGoogle = (localEvent: any): GoogleCalendarEvent => {
  return {
    summary: localEvent.title || localEvent.summary,
    description: localEvent.description,
    start: {
      dateTime: localEvent.startTime || localEvent.start?.dateTime,
      timeZone: localEvent.timeZone || 'UTC',
    },
    end: {
      dateTime: localEvent.endTime || localEvent.end?.dateTime,
      timeZone: localEvent.timeZone || 'UTC',
    },
    attendees: localEvent.attendees?.map((attendee: any) => ({
      email: attendee.email,
      displayName: attendee.name || attendee.displayName,
    })),
    location: localEvent.location,
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 }, // 1 day before
        { method: 'popup', minutes: 30 }, // 30 minutes before
      ],
    },
  };
};

export const formatGoogleEventForLocal = (googleEvent: any) => {
  return {
    id: googleEvent.id,
    title: googleEvent.summary,
    description: googleEvent.description,
    startTime: googleEvent.start?.dateTime || googleEvent.start?.date,
    endTime: googleEvent.end?.dateTime || googleEvent.end?.date,
    location: googleEvent.location,
    attendees: googleEvent.attendees?.map((attendee: any) => ({
      email: attendee.email,
      name: attendee.displayName,
      status: attendee.responseStatus,
    })),
    source: 'google',
    googleEventId: googleEvent.id,
  };
};
