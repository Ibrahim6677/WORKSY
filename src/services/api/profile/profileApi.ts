import axiosInstance from '../axiosInstance';
import { apiRoutes } from '../../../utils/constants/apiRoutes';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  jobTitle: string;
  status: string;
  timeZone: string;
  phoneNumber: string;
  location: string;
  avatar?: string;
  isOnline?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileData {
  fullName?: string;
  jobTitle?: string;
  status?: string;
  timeZone?: string;
  phoneNumber?: string;
  location?: string;
}

// Get current user profile
export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await axiosInstance.get(apiRoutes.profile.getUserProfile);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (profileData: UpdateProfileData): Promise<UserProfile> => {
  try {
    const response = await axiosInstance.put(apiRoutes.profile.updateProfile, profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Upload profile avatar
export const uploadProfileAvatar = async (file: File): Promise<{ avatarUrl: string }> => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await axiosInstance.post(apiRoutes.profile.uploadAvatar, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
};

// Delete profile avatar
export const deleteProfileAvatar = async (): Promise<void> => {
  try {
    await axiosInstance.delete(apiRoutes.profile.deleteAvatar);
  } catch (error) {
    console.error('Error deleting avatar:', error);
    throw error;
  }
};
