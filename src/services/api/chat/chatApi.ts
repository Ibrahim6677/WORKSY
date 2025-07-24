import axiosInstance from "../axiosInstance";
import { apiRoutes } from "../../../utils/constants/apiRoutes";

export interface Message {
  id: string;
  content: string;
  type: 'text' | 'file' | 'image' | 'voice';
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  channelId?: string;
  conversationId?: string;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  replyTo?: {
    id: string;
    content: string;
    sender: {
      id: string;
      name: string;
    };
  };
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private';
  workspaceId: string;
  createdAt: string;
  members: {
    id: string;
    name: string;
    role: 'admin' | 'member';
  }[];
}

export interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChannelData {
  name: string;
  description?: string;
  type: 'public' | 'private';
  memberIds?: string[];
}

export interface SendMessageData {
  content: string;
  type?: 'text' | 'file' | 'image' | 'voice';
  replyToId?: string;
  attachments?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ================================
// CHANNEL MESSAGES
// ================================

// Get channel messages
export const getChannelMessages = async (
  workspaceId: string, 
  channelId: string,
  page: number = 1,
  limit: number = 50
): Promise<Message[]> => {
  const response = await axiosInstance.get<ApiResponse<Message[]>>(
    `${apiRoutes.channels.getMessages(workspaceId, channelId)}?page=${page}&limit=${limit}`
  );
  return response.data.data;
};

// Send channel message
export const sendChannelMessage = async (
  workspaceId: string,
  channelId: string,
  messageData: SendMessageData
): Promise<Message> => {
  const response = await axiosInstance.post<ApiResponse<Message>>(
    apiRoutes.channels.sendMessage(workspaceId, channelId),
    messageData
  );
  return response.data.data;
};

// Update message
export const updateMessage = async (
  workspaceId: string,
  channelId: string,
  messageId: string,
  content: string
): Promise<Message> => {
  const response = await axiosInstance.patch<ApiResponse<Message>>(
    apiRoutes.channels.updateMessage(workspaceId, channelId, messageId),
    { content }
  );
  return response.data.data;
};

// Delete message
export const deleteMessage = async (
  workspaceId: string,
  channelId: string,
  messageId: string
): Promise<void> => {
  await axiosInstance.delete(
    apiRoutes.channels.deleteMessage(workspaceId, channelId, messageId)
  );
};

// ================================
// CHANNELS
// ================================

// Get all channels
export const getChannels = async (workspaceId: string): Promise<Channel[]> => {
  const response = await axiosInstance.get<ApiResponse<Channel[]>>(
    apiRoutes.channels.getAll(workspaceId)
  );
  return response.data.data;
};

// Get channel by ID
export const getChannelById = async (
  workspaceId: string,
  channelId: string
): Promise<Channel> => {
  const response = await axiosInstance.get<ApiResponse<Channel>>(
    apiRoutes.channels.getById(workspaceId, channelId)
  );
  return response.data.data;
};

// Create channel
export const createChannel = async (
  workspaceId: string,
  channelData: CreateChannelData
): Promise<Channel> => {
  const response = await axiosInstance.post<ApiResponse<Channel>>(
    apiRoutes.channels.create(workspaceId),
    channelData
  );
  return response.data.data;
};

// Update channel
export const updateChannel = async (
  workspaceId: string,
  channelId: string,
  updates: Partial<CreateChannelData>
): Promise<Channel> => {
  const response = await axiosInstance.patch<ApiResponse<Channel>>(
    apiRoutes.channels.update(workspaceId, channelId),
    updates
  );
  return response.data.data;
};

// Delete channel
export const deleteChannel = async (
  workspaceId: string,
  channelId: string
): Promise<void> => {
  await axiosInstance.delete(apiRoutes.channels.delete(workspaceId, channelId));
};

// Join channel
export const joinChannel = async (
  workspaceId: string,
  channelId: string
): Promise<void> => {
  await axiosInstance.post(apiRoutes.channels.addMember(workspaceId, channelId));
};

// Leave channel
export const leaveChannel = async (
  workspaceId: string,
  channelId: string
): Promise<void> => {
  await axiosInstance.delete(apiRoutes.channels.leaveChannel(workspaceId, channelId));
};

// Get channel members
export const getChannelMembers = async (
  workspaceId: string,
  channelId: string
): Promise<Channel['members']> => {
  const response = await axiosInstance.get<ApiResponse<Channel['members']>>(
    apiRoutes.channels.getMembers(workspaceId, channelId)
  );
  return response.data.data;
};

// Add member to channel
export const addChannelMember = async (
  workspaceId: string,
  channelId: string,
  userId: string
): Promise<void> => {
  await axiosInstance.post(apiRoutes.channels.addMember(workspaceId, channelId), {
    userId
  });
};

// Remove member from channel
export const removeChannelMember = async (
  workspaceId: string,
  channelId: string,
  memberId: string
): Promise<void> => {
  await axiosInstance.delete(
    apiRoutes.channels.removeMember(workspaceId, channelId, memberId)
  );
};

// ================================
// DIRECT MESSAGES
// ================================

// Get conversations
export const getConversations = async (workspaceId: string): Promise<Conversation[]> => {
  const response = await axiosInstance.get<ApiResponse<Conversation[]>>(
    apiRoutes.directMessages.getConversations(workspaceId)
  );
  return response.data.data;
};

// Create conversation
export const createConversation = async (
  workspaceId: string,
  participantIds: string[]
): Promise<Conversation> => {
  const response = await axiosInstance.post<ApiResponse<Conversation>>(
    apiRoutes.directMessages.createConversation(workspaceId),
    { participantIds }
  );
  return response.data.data;
};

// Get conversation messages
export const getConversationMessages = async (
  workspaceId: string,
  conversationId: string,
  page: number = 1,
  limit: number = 50
): Promise<Message[]> => {
  const response = await axiosInstance.get<ApiResponse<Message[]>>(
    `${apiRoutes.directMessages.getMessages(workspaceId, conversationId)}?page=${page}&limit=${limit}`
  );
  return response.data.data;
};

// Send direct message
export const sendDirectMessage = async (
  workspaceId: string,
  conversationId: string,
  messageData: SendMessageData
): Promise<Message> => {
  const response = await axiosInstance.post<ApiResponse<Message>>(
    `${apiRoutes.directMessages.getMessages(workspaceId, conversationId)}`,
    messageData
  );
  return response.data.data;
};

// ================================
// MEETINGS
// ================================

// Create meeting
export const createMeeting = async (
  workspaceId: string,
  channelId: string,
  meetingData: {
    title: string;
    description?: string;
    scheduledAt?: string;
    duration?: number;
  }
): Promise<any> => {
  const response = await axiosInstance.post<ApiResponse<any>>(
    apiRoutes.channels.createMeeting(workspaceId, channelId),
    meetingData
  );
  return response.data.data;
};

// Get meetings
export const getMeetings = async (
  workspaceId: string,
  channelId: string
): Promise<any[]> => {
  const response = await axiosInstance.get<ApiResponse<any[]>>(
    apiRoutes.channels.getMeetings(workspaceId, channelId)
  );
  return response.data.data;
};

// Join meeting
export const joinMeeting = async (
  workspaceId: string,
  channelId: string,
  meetingId: string
): Promise<any> => {
  const response = await axiosInstance.post<ApiResponse<any>>(
    apiRoutes.channels.joinMeeting(workspaceId, channelId, meetingId)
  );
  return response.data.data;
};