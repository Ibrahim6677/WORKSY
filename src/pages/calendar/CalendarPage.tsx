import { Suspense, lazy, useState, useEffect } from "react";
import { addDays, subDays, format } from "date-fns";
import LoadingPage from "../loadingPage";
import { useGoogleCalendar } from "../../hooks/useGoogleCalendar/useGoogleCalendar";
import GoogleCalendarAuth from "../../components/atoms/GoogleCalendarAuth/GoogleCalendarAuth";
import { Calendar, RefreshCw } from "lucide-react";

const ScheduleCalendarComponent = lazy(() => import("./ScheduleCalendar"));
const CalendarSidebarComponent = lazy(() => import("../../components/organisms/Sidebar/CalendarSidebar"));
const CalendarHeaderComponent = lazy(() => import("../../components/organisms/WorkspaceHeaders/CalendarHeader"));

export default function CalendarPage() {
  // Start with the date from the design
  const [date, setDate] = useState(new Date(2020, 2, 12));
  const [showGoogleAuth, setShowGoogleAuth] = useState(false);

  // Google Calendar integration
  const {
    isAuthenticated,
    isLoading,
    error,
    events: googleEvents,
    refreshEvents,
    createEvent,
    syncWithLocal
  } = useGoogleCalendar();

  // Sync Google events when date changes
  useEffect(() => {
    if (isAuthenticated) {
      const startOfWeek = subDays(date, 7);
      const endOfWeek = addDays(date, 14);
      refreshEvents(startOfWeek, endOfWeek);
    }
  }, [date, isAuthenticated, refreshEvents]); 

  const handlePrevWeek = () => {
    setDate((currentDate) => subDays(currentDate, 7));
  };

  const handleNextWeek = () => {
    setDate((currentDate) => addDays(currentDate, 7));
  };

  const handleSyncCalendar = async () => {
    if (isAuthenticated) {
      await syncWithLocal();
    }
  };

  const handleCreateGoogleEvent = async (eventData: any) => {
    try {
      await createEvent({
        summary: eventData.title,
        description: eventData.description,
        start: {
          dateTime: eventData.startTime,
          timeZone: 'UTC',
        },
        end: {
          dateTime: eventData.endTime,
          timeZone: 'UTC',
        },
        location: eventData.location,
      });
    } catch (error) {
      console.error('Failed to create Google Calendar event:', error);
    }
  };

  return (
    <Suspense fallback={<LoadingPage />}>
      <CalendarHeaderComponent />
      
      {/* Google Calendar Integration Section */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <h2 className="text-lg font-semibold text-gray-900">تكامل Google Calendar</h2>
            {isAuthenticated && (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-sm text-green-600">متصل</span>
                <span className="text-xs text-gray-500">({googleEvents.length} حدث)</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {isAuthenticated && (
              <button
                onClick={handleSyncCalendar}
                disabled={isLoading}
                className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 disabled:opacity-50 transition"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>مزامنة</span>
              </button>
            )}
            
            <button
              onClick={() => setShowGoogleAuth(!showGoogleAuth)}
              className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
            >
              <Calendar className="w-4 h-4" />
              <span>{isAuthenticated ? 'إدارة الاتصال' : 'ربط مع Google'}</span>
            </button>
          </div>
        </div>
        
        {/* Google Calendar Auth Component */}
        {showGoogleAuth && (
          <div className="mt-4">
            <GoogleCalendarAuth 
              onAuthSuccess={() => setShowGoogleAuth(false)}
              onAuthError={(error) => console.error('Auth error:', error)}
            />
          </div>
        )}
        
        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Main content area */}
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl text-[#1A1A1B] font-semibold">
              Schedule Meeting{" "}
              <span className="text-[#AFB8CF] text-sm px-2">|</span>{" "}
              <span className="text-[#6629DE] text-sm font-medium">
                {format(date, "MMMM, yyyy")}
              </span>
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevWeek}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F5F5F7]"
                style={{ boxShadow: 'none', border: 'none' }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 16L7 10L13 4" stroke="#AFB8CF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                onClick={handleNextWeek}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F5F5F7]"
                style={{ boxShadow: 'none', border: 'none' }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 4L13 10L7 16" stroke="#6629DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          <ScheduleCalendarComponent 
            date={date} 
            googleEvents={googleEvents}
            onCreateEvent={handleCreateGoogleEvent}
          />
        </div>
        <CalendarSidebarComponent />
      </div>
    </Suspense>
  );
}
