import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ إضافة useNavigate
import { BottomLink } from '../../../components/atoms/Bottom/BottomLink';
import { Copy, Mail, CheckCircle } from 'lucide-react';

interface WorkspaceData {
  id?: string;
  name: string;
  description: string;
  image: string | null;
  userName: string;
  userPhoto: File | null;
  inviteEmails: string[];
}

interface Props {
  prevStep: () => void;
  workspaceData: WorkspaceData;
  updateWorkspaceData: (data: Partial<WorkspaceData>) => void;
  onSubmit: () => Promise<any>; // ✅ تأكد إنه Promise
}

export default function Step3InviteTeam({ prevStep, workspaceData, updateWorkspaceData, onSubmit }: Props) {
  const navigate = useNavigate(); // ✅ إضافة navigation hook
  const [emailInput, setEmailInput] = useState(workspaceData.inviteEmails.join(', '));
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null); // ✅ إضافة error state

  // تنظيف وتنسيق الإيميلات
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setEmailInput(value);
    
    // تحليل الإيميلات من النص
    const emails = value
      .split(/[,\n\s]/) // فصل بالفاصلة أو السطر الجديد أو المسافة
      .map(email => email.trim())
      .filter(email => email.length > 0 && validateEmail(email));
    
    updateWorkspaceData({ inviteEmails: emails });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setSubmitError(null); // ✅ مسح الأخطاء السابقة
    
    try {
      // ✅ إنشاء الـ workspace أولاً
      console.log('🚀 Creating workspace with data:', workspaceData);
      const result = await onSubmit();
      
      console.log('✅ Workspace created successfully:', result);
      
      // ✅ إظهار رسالة نجاح
      const successMessage = workspaceData.inviteEmails.length > 0 
        ? `Workspace created successfully! Invites sent to ${workspaceData.inviteEmails.length} people.`
        : 'Workspace created successfully!';
      
      // TODO: يمكن إضافة toast notification هنا
      console.log('🎉', successMessage);
      
      // ✅ الانتقال إلى workspace list بعد ثانيتين
      setTimeout(() => {
        console.log('🔄 Redirecting to workspace list...');
        navigate('/workspace', { 
          replace: true, // ✅ استبدال الصفحة الحالية بدلاً من إضافتها للتاريخ
          state: { 
            message: successMessage,
            newWorkspace: result 
          }
        });
      }, 1500);
      
    } catch (err: any) {
      console.error('❌ Error creating workspace:', err);
      
      // ✅ عرض رسالة خطأ واضحة
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create workspace';
      setSubmitError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // عد الإيميلات الصحيحة
  const validEmailCount = workspaceData.inviteEmails.length;
  const invalidEmails = emailInput
    .split(/[,\n\s]/)
    .map(email => email.trim())
    .filter(email => email.length > 0 && !validateEmail(email));

  return (
    <div className="text-left w-full max-w-lg mx-auto">
      <h2 className="text-3xl font-bold mb-2">Let's set up your workspace</h2>
      <h3 className="text-lg font-bold mb-1 mt-6">Invite your team</h3>
      
      <div className="flex items-center gap-2 mb-6 mt-2">
        <span className="text-xs text-gray-500">Enter emails separated by commas</span>
        <span className="ml-auto flex items-center gap-1 text-xs text-gray-500 cursor-pointer">
          <Mail className="w-4 h-4" />
          Add team members
        </span>
      </div>
      
      {/* ✅ عرض رسالة الخطأ */}
      {submitError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">
            <strong>Error:</strong> {submitError}
          </p>
        </div>
      )}
      
      {/* عرض الإيميلات الخاطئة */}
      {invalidEmails.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-700">
            <strong>Invalid emails:</strong> {invalidEmails.join(', ')}
          </p>
        </div>
      )}
      
      {/* ✅ رسالة نجاح أثناء الإنشاء */}
      {isLoading && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <p className="text-sm text-blue-700">
              {validEmailCount > 0 
                ? `Creating workspace and sending invites to ${validEmailCount} people...`
                : 'Creating your workspace...'
              }
            </p>
          </div>
        </div>
      )}
      
      <div className="relative">
        <textarea
          placeholder="example@gmail.com, friend@outlook.com, colleague@company.com"
          rows={4}
          value={emailInput}
          onChange={handleEmailInputChange}
          disabled={isLoading} // ✅ تعطيل أثناء التحميل
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        
        {/* عداد الإيميلات */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs text-gray-500">
            {validEmailCount > 0 ? (
              <span className="text-green-600">
                ✓ {validEmailCount} valid email{validEmailCount !== 1 ? 's' : ''}
              </span>
            ) : (
              <span>No emails added yet</span>
            )}
          </span>
          
          {invalidEmails.length > 0 && (
            <span className="text-xs text-red-500">
              ⚠ {invalidEmails.length} invalid email{invalidEmails.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-4 mt-2">
        <button
          onClick={prevStep}
          disabled={isLoading}
          className="border px-6 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`bg-purple-600 text-white px-8 py-2 rounded-md hover:bg-purple-700 transition text-sm font-semibold ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              {validEmailCount > 0 ? 'Creating & Sending...' : 'Creating...'}
            </span>
          ) : (
            validEmailCount > 0 ? `Create & Invite ${validEmailCount} People` : 'Create Workspace'
          )}
        </button>
        
        {/* ✅ تعطيل Skip أثناء التحميل */}
        {!isLoading && (
          <BottomLink
            to="/workspace"
            variant="outline"
            className="ml-2 text-gray-500 text-sm hover:underline bg-transparent border-none shadow-none"
          >
            Skip this step
          </BottomLink>
        )}
      </div>
      
      {/* ✅ رسالة توضيحية أثناء التحميل */}
      {isLoading && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Please wait... You'll be redirected to your workspace once it's created.
          </p>
        </div>
      )}
    </div>
  );
}
