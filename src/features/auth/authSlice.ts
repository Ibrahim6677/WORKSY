import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  login,
  completeLogin,
  register,
  forgotPasswordRequest,
  forgotPasswordVerify,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
  changePassword,
  fetchMe,
  logout as logoutApi,
  loginWithGoogle
} from "../../services/api/auth/authApi";
import type {
  User,
  LoginData,
  CompleteLoginData,
  RegisterData
} from "../../services/api/auth/authApi";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  sessionToken: string | null;
  loading: boolean;
  error: string | null;
  // Login flow states
  loginStep: 'initial' | 'otp-required' | 'completed';
  // Password reset states
  resetStep: 'initial' | 'pin-sent' | 'pin-verified' | 'completed';
  resetToken: string | null;
}

const initialState: AuthState = {
  isAuthenticated: Boolean(localStorage.getItem('accessToken')),
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  sessionToken: null,
  loading: false,
  error: null,
  loginStep: 'initial',
  resetStep: 'initial',
  resetToken: null
};

// Async Thunks
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (data: LoginData, { rejectWithValue }) => {
    try {
      const response = await login(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'فشل في تسجيل الدخول');
    }
  }
);

export const completeLoginAsync = createAsyncThunk(
  'auth/completeLogin',
  async (data: CompleteLoginData, { rejectWithValue }) => {
    try {
      const response = await completeLogin(data);
      // حفظ البيانات في localStorage
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'فشل في إكمال تسجيل الدخول');
    }
  }
);

export const registerAsync = createAsyncThunk(
  'auth/register',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await register(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'فشل في التسجيل');
    }
  }
);

export const forgotPasswordRequestAsync = createAsyncThunk(
  'auth/forgotPasswordRequest',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await forgotPasswordRequest(email);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'فشل في إرسال رمز الإعادة');
    }
  }
);

export const forgotPasswordVerifyAsync = createAsyncThunk(
  'auth/forgotPasswordVerify',
  async (data: { email: string; pin: string; resetToken: string }, { rejectWithValue }) => {
    try {
      const response = await forgotPasswordVerify(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'فشل في التحقق من الرمز');
    }
  }
);

export const resetPasswordAsync = createAsyncThunk(
  'auth/resetPassword',
  async (data: { token: string; password: string; confirmPassword: string }, { rejectWithValue }) => {
    try {
      const response = await resetPassword(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'فشل في إعادة تعيين كلمة المرور');
    }
  }
);

export const verifyEmailAsync = createAsyncThunk(
  'auth/verifyEmail',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await verifyEmail(token);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'فشل في التحقق من البريد الإلكتروني');
    }
  }
);

export const resendVerificationEmailAsync = createAsyncThunk(
  'auth/resendVerificationEmail',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await resendVerificationEmail(email);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'فشل في إعادة إرسال رسالة التحقق');
    }
  }
);

export const changePasswordAsync = createAsyncThunk(
  'auth/changePassword',
  async (data: { email: string; oldPassword: string; newPassword: string; confirmPassword: string }, { rejectWithValue }) => {
    try {
      const response = await changePassword(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'فشل في تغيير كلمة المرور');
    }
  }
);

export const fetchMeAsync = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchMe();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'فشل في جلب بيانات المستخدم');
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      return true;
    } catch (error: any) {
      // حتى لو فشل الطلب، نقوم بتسجيل الخروج محلياً
      return true;
    }
  }
);

export const loginWithGoogleAsync = createAsyncThunk(
  'auth/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      await loginWithGoogle();
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || 'فشل في تسجيل الدخول بجوجل');
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Synchronous actions
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken?: string }>) => {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
      localStorage.setItem('accessToken', action.payload.accessToken);
      if (action.payload.refreshToken) {
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    resetLoginFlow: (state) => {
      state.loginStep = 'initial';
      state.sessionToken = null;
      state.error = null;
    },
    resetPasswordFlow: (state) => {
      state.resetStep = 'initial';
      state.resetToken = null;
      state.error = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.sessionToken = null;
      state.loginStep = 'initial';
      state.resetStep = 'initial';
      state.resetToken = null;
      state.error = null;
      // Clear localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.loginStep = 'otp-required';
        state.sessionToken = action.payload.data.sessionToken;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Complete Login
      .addCase(completeLoginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeLoginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
        state.accessToken = action.payload.data.accessToken;
        state.refreshToken = action.payload.data.refreshToken || null;
        state.loginStep = 'completed';
        state.sessionToken = null;
      })
      .addCase(completeLoginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Register
      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.loading = false;
        // لا نقوم بتسجيل الدخول تلقائياً بعد التسجيل
        // المستخدم يحتاج للتحقق من البريد الإلكتروني أولاً
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Forgot Password Request
      .addCase(forgotPasswordRequestAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordRequestAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.resetStep = 'pin-sent';
        state.resetToken = action.payload.data.resetToken;
      })
      .addCase(forgotPasswordRequestAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Forgot Password Verify
      .addCase(forgotPasswordVerifyAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordVerifyAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.resetStep = 'pin-verified';
        state.resetToken = action.payload.data.resetToken;
      })
      .addCase(forgotPasswordVerifyAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Reset Password
      .addCase(resetPasswordAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordAsync.fulfilled, (state) => {
        state.loading = false;
        state.resetStep = 'completed';
        state.resetToken = null;
      })
      .addCase(resetPasswordAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Me
      .addCase(fetchMeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        localStorage.setItem('user', JSON.stringify(action.payload.data));
      })
      .addCase(fetchMeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // إذا فشل جلب البيانات، قد يكون التوكن منتهي الصلاحية
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      })

      // Logout
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.sessionToken = null;
        state.loginStep = 'initial';
        state.resetStep = 'initial';
        state.resetToken = null;
        state.error = null;
      })

      // Verify Email
      .addCase(verifyEmailAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmailAsync.fulfilled, (state) => {
        state.loading = false;
        // تحديث حالة التحقق في بيانات المستخدم
        if (state.user) {
          state.user.isVerified = true;
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      })
      .addCase(verifyEmailAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { 
  setUser, 
  setTokens, 
  clearError, 
  resetLoginFlow, 
  resetPasswordFlow, 
  logout 
} = authSlice.actions;

export default authSlice.reducer;
