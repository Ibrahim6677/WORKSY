import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { API_BASE_URL } from "../../utils/constants/apiRoutes";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  withCredentials: true
});

// Request interceptor - Add auth token and logging
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // Add authorization token
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🌐 ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
        headers: config.headers
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
      });
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      });
    }

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
            refreshToken
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          
          // Update tokens in localStorage
          localStorage.setItem("accessToken", accessToken);
          if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
          }

          // Update the original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          // Retry the original request
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - redirect to login
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      }
    }

    // Handle other error statuses
    const errorMessage = getErrorMessage(error);
    
    // Create enhanced error object
    const enhancedError = {
      ...error,
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data
    };

    return Promise.reject(enhancedError);
  }
);

// Helper function to extract meaningful error messages
function getErrorMessage(error: AxiosError): string {
  if (error.response?.data) {
    const data = error.response.data as any;
    
    // Try different common error message fields
    if (data.message) return data.message;
    if (data.error) return data.error;
    if (data.detail) return data.detail;
    if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors[0].message || data.errors[0];
    }
  }

  // Fallback to status-based messages
  switch (error.response?.status) {
    case 400:
      return 'طلب غير صحيح - يرجى التحقق من البيانات المدخلة';
    case 401:
      return 'غير مخول - يرجى تسجيل الدخول مرة أخرى';
    case 403:
      return 'ممنوع - ليس لديك صلاحية للوصول لهذا المورد';
    case 404:
      return 'غير موجود - المورد المطلوب غير متاح';
    case 409:
      return 'تعارض - البيانات موجودة مسبقاً';
    case 422:
      return 'بيانات غير صحيحة - يرجى مراجعة المدخلات';
    case 429:
      return 'تم تجاوز الحد المسموح - يرجى المحاولة لاحقاً';
    case 500:
      return 'خطأ في الخادم - يرجى المحاولة لاحقاً';
    case 502:
      return 'خطأ في البوابة - الخدمة غير متاحة مؤقتاً';
    case 503:
      return 'الخدمة غير متاحة - يرجى المحاولة لاحقاً';
    default:
      if (error.code === 'NETWORK_ERROR' || !error.response) {
        return 'خطأ في الشبكة - يرجى التحقق من اتصال الإنترنت';
      }
      return error.message || 'حدث خطأ غير متوقع';
  }
}

// Export enhanced axios instance
export default axiosInstance;

// Export utility functions for manual use
export { getErrorMessage };

// Export types for better TypeScript support
export type { AxiosRequestConfig, AxiosResponse, AxiosError };
