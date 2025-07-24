import axiosInstance from '../axiosInstance';
import { apiRoutes } from '../../../utils/constants/apiRoutes';

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

export interface CreateChannelData {
  name: string;
  description?: string;
  type: 'public' | 'private';
  workspaceId: string;
}

export interface UpdateChannelData {
  name?: string;
  description?: string;
  type?: 'public' | 'private';
}

// Get all channels for a workspace
export const getWorkspaceChannels = async (workspaceId: string): Promise<Channel[]> => {
  const response = await axiosInstance.get(apiRoutes.channels.getAll(workspaceId));
  return response.data;
};

// Get channel by ID
export const getChannelById = async (workspaceId: string, channelId: string): Promise<Channel> => {
  const response = await axiosInstance.get(apiRoutes.channels.getById(workspaceId, channelId));
  return response.data;
};

// Create a new channel
export const createChannel = async (workspaceId: string, channelData: Omit<CreateChannelData, 'workspaceId'>): Promise<Channel> => {
  const response = await axiosInstance.post(apiRoutes.channels.create(workspaceId), channelData);
  return response.data;
};

// Update a channel
export const updateChannel = async (workspaceId: string, channelId: string, updateData: UpdateChannelData): Promise<Channel> => {
  const response = await axiosInstance.put(apiRoutes.channels.update(workspaceId, channelId), updateData);
  return response.data;
};

// Delete a channel
export const deleteChannel = async (workspaceId: string, channelId: string): Promise<void> => {
  await axiosInstance.delete(apiRoutes.channels.delete(workspaceId, channelId));
};

// Join a channel
export const joinChannel = async (workspaceId: string, channelId: string): Promise<void> => {
  await axiosInstance.post(apiRoutes.channels.addMember(workspaceId, channelId));
};

// Leave a channel
export const leaveChannel = async (workspaceId: string, channelId: string): Promise<void> => {
  await axiosInstance.post(apiRoutes.channels.leaveChannel(workspaceId, channelId));
};

// Get channel members
export const getChannelMembers = async (workspaceId: string, channelId: string): Promise<Channel['members']> => {
  const response = await axiosInstance.get(apiRoutes.channels.getMembers(workspaceId, channelId));
  return response.data;
};

// Add member to channel
export const addChannelMember = async (workspaceId: string, channelId: string, userId: string): Promise<void> => {
  await axiosInstance.post(apiRoutes.channels.addMember(workspaceId, channelId), { userId });
};

// Remove member from channel
export const removeChannelMember = async (workspaceId: string, channelId: string, userId: string): Promise<void> => {
  await axiosInstance.delete(apiRoutes.channels.removeMember(workspaceId, channelId, userId));
};
