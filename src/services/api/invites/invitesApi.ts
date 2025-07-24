import axiosInstance from '../axiosInstance';
import { apiRoutes } from '../../../utils/constants/apiRoutes';

export interface InviteData {
  email: string;
  role?: 'admin' | 'member';
}

export interface CreateInvitePayload {
  emails: string[];
  role?: 'admin' | 'member';
}

export interface InviteResponse {
  id: string;
  email: string;
  role: string;
  token: string;
  workspaceId: string;
  inviteLink: string;
  expiresAt: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'expired';
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Create invites for workspace
export const createWorkspaceInvites = async (
  workspaceId: string,
  payload: CreateInvitePayload
): Promise<InviteResponse[]> => {
  const response = await axiosInstance.post<ApiResponse<InviteResponse[]>>(
    apiRoutes.invites.create(workspaceId),
    payload
  );
  return response.data.data;
};

// Accept invite by token
export const acceptInvite = async (token: string): Promise<void> => {
  await axiosInstance.post(apiRoutes.invites.accept(token));
};

// Generate shareable invite link for workspace
export const generateWorkspaceInviteLink = async (
  workspaceId: string,
  role: 'admin' | 'member' = 'member'
): Promise<string> => {
  const response = await axiosInstance.post<ApiResponse<{ inviteLink: string }>>(
    apiRoutes.invites.generateLink(workspaceId),
    { role }
  );
  return response.data.data.inviteLink;
};

// Get workspace invites (for admin)
export const getWorkspaceInvites = async (workspaceId: string): Promise<InviteResponse[]> => {
  const response = await axiosInstance.get<ApiResponse<InviteResponse[]>>(
    apiRoutes.invites.getAll(workspaceId)
  );
  return response.data.data;
};

// Cancel invite
export const cancelInvite = async (workspaceId: string, inviteId: string): Promise<void> => {
  await axiosInstance.delete(apiRoutes.invites.cancel(workspaceId, inviteId));
};

// Resend invite
export const resendInvite = async (workspaceId: string, inviteId: string): Promise<void> => {
  await axiosInstance.post(apiRoutes.invites.resend(workspaceId, inviteId));
};
