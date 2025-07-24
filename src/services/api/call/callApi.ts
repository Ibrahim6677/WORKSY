import axiosInstance from "../axiosInstance";

export interface CallMember {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  role: 'host' | 'participant';
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  joinedAt: string;
}

export interface Call {
  id: string;
  title: string;
  description?: string;
  type: 'audio' | 'video' | 'screen_share';
  status: 'waiting' | 'active' | 'ended';
  channelId?: string;
  workspaceId: string;
  hostId: string;
  maxParticipants?: number;
  isRecording: boolean;
  recordingUrl?: string;
  scheduledAt?: string;
  startedAt?: string;
  endedAt?: string;
  duration?: number;
  members: CallMember[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCallData {
  title: string;
  description?: string;
  type: 'audio' | 'video' | 'screen_share';
  channelId?: string;
  maxParticipants?: number;
  scheduledAt?: string;
}

export interface JoinCallData {
  audio?: boolean;
  video?: boolean;
}

export interface CallSettings {
  audio: boolean;
  video: boolean;
  screenShare: boolean;
  recording: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ================================
// CALL MANAGEMENT
// ================================

// Create new call
export const createCall = async (
  workspaceId: string,
  callData: CreateCallData
): Promise<Call> => {
  const response = await axiosInstance.post<ApiResponse<Call>>(
    `/workspaces/${workspaceId}/calls`,
    callData
  );
  return response.data.data;
};

// Get call by ID
export const getCall = async (
  workspaceId: string,
  callId: string
): Promise<Call> => {
  const response = await axiosInstance.get<ApiResponse<Call>>(
    `/workspaces/${workspaceId}/calls/${callId}`
  );
  return response.data.data;
};

// Get active calls in workspace
export const getActiveCalls = async (workspaceId: string): Promise<Call[]> => {
  const response = await axiosInstance.get<ApiResponse<Call[]>>(
    `/workspaces/${workspaceId}/calls?status=active`
  );
  return response.data.data;
};

// Get scheduled calls
export const getScheduledCalls = async (
  workspaceId: string,
  date?: string
): Promise<Call[]> => {
  const url = `/workspaces/${workspaceId}/calls/scheduled${date ? `?date=${date}` : ''}`;
  const response = await axiosInstance.get<ApiResponse<Call[]>>(url);
  return response.data.data;
};

// Get call history
export const getCallHistory = async (
  workspaceId: string,
  page: number = 1,
  limit: number = 20
): Promise<{ calls: Call[]; total: number; totalPages: number }> => {
  const response = await axiosInstance.get<ApiResponse<{ calls: Call[]; total: number; totalPages: number }>>(
    `/workspaces/${workspaceId}/calls/history?page=${page}&limit=${limit}`
  );
  return response.data.data;
};

// ================================
// CALL PARTICIPATION
// ================================

// Join call
export const joinCall = async (
  workspaceId: string,
  callId: string,
  joinData: JoinCallData = { audio: true, video: true }
): Promise<{ call: Call; token: string; iceServers: any[] }> => {
  const response = await axiosInstance.post<ApiResponse<{ call: Call; token: string; iceServers: any[] }>>(
    `/workspaces/${workspaceId}/calls/${callId}/join`,
    joinData
  );
  return response.data.data;
};

// Leave call
export const leaveCall = async (
  workspaceId: string,
  callId: string
): Promise<void> => {
  await axiosInstance.post(
    `/workspaces/${workspaceId}/calls/${callId}/leave`
  );
};

// End call (host only)
export const endCall = async (
  workspaceId: string,
  callId: string
): Promise<void> => {
  await axiosInstance.post(
    `/workspaces/${workspaceId}/calls/${callId}/end`
  );
};

// ================================
// CALL CONTROLS
// ================================

// Mute/unmute audio
export const toggleAudio = async (
  workspaceId: string,
  callId: string,
  muted: boolean
): Promise<void> => {
  await axiosInstance.patch(
    `/workspaces/${workspaceId}/calls/${callId}/audio`,
    { muted }
  );
};

// Turn video on/off
export const toggleVideo = async (
  workspaceId: string,
  callId: string,
  videoOff: boolean
): Promise<void> => {
  await axiosInstance.patch(
    `/workspaces/${workspaceId}/calls/${callId}/video`,
    { videoOff }
  );
};

// Start/stop screen sharing
export const toggleScreenShare = async (
  workspaceId: string,
  callId: string,
  isSharing: boolean
): Promise<void> => {
  await axiosInstance.patch(
    `/workspaces/${workspaceId}/calls/${callId}/screen-share`,
    { isSharing }
  );
};

// Start/stop recording
export const toggleRecording = async (
  workspaceId: string,
  callId: string,
  isRecording: boolean
): Promise<{ recordingUrl?: string }> => {
  const response = await axiosInstance.patch<ApiResponse<{ recordingUrl?: string }>>(
    `/workspaces/${workspaceId}/calls/${callId}/recording`,
    { isRecording }
  );
  return response.data.data;
};

// ================================
// CALL MEMBERS
// ================================

// Get call members
export const getCallMembers = async (
  workspaceId: string,
  callId: string
): Promise<CallMember[]> => {
  const response = await axiosInstance.get<ApiResponse<CallMember[]>>(
    `/workspaces/${workspaceId}/calls/${callId}/members`
  );
  return response.data.data;
};

// Mute member (host only)
export const muteMember = async (
  workspaceId: string,
  callId: string,
  memberId: string
): Promise<void> => {
  await axiosInstance.patch(
    `/workspaces/${workspaceId}/calls/${callId}/members/${memberId}/mute`
  );
};

// Remove member from call (host only)
export const removeMember = async (
  workspaceId: string,
  callId: string,
  memberId: string
): Promise<void> => {
  await axiosInstance.delete(
    `/workspaces/${workspaceId}/calls/${callId}/members/${memberId}`
  );
};

// ================================
// CALL INVITATIONS
// ================================

// Invite members to call
export const inviteToCall = async (
  workspaceId: string,
  callId: string,
  memberIds: string[]
): Promise<void> => {
  await axiosInstance.post(
    `/workspaces/${workspaceId}/calls/${callId}/invite`,
    { memberIds }
  );
};

// Get call invitation link
export const getCallInviteLink = async (
  workspaceId: string,
  callId: string
): Promise<{ inviteLink: string }> => {
  const response = await axiosInstance.get<ApiResponse<{ inviteLink: string }>>(
    `/workspaces/${workspaceId}/calls/${callId}/invite-link`
  );
  return response.data.data;
};

// ================================
// CALL RECORDINGS
// ================================

// Get call recordings
export const getCallRecordings = async (
  workspaceId: string,
  callId?: string
): Promise<any[]> => {
  const url = callId 
    ? `/workspaces/${workspaceId}/calls/${callId}/recordings`
    : `/workspaces/${workspaceId}/recordings`;
  
  const response = await axiosInstance.get<ApiResponse<any[]>>(url);
  return response.data.data;
};

// Download call recording
export const downloadRecording = async (
  workspaceId: string,
  recordingId: string
): Promise<Blob> => {
  const response = await axiosInstance.get(
    `/workspaces/${workspaceId}/recordings/${recordingId}/download`,
    { responseType: 'blob' }
  );
  return response.data;
};

// Delete call recording
export const deleteRecording = async (
  workspaceId: string,
  recordingId: string
): Promise<void> => {
  await axiosInstance.delete(
    `/workspaces/${workspaceId}/recordings/${recordingId}`
  );
};
