export const API_BASE_URL = "https://worksy-6jj5.onrender.com"; // أو http://localhost:5000

export const apiRoutes = {
  auth: {
    login: `${API_BASE_URL}/api/v1/auth/login`,
    completeLogin: `${API_BASE_URL}/api/v1/auth/login/verify-otp`,
    register: `${API_BASE_URL}/api/v1/auth/register`,
    forgotPasswordRequest: `${API_BASE_URL}/api/v1/auth/forgot-password/request-pin`,
    forgotPasswordVerify: `${API_BASE_URL}/api/v1/auth/forgot-password/verify-pin`,
    resetPassword: `${API_BASE_URL}/api/v1/auth/forgot-password/reset`,
    resendPin: `${API_BASE_URL}/api/v1/auth/forgot-password/resend-pin`,
    logout: `${API_BASE_URL}/api/v1/auth/logout`,
    verifyOtp: `${API_BASE_URL}/api/v1/auth/verify-otp`,
    verifyEmail: `${API_BASE_URL}/api/v1/auth/verify-email`,
    resendVerificationEmail: `${API_BASE_URL}/api/v1/auth/resend-verification`,
    changePassword: `${API_BASE_URL}/api/v1/auth/change-password`,
    me: `${API_BASE_URL}/api/v1/auth/me`,
    loginWithGoogle: `${API_BASE_URL}/api/v1/auth/google/link`,
  },























  users: {
    getAll: `${API_BASE_URL}/users`,
    getById: (id: string) => `${API_BASE_URL}/users/${id}`
  },
  messages: {
    send: `${API_BASE_URL}/messages/send`,
    getByChannel: (channelId: string) => `${API_BASE_URL}/messages/channel/${channelId}`
  },
  channels: {
    list: `${API_BASE_URL}/channels`,
    create: `${API_BASE_URL}/channels/create`,
    getById: (id: string) => `${API_BASE_URL}/channels/${id}`
  },
  files: {
    upload: `${API_BASE_URL}/files/upload`,
    delete: (fileId: string) => `${API_BASE_URL}/files/${fileId}`
  },
  calls: {
    start: `${API_BASE_URL}/calls/start`,
    end: `${API_BASE_URL}/calls/end`
  }
};
