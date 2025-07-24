import axiosInstance from '../axiosInstance';
import { apiRoutes } from '../../../utils/constants/apiRoutes';

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  image?: string;
  slug?: string;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  owner?: {
    id: string;
    name: string;
  };
  role?: string;
}

export interface CreateWorkspacePayload {
  name: string;
  description?: string;
  image?: string;
}

export interface UpdateWorkspacePayload {
  name?: string;
  description?: string;
  image?: string;
}

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Get all workspaces
export const getWorkspaces = async (): Promise<Workspace[]> => {
  const response = await axiosInstance.get<ApiResponse<Workspace[]>>(apiRoutes.workspaces.getAll);
  return response.data.data;
};

// Get a single workspace by ID
export const getWorkspaceById = async (id: string): Promise<Workspace> => {
  const response = await axiosInstance.get<ApiResponse<Workspace>>(apiRoutes.workspaces.getById(id));
  return response.data.data;
};

// Create a new workspace
export const createWorkspace = async (
  payload: CreateWorkspacePayload
): Promise<Workspace> => {
  const response = await axiosInstance.post<ApiResponse<{ workspace: Workspace }>>(
    apiRoutes.workspaces.create,
    payload
  );
  return response.data.data.workspace;
};

// Update an existing workspace
export const updateWorkspace = async (
  id: string,
  payload: UpdateWorkspacePayload
): Promise<Workspace> => {
  const response = await axiosInstance.patch<ApiResponse<{ workspace: Workspace }>>(
    apiRoutes.workspaces.update(id),
    payload
  );
  return response.data.data.workspace;
};

// Delete a workspace
export const deleteWorkspace = async (id: string): Promise<void> => {
  await axiosInstance.delete(apiRoutes.workspaces.delete(id));
};

// Get workspace members
export const getWorkspaceMembers = async (workspaceId: string): Promise<WorkspaceMember[]> => {
  const response = await axiosInstance.get<ApiResponse<WorkspaceMember[]>>(
    apiRoutes.workspaces.getAllMembers(workspaceId)
  );
  return response.data.data;
};

// Change member role
export const changeMemberRole = async (
  workspaceId: string,
  memberId: string,
  newRole: string
): Promise<void> => {
  await axiosInstance.patch(apiRoutes.workspaces.changeMemberRole(workspaceId, memberId), {
    newRole
  });
};

// Remove member
export const removeMember = async (workspaceId: string, memberId: string): Promise<void> => {
  await axiosInstance.delete(apiRoutes.workspaces.removeMember(workspaceId, memberId));
};

// Leave workspace
export const leaveWorkspace = async (workspaceId: string): Promise<void> => {
  await axiosInstance.delete(apiRoutes.workspaces.leaveWorkspace(workspaceId));
};

// Transfer ownership
export const transferOwnership = async (
  workspaceId: string,
  newOwnerId: string
): Promise<void> => {
  await axiosInstance.patch(apiRoutes.workspaces.transferOwnership(workspaceId), {
    newOwnerId
  });
};