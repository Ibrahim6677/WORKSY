export const API_BASE_URL = "http://localhost:4000/api/v1"; // أو http://localhost:5000

export const apiRoutes = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    forgotPasswordRequest: `${API_BASE_URL}/auth/forgot-password/request-pin`,
    forgotPasswordVerify: `${API_BASE_URL}/auth/forgot-password/verify-pin`,
    resetPassword: `${API_BASE_URL}/auth/forgot-password/reset`,
    logout: `${API_BASE_URL}/auth/logout`,
    verifyOtp: `${API_BASE_URL}/auth/verify-otp`,
    verifyEmail: `${API_BASE_URL}/auth/verify-email`,
    resendVerificationEmail: `${API_BASE_URL}/auth/resend-verification`,
    me: `${API_BASE_URL}/auth/me`,
    loginWithGoogle: `${API_BASE_URL}/auth/google/link`,
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
