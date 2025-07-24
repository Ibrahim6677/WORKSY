import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { googleAuthService } from '../../services/auth/googleAuth';
import { googleCalendarService } from '../../services/api/calendar/googleCalendarApi';
import { Loader, CheckCircle, AlertCircle } from 'lucide-react';

const GoogleAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get authorization code from URL params
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          throw new Error(`Authentication error: ${error}`);
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        // Exchange code for tokens
        const tokens = await googleAuthService.handleCallback(code);
        
        // Initialize Google Calendar service
        googleCalendarService.init({ accessToken: tokens.access_token });

        setStatus('success');
        
        // If this is running in a popup, notify parent window
        if (window.opener) {
          window.opener.postMessage({
            type: 'GOOGLE_AUTH_SUCCESS',
            tokens
          }, window.location.origin);
          
          // Close popup after a short delay
          setTimeout(() => {
            window.close();
          }, 1000);
        } else {
          // If not in popup, redirect back to calendar page after success
          setTimeout(() => {
            navigate('/workspace/calendar', { replace: true });
          }, 2000);
        }

      } catch (err: any) {
        console.error('OAuth callback error:', err);
        setError(err.message || 'Authentication failed');
        setStatus('error');
        
        // If this is running in a popup, notify parent window of error
        if (window.opener) {
          window.opener.postMessage({
            type: 'GOOGLE_AUTH_ERROR',
            error: err.message || 'Authentication failed'
          }, window.location.origin);
          
          // Close popup after a short delay
          setTimeout(() => {
            window.close();
          }, 2000);
        } else {
          // If not in popup, redirect back to calendar page after error
          setTimeout(() => {
            navigate('/workspace/calendar', { replace: true });
          }, 3000);
        }
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {status === 'loading' && (
            <>
              <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                جاري ربط حسابك بـ Google Calendar
              </h2>
              <p className="text-gray-600">
                الرجاء الانتظار قليلاً...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                تم الربط بنجاح!
              </h2>
              <p className="text-gray-600 mb-4">
                تم ربط حسابك بـ Google Calendar بنجاح
              </p>
              <p className="text-sm text-gray-500">
                سيتم تحويلك إلى صفحة التقويم خلال ثوانٍ...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                فشل في الربط
              </h2>
              <p className="text-gray-600 mb-4">
                حدث خطأ أثناء ربط حسابك بـ Google Calendar
              </p>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              <p className="text-sm text-gray-500">
                سيتم تحويلك إلى صفحة التقويم خلال ثوانٍ...
              </p>
            </>
          )}

          <div className="mt-6">
            <button
              onClick={() => navigate('/workspace/calendar', { replace: true })}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              العودة إلى التقويم
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleAuthCallback;
