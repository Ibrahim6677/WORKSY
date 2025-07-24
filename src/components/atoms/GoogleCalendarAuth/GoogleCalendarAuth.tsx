import React, { useEffect, useState } from 'react';
import { Calendar, AlertCircle, CheckCircle, Loader, ExternalLink } from 'lucide-react';
import { useGoogleCalendar } from '../../../hooks/useGoogleCalendar/useGoogleCalendar';

interface GoogleCalendarAuthProps {
  onAuthSuccess?: () => void;
  onAuthError?: (error: string) => void;
  className?: string;
}

const GoogleCalendarAuth: React.FC<GoogleCalendarAuthProps> = ({
  onAuthSuccess,
  onAuthError,
  className = ''
}) => {
  const {
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    calendars,
    events
  } = useGoogleCalendar();

  const [authStatus, setAuthStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');

  // Check if environment variables are set
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isConfigured = clientId && clientId !== 'your_actual_google_client_id_here.apps.googleusercontent.com';

  useEffect(() => {
    if (isAuthenticated) {
      setAuthStatus('connected');
      onAuthSuccess?.();
    } else if (error) {
      setAuthStatus('error');
      onAuthError?.(error);
    } else if (isLoading) {
      setAuthStatus('connecting');
    } else {
      setAuthStatus('idle');
    }
  }, [isAuthenticated, isLoading, error, onAuthSuccess, onAuthError]);

  const handleConnect = () => {
    setAuthStatus('connecting');
    login();
  };

  const handleDisconnect = () => {
    logout();
    setAuthStatus('idle');
  };

  const getStatusColor = () => {
    switch (authStatus) {
      case 'connected': return 'text-green-600';
      case 'connecting': return 'text-blue-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (authStatus) {
      case 'connected': 
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'connecting': 
        return <Loader className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'error': 
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: 
        return <Calendar className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusText = () => {
    switch (authStatus) {
      case 'connected': 
        return `متصل بـ Google Calendar (${events.length} حدث)`;
      case 'connecting': 
        return 'جاري الاتصال...';
      case 'error': 
        return `خطأ في الاتصال: ${error}`;
      default: 
        return 'غير متصل بـ Google Calendar';
    }
  };

  return (
    <div className={`bg-white rounded-lg border p-4 ${className}`}>
      {/* Configuration Warning */}
      {!isConfigured && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-start space-x-2 rtl:space-x-reverse">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-700">
              <p className="font-medium">إعداد Google Calendar مطلوب</p>
              <p className="mt-1">
                يرجى إضافة Google Client ID في ملف .env.local. 
                راجع ملف GOOGLE_CALENDAR_INTEGRATION.md للتعليمات.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          {getStatusIcon()}
          <div>
            <h3 className="font-medium text-gray-900">Google Calendar</h3>
            <p className={`text-sm ${getStatusColor()}`}>
              {getStatusText()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {authStatus === 'connected' && (
            <div className="text-xs text-gray-500">
              {calendars.length} تقويم
            </div>
          )}
          
          {authStatus === 'connected' ? (
            <button
              onClick={handleDisconnect}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition"
            >
              قطع الاتصال
            </button>
          ) : (
            <button
              onClick={handleConnect}
              disabled={authStatus === 'connecting' || !isConfigured}
              className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {authStatus === 'connecting' ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>جاري الاتصال...</span>
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4" />
                  <span>ربط مع Google</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Show calendars when connected */}
      {authStatus === 'connected' && calendars.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-700 mb-2">التقاويم المتاحة:</h4>
          <div className="space-y-1">
            {calendars.slice(0, 3).map((calendar: any) => (
              <div key={calendar.id} className="flex items-center space-x-2 rtl:space-x-reverse text-sm">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: calendar.backgroundColor || '#4285f4' }}
                />
                <span className="text-gray-600 truncate">{calendar.summary}</span>
                {calendar.primary && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                    أساسي
                  </span>
                )}
              </div>
            ))}
            {calendars.length > 3 && (
              <div className="text-xs text-gray-500">
                و {calendars.length - 3} تقويم آخر...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error details */}
      {authStatus === 'error' && error && (
        <div className="mt-4 p-3 bg-red-50 rounded-md">
          <div className="flex items-start space-x-2 rtl:space-x-reverse">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
            <div className="text-sm text-red-700">
              <p className="font-medium">فشل في الاتصال بـ Google Calendar</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleCalendarAuth;
