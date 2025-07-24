import axiosInstance from "../axiosInstance";
import { apiRoutes } from "../../../utils/constants/apiRoutes";

// TypeScript Interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  role: 'MEMBER' | 'APP_ADMIN' | 'GUEST';
  status: 'ACTIVE' | 'INACTIVE';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    sessionToken: string;
    email: string;
  };
}

export interface CompleteLoginData {
  email: string;
  sessionToken: string;
  otp: string;
}

export interface CompleteLoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken?: string;
  };
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    verificationToken?: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Auth API Functions
export const login = async (data: LoginData): Promise<LoginResponse> => {
  const res = await axiosInstance.post<LoginResponse>(apiRoutes.auth.login, data);
  return res.data;
};

export const completeLogin = async (data: CompleteLoginData): Promise<CompleteLoginResponse> => {
  const res = await axiosInstance.post<CompleteLoginResponse>(apiRoutes.auth.completeLogin, data);
  return res.data;
};

export const register = async (data: RegisterData): Promise<RegisterResponse> => {
  const res = await axiosInstance.post<RegisterResponse>(apiRoutes.auth.register, data);
  return res.data;
};

export const verifyOtp = async (data: { email: string; otp: string; sessionToken: string }): Promise<ApiResponse<any>> => {
  const res = await axiosInstance.post<ApiResponse<any>>(apiRoutes.auth.verifyOtp, data);
  return res.data;
};

export const forgotPasswordRequest = async (email: string): Promise<ApiResponse<{ resetToken: string }>> => {
  const res = await axiosInstance.post<ApiResponse<{ resetToken: string }>>(
    apiRoutes.auth.forgotPasswordRequest, 
    { email }
  );
  return res.data;
};

export const forgotPasswordVerify = async (data: { 
  email: string; 
  pin: string; 
  resetToken: string 
}): Promise<ApiResponse<{ resetToken: string }>> => {
  const res = await axiosInstance.post<ApiResponse<{ resetToken: string }>>(
    apiRoutes.auth.forgotPasswordVerify, 
    data
  );
  return res.data;
};

export const resetPassword = async (data: { 
  token: string; 
  password: string;
  confirmPassword: string;
}): Promise<ApiResponse<any>> => {
  const res = await axiosInstance.patch<ApiResponse<any>>(apiRoutes.auth.resetPassword, data);
  return res.data;
};

export const resendPin = async (email: string): Promise<ApiResponse<any>> => {
  const res = await axiosInstance.post<ApiResponse<any>>(apiRoutes.auth.resendPin, { email });
  return res.data;
};

export const verifyEmail = async (token: string): Promise<ApiResponse<any>> => {
  const res = await axiosInstance.post<ApiResponse<any>>(`${apiRoutes.auth.verifyEmail}/${token}`);
  return res.data;
};

export const resendVerificationEmail = async (email: string): Promise<ApiResponse<any>> => {
  const res = await axiosInstance.post<ApiResponse<any>>(apiRoutes.auth.resendVerificationEmail, { email });
  return res.data;
};

export const changePassword = async (data: { 
  email: string; 
  oldPassword: string; 
  newPassword: string; 
  confirmPassword: string 
}): Promise<ApiResponse<any>> => {
  const res = await axiosInstance.patch<ApiResponse<any>>(apiRoutes.auth.changePassword, data);
  return res.data;
};

export const fetchMe = async (): Promise<ApiResponse<User>> => {
  const res = await axiosInstance.get<ApiResponse<User>>(apiRoutes.auth.me);
  return res.data;
};

export const logout = async (): Promise<ApiResponse<any>> => {
  const res = await axiosInstance.post<ApiResponse<any>>(apiRoutes.auth.logout);
  // Clear local storage
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  return res.data;
};

export const loginWithGoogle = async (): Promise<void> => {
  try {
    // فتح نافذة جديدة لمصادقة جوجل
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    const authWindow = window.open(
      apiRoutes.auth.loginWithGoogle,
      "GoogleLogin",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    // استمع لرسالة من السيرفر بعد نجاح المصادقة
    return new Promise((resolve, reject) => {
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          window.removeEventListener('message', messageListener);
          authWindow?.close();
          resolve();
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          window.removeEventListener('message', messageListener);
          authWindow?.close();
          reject(new Error(event.data.error));
        }
      };

      window.addEventListener('message', messageListener);
      
      // تحقق من إغلاق النافذة
      const checkClosed = setInterval(() => {
        if (authWindow?.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          reject(new Error('تم إغلاق نافذة المصادقة'));
        }
      }, 1000);
    });
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
};
