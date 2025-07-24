import { useState, useEffect, useCallback } from 'react';
import { googleCalendarService } from '../../services/api/calendar/googleCalendarApi';
import type { GoogleCalendarEvent } from '../../services/api/calendar/googleCalendarApi';
import { googleAuthService } from '../../services/auth/googleAuth';

interface UseGoogleCalendarReturn {
  // Authentication
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Calendar data
  events: any[];
  calendars: any[];
  
  // Methods
  login: () => void;
  logout: () => void;
  refreshEvents: (startDate?: Date, endDate?: Date) => Promise<void>;
  createEvent: (event: GoogleCalendarEvent) => Promise<any>;
  updateEvent: (eventId: string, event: GoogleCalendarEvent) => Promise<any>;
  deleteEvent: (eventId: string) => Promise<boolean>;
  syncWithLocal: () => Promise<void>;
}

export const useGoogleCalendar = (): UseGoogleCalendarReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [calendars, setCalendars] = useState<any[]>([]);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const authenticated = googleAuthService.isAuthenticated();
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          const accessToken = await googleAuthService.getAccessToken();
          if (accessToken) {
            googleCalendarService.init({ accessToken });
            await loadCalendars();
            await refreshEvents();
          }
        }
      } catch (err) {
        setError('Authentication check failed');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Load user's calendars
  const loadCalendars = async () => {
    try {
      const userCalendars = await googleCalendarService.getCalendars();
      setCalendars(userCalendars || []);
    } catch (err) {
      console.error('Failed to load calendars:', err);
    }
  };

  // Login to Google Calendar
  const login = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      await googleAuthService.initiateAuth();
      
      // After successful auth, initialize the service and load data
      const accessToken = await googleAuthService.getAccessToken();
      if (accessToken) {
        googleCalendarService.init({ accessToken });
        setIsAuthenticated(true);
        await loadCalendars();
        await refreshEvents();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout from Google Calendar
  const logout = useCallback(() => {
    googleAuthService.logout();
    googleCalendarService.logout();
    setIsAuthenticated(false);
    setEvents([]);
    setCalendars([]);
    setError(null);
  }, []);

  // Refresh events from Google Calendar
  const refreshEvents = useCallback(async (startDate?: Date, endDate?: Date) => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const googleEvents = await googleCalendarService.getEvents(startDate, endDate);
      setEvents(googleEvents || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch events');
      console.error('Error fetching events:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Create a new event
  const createEvent = useCallback(async (event: GoogleCalendarEvent) => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated');
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const newEvent = await googleCalendarService.createEvent(event);
      
      // Refresh events to include the new one
      await refreshEvents();
      
      return newEvent;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create event';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, refreshEvents]);

  // Update an existing event
  const updateEvent = useCallback(async (eventId: string, event: GoogleCalendarEvent) => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated');
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const updatedEvent = await googleCalendarService.updateEvent(eventId, event);
      
      // Refresh events to show updates
      await refreshEvents();
      
      return updatedEvent;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update event';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, refreshEvents]);

  // Delete an event
  const deleteEvent = useCallback(async (eventId: string) => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated');
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const success = await googleCalendarService.deleteEvent(eventId);
      
      if (success) {
        // Remove from local state
        setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
      }
      
      return success;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete event';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Sync with local calendar (if you have a local calendar system)
  const syncWithLocal = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);
    
    try {
      // Get Google Calendar events
      const googleEvents = await googleCalendarService.getEvents();
      
      // Here you can implement logic to sync with your local calendar
      // For example, compare with local events and update/create/delete as needed
      
      console.log('Synced events:', googleEvents);
      setEvents(googleEvents || []);
      
    } catch (err: any) {
      setError(err.message || 'Sync failed');
      console.error('Sync error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  return {
    isAuthenticated,
    isLoading,
    error,
    events,
    calendars,
    login,
    logout,
    refreshEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    syncWithLocal,
  };
};
