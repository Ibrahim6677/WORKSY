import axios from "axios";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: 'https://worksy-6jj5.onrender.com',
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor - Add auth token and logging
axiosInstance.interceptors.request.use(
  (config) => {
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🌐 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    
    // Check if the request is for a Google OAuth endpoint
    const isGoogleAuth = config.url?.includes('/api/v1/auth/google') || 
                        config.url?.includes('/api/v1/google/link') ||
                        config.url?.includes('/api/v1/oauth/google');
    
    // Add authorization header for non-Google requests
    if (!isGoogleAuth) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        if (process.env.NODE_ENV === 'development') {
          console.log('🔐 Added authorization header');
        }
      } else if (process.env.NODE_ENV === 'development') {
        console.log('⚠️ No access token found');
      }
    } else {
      // For Google OAuth requests, ensure no Authorization header is set
      delete config.headers.Authorization;
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Google OAuth request - no auth header needed');
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle responses and errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`);
    }

    return response;
  },
  async (error) => {
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data || error.message);
    }

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401) {
      // Check if the request was for a Google OAuth endpoint
      const isGoogleAuth = error.config?.url?.includes('/auth/google') || 
                          error.config?.url?.includes('/google/link');
      
      // For non-Google requests, clear auth data and redirect to login
      if (!isGoogleAuth) {
        if (process.env.NODE_ENV === 'development') {
          console.log('🚨 401 Unauthorized - Clearing auth data');
        }
        
        // Clear auth data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } else if (process.env.NODE_ENV === 'development') {
        console.log('🚨 Google OAuth 401 - Invalid credentials or endpoint');
      }
    }

    return Promise.reject(error);
  }
);

// Export enhanced axios instance
export default axiosInstance;
