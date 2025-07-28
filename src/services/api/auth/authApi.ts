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

export interface GoogleLoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      avatar?: string;
    };
    accessToken: string;
    refreshToken?: string;
  };
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

// الطريقة الصحيحة - استخدام Google Credential
// Helper function لاستخراج البيانات من JWT
const decodeJwtPayload = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

export const loginWithGoogle = async (googleCredential: string): Promise<GoogleLoginResponse> => {
  try {
    console.log('🚀 Google login started...');
    
    // استخراج الإيميل من JWT
    const jwtPayload = decodeJwtPayload(googleCredential);
    const email = jwtPayload?.email;
    const name = jwtPayload?.name;
    
    if (!email) {
      throw new Error('No email found in Google token');
    }
    
    // 🔧 جرب format مختلف للـ request
    const requestData = {
      // الاحتمال الأول - الحالي
      provider: "google",
      oauthId: googleCredential,
      email: email
      
      // أو جرب الاحتمال الثاني:
      // credential: googleCredential,
      // email: email,
      // name: name
      
      // أو جرب الاحتمال الثالث:
      // token: googleCredential,
      // provider: "google"
      
      // أو جرب الاحتمال الرابع:
      // googleToken: googleCredential
    };
    
    console.log('📤 Sending to backend:', requestData);
    
    const res = await axiosInstance.post<GoogleLoginResponse>(
      apiRoutes.auth.loginWithGoogle, 
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          // ✅ تأكد من عدم إرسال Authorization header
        }
      }
    );
    
    console.log('✅ Backend response received:', res.data);
    
    // 🔍 تشخيص structure الـ response
    console.log('🔍 Response analysis:');
    console.log('- res.data:', res.data);
    console.log('- res.data.data:', res.data.data);
    console.log('- res.data.token:', (res.data as any).token);
    console.log('- res.data.accessToken:', res.data.data?.accessToken);
    
    // جرب كل الاحتمالات المختلفة للـ token
    let accessToken = null;
    let user = null;
    let refreshToken = null;
    
    // الاحتمال الأول: البيانات في res.data.data
    if (res.data.data) {
      accessToken = res.data.data.accessToken || res.data.data.token;
      user = res.data.data.user;
      refreshToken = res.data.data.refreshToken;
    }
    
    // الاحتمال التاني: البيانات في res.data مباشرة
    if (!accessToken) {
      accessToken = (res.data as any).accessToken || (res.data as any).token;
      user = (res.data as any).user;
      refreshToken = (res.data as any).refreshToken;
    }
    
    // الاحتمال التالت: البيانات في res.data.result أو res.data.response
    if (!accessToken && (res.data as any).result) {
      accessToken = (res.data as any).result.accessToken || (res.data as any).result.token;
      user = (res.data as any).result.user;
      refreshToken = (res.data as any).result.refreshToken;
    }
    
    console.log('🔍 Extracted values:');
    console.log('- accessToken:', accessToken ? `${accessToken.substring(0, 20)}...` : 'NOT FOUND');
    console.log('- user:', user);
    console.log('- refreshToken:', refreshToken ? 'Found' : 'Not found');
    
    if (!accessToken) {
      console.error('❌ No access token found in any expected location!');
      console.error('Full response structure:', JSON.stringify(res.data, null, 2));
      throw new Error('No access token received from server');
    }
    
    // حفظ البيانات
    console.log('💾 Saving to localStorage...');
    localStorage.setItem('accessToken', accessToken);
    
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    // تحديث axios headers
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    
    console.log('✅ Google login completed successfully!');
    console.log('🔍 Verification - localStorage now contains:');
    console.log('- accessToken:', !!localStorage.getItem('accessToken'));
    console.log('- user:', !!localStorage.getItem('user'));
    
    return res.data;
  } catch (error: any) {
    console.error("❌ Google login failed:");
    console.error("- Error message:", error.message);
    console.error("- Response status:", error.response?.status);
    console.error("- Response data:", error.response?.data);
    
    // 🔍 اطبع الـ request details للتشخيص
    console.error("- Request URL:", error.config?.url);
    console.error("- Request method:", error.config?.method);
    console.error("- Request data:", error.config?.data);
    
    throw error;
  }
};
