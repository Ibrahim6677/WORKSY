import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Animation/Visual */}
        <div className="mb-8">
          <div className="relative">
            <h1 className="text-9xl font-bold text-gray-200 select-none">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="w-16 h-16 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            الصفحة غير موجودة
          </h2>
          <p className="text-gray-600 mb-4">
            عذراً، لا يمكننا العثور على الصفحة التي تبحث عنها.
          </p>
          <p className="text-sm text-gray-500">
            ربما تم نقل الصفحة أو حذفها، أو قمت بكتابة عنوان خاطئ.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Home className="w-5 h-5" />
            العودة للصفحة الرئيسية
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            العودة للصفحة السابقة
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">أو جرب هذه الروابط:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/workspace" className="text-blue-600 hover:text-blue-700 hover:underline">
              مساحات العمل
            </Link>
            <Link to="/auth/login" className="text-blue-600 hover:text-blue-700 hover:underline">
              تسجيل الدخول
            </Link>
            <Link to="/auth/register" className="text-blue-600 hover:text-blue-700 hover:underline">
              إنشاء حساب
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
