import type { Middleware } from '@reduxjs/toolkit';
import { logout } from '../../features/auth/authSlice';

const authMiddleware: Middleware = (store) => (next) => (action: any) => {
  // تحقق من الأخطاء المتعلقة بالمصادقة
  if (action.type.endsWith('/rejected')) {
    const error = action.payload;
    
    // إذا كان الخطأ متعلق بانتهاء صلاحية التوكن أو عدم المصادقة
    if (
      typeof error === 'string' && (
        error.includes('Unauthorized') ||
        error.includes('Token expired') ||
        error.includes('Invalid token') ||
        error.includes('Authentication required')
      )
    ) {
      // تسجيل خروج تلقائي
      store.dispatch(logout());
      
      // إعادة التوجه لصفحة تسجيل الدخول
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
  }

  return next(action);
};

export default authMiddleware;
