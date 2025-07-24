import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { acceptInvite } from '../../services/api/invites/invitesApi';
import { Loader, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

const AcceptInvite: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [error, setError] = useState<string>('');
  const [workspaceInfo, setWorkspaceInfo] = useState<any>(null);

  useEffect(() => {
    const handleAcceptInvite = async () => {
      if (!token) {
        setError('رابط الدعوة غير صحيح');
        setStatus('error');
        return;
      }

      try {
        // Accept the invite
        await acceptInvite(token);
        setStatus('success');
        
        // Redirect to workspace after success
        setTimeout(() => {
          navigate('/workspace');
        }, 3000);

      } catch (err: any) {
        console.error('Accept invite error:', err);
        
        if (err.response?.status === 404) {
          setError('رابط الدعوة غير صحيح أو منتهي الصلاحية');
          setStatus('expired');
        } else if (err.response?.status === 409) {
          setError('أنت عضو بالفعل في هذه المساحة');
          setStatus('error');
        } else {
          setError(err.response?.data?.message || 'حدث خطأ أثناء قبول الدعوة');
          setStatus('error');
        }
        
        // Redirect to login/workspace after error
        setTimeout(() => {
          navigate('/auth/login');
        }, 5000);
      }
    };

    handleAcceptInvite();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {status === 'loading' && (
            <>
              <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                جاري معالجة الدعوة...
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
                مرحباً بك في مساحة العمل!
              </h2>
              <p className="text-gray-600 mb-4">
                تم قبول الدعوة بنجاح وأنت الآن عضو في مساحة العمل
              </p>
              <p className="text-sm text-gray-500">
                سيتم تحويلك إلى مساحة العمل خلال ثوانٍ...
              </p>
            </>
          )}

          {status === 'expired' && (
            <>
              <AlertCircle className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                رابط الدعوة منتهي الصلاحية
              </h2>
              <p className="text-gray-600 mb-4">
                هذا الرابط غير صحيح أو منتهي الصلاحية
              </p>
              <p className="text-sm text-gray-500 mb-4">
                يرجى طلب دعوة جديدة من مدير مساحة العمل
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                فشل في قبول الدعوة
              </h2>
              <p className="text-gray-600 mb-4">
                حدث خطأ أثناء قبول الدعوة
              </p>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              <p className="text-sm text-gray-500">
                سيتم تحويلك إلى صفحة تسجيل الدخول خلال ثوانٍ...
              </p>
            </>
          )}

          <div className="mt-6 flex gap-2 justify-center">
            {status === 'success' && (
              <button
                onClick={() => navigate('/workspace')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                <ExternalLink className="w-4 h-4" />
                الذهاب إلى مساحة العمل
              </button>
            )}
            
            {(status === 'error' || status === 'expired') && (
              <>
                <button
                  onClick={() => navigate('/auth/login')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  تسجيل الدخول
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                >
                  الصفحة الرئيسية
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvite;
