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
  workspaces: {
    create: `${API_BASE_URL}/api/v1/workspace`,
    getAll: `${API_BASE_URL}/api/v1/workspace`,
    getById: (id: string) => `${API_BASE_URL}/api/v1/workspace/${id}`,
    update: (id: string) => `${API_BASE_URL}/api/v1/workspace/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/v1/workspace/${id}`,
    // Members
    getAllMembers: (workspaceId: string) => `${API_BASE_URL}/api/v1/workspace/${workspaceId}/members`,
    changeMemberRole: (workspaceId: string, memberId: string) => `${API_BASE_URL}/api/v1/workspace/${workspaceId}/members/${memberId}/role`,
    removeMember: (workspaceId: string, memberId: string) => `${API_BASE_URL}/api/v1/workspace/${workspaceId}/members/${memberId}`,
    leaveWorkspace: (workspaceId: string) => `${API_BASE_URL}/api/v1/workspace/${workspaceId}/leave`,
    transferOwnership: (workspaceId: string) => `${API_BASE_URL}/api/v1/workspace/${workspaceId}/transfer-ownership`,
  },
  users: {
    getAll: `${API_BASE_URL}/api/v1/users`,
    getById: (id: string) => `${API_BASE_URL}/api/v1/users/${id}`,
    getMe: `${API_BASE_URL}/api/v1/users/me`,
    updateMe: `${API_BASE_URL}/api/v1/user`,
    updateById: (id: string) => `${API_BASE_URL}/api/v1/users/${id}`,
    updateRole: (id: string) => `${API_BASE_URL}/api/v1/users/${id}/role`,
    deleteById: (id: string) => `${API_BASE_URL}/api/v1/users/${id}`,
  },
  invites: {
    create: (workspaceId: string) => `${API_BASE_URL}/api/v1/workspace/${workspaceId}/invites`,
    accept: (token: string) => `${API_BASE_URL}/api/v1/invite/accept/${token}`,
    generateLink: (workspaceId: string) => `${API_BASE_URL}/api/v1/workspace/${workspaceId}/invites/link`,
    getAll: (workspaceId: string) => `${API_BASE_URL}/api/v1/workspace/${workspaceId}/invites`,
    cancel: (workspaceId: string, inviteId: string) => `${API_BASE_URL}/api/v1/workspace/${workspaceId}/invites/${inviteId}`,
    resend: (workspaceId: string, inviteId: string) => `${API_BASE_URL}/api/v1/workspace/${workspaceId}/invites/${inviteId}/resend`,
  },
  channels: {
    create: (workspaceId: string) => `${API_BASE_URL}/api/v1/workspace/${workspaceId}/channels`,
    getAll: (workspaceId: string) => `${API_BASE_URL}/api/v1/workspace/${workspaceId}/channels`,
    getById: (workspaceId: string, channelId: string) => `${API_BASE_URL}/api/v1/workspace/${workspaceId}/channels/${channelId}`,
    update: (workspaceId: string, channelId: string) => `${API_BASE_URL}/api/v1/workspace/${workspaceId}/channels/${channelId}`,
    delete: (workspaceId: string, channelId: string) => `${API_BASE_URL}/api/v1/workspace/${workspaceId}/channels/${channelId}`,
    // Channel Members
    addMember: (workspaceId: string, channelId: string) => `${API_BASE_URL}/api/v1/workspace/${workspaceId}/channels/${channelId}/members`,
    getMembers: (workspaceId: string, channelId: string) => `${API_BASE_URL}/api/v1/workspace/${workspaceId}/channels/${channelId}/members`,
    removeMember: (workspaceId: string, channelId: string, memberId: string) => `${API_BASE_URL}/api/v1/workspace/${workspaceId}/channels/${channelId}/members/${memberId}`,
    changeMemberRole: (workspaceId: string, channelId: string, memberId: string) => `${API_BASE_URL}/api/v1/workspace/${workspaceId}/channels/${channelId}/members/${memberId}/role`,
    leaveChannel: (workspaceId: string, channelId: string) => `${API_BASE_URL}/api/v1/workspace/${workspaceId}/channels/${channelId}/leave`,
    // Messages
    sendMessage: (workspaceId: string, channelId: string) => `${API_BASE_URL}/api/v1/workspace/${workspaceId}/channels/${channelId}/messages`,
    getMessages: (workspaceId: string, channelId: string) => `${API_BASE_URL}/api/v1/workspace/${workspaceId}/channels/${channelId}/messages`,
    updateMessage: (workspaceId: string, channelId: string, messageId: string) => `${API_BASE_URL}/api/v1/workspace/${workspaceId}/channels/${channelId}/messages/${messageId}`,
    deleteMessage: (workspaceId: string, channelId: string, messageId: string) => `${API_BASE_URL}/api/v1/workspace/${workspaceId}/channels/${channelId}/messages/${messageId}`,
    // Meetings
    createMeeting: (workspaceId: string, channelId: string) => `${API_BASE_URL}/api/v1/workspace/${workspaceId}/channels/${channelId}/meetings`,
    getMeetings: (workspaceId: string, channelId: string) => `${API_BASE_URL}/api/v1/workspace/${workspaceId}/channels/${channelId}/meetings`,
    updateMeeting: (workspaceId: string, channelId: string, meetingId: string) => `${API_BASE_URL}/api/v1/workspace/${workspaceId}/channels/${channelId}/meetings/${meetingId}`,
    deleteMeeting: (workspaceId: string, channelId: string, meetingId: string) => `${API_BASE_URL}/api/v1/workspace/${workspaceId}/channels/${channelId}/meetings/${meetingId}`,
    joinMeeting: (workspaceId: string, channelId: string, meetingId: string) => `${API_BASE_URL}/api/v1/workspace/${workspaceId}/channels/${channelId}/meetings/${meetingId}/join`,
  },
  directMessages: {
    getConversations: (workspaceId: string) => `${API_BASE_URL}/api/v1/workspace/${workspaceId}/dm/conversations`,
    createConversation: (workspaceId: string) => `${API_BASE_URL}/api/v1/workspace/${workspaceId}/dm/conversations`,
    getMessages: (workspaceId: string, conversationId: string) => `${API_BASE_URL}/api/v1/workspace/${workspaceId}/dm/conversations/${conversationId}/messages`,
  },
  files: {
    upload: `${API_BASE_URL}/api/v1/files/upload`,
    getAll: (workspaceId: string) => `${API_BASE_URL}/api/v1/workspace/${workspaceId}/files`,
    getById: (fileId: string) => `${API_BASE_URL}/api/v1/files/${fileId}`,
    download: (fileId: string) => `${API_BASE_URL}/api/v1/files/${fileId}/download`,
    delete: (fileId: string) => `${API_BASE_URL}/api/v1/files/${fileId}`,
  },
  calendar: {
    getAuthUrl: `${API_BASE_URL}/api/v1/integrations/google-calendar/auth-url`,
    callback: `${API_BASE_URL}/api/v1/integrations/google-calendar/callback`,
  },
  profile: {
    getUserProfile: `${API_BASE_URL}/api/v1/user/profile`,
    updateProfile: `${API_BASE_URL}/api/v1/user/profile`,
    uploadAvatar: `${API_BASE_URL}/api/v1/user/avatar`,
    deleteAvatar: `${API_BASE_URL}/api/v1/user/avatar`,
  },
  calls: {
    start: `${API_BASE_URL}/calls/start`,
    end: `${API_BASE_URL}/calls/end`
  }
};
