import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getUserProfile, updateUserProfile, uploadProfileAvatar, deleteProfileAvatar } from '../../services/api/profile/profileApi';
import type { UserProfile, UpdateProfileData } from '../../services/api/profile/profileApi';

interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  uploading: boolean;
  error: string | null;
  updateSuccess: boolean;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  uploading: false,
  error: null,
  updateSuccess: false,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const profile = await getUserProfile();
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData: UpdateProfileData, { rejectWithValue }) => {
    try {
      const updatedProfile = await updateUserProfile(profileData);
      return updatedProfile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  'profile/uploadAvatar',
  async (file: File, { rejectWithValue }) => {
    try {
      const result = await uploadProfileAvatar(file);
      return result.avatarUrl;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload avatar');
    }
  }
);

export const deleteAvatar = createAsyncThunk(
  'profile/deleteAvatar',
  async (_, { rejectWithValue }) => {
    try {
      await deleteProfileAvatar();
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete avatar');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },
    resetProfileState: (state) => {
      state.profile = null;
      state.loading = false;
      state.uploading = false;
      state.error = null;
      state.updateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch user profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // Update profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
        state.updateSuccess = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.updateSuccess = false;
      })

    // Upload avatar
    builder
      .addCase(uploadAvatar.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadAvatar.fulfilled, (state, action: PayloadAction<string>) => {
        state.uploading = false;
        if (state.profile) {
          state.profile.avatar = action.payload;
        }
        state.error = null;
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload as string;
      })

    // Delete avatar
    builder
      .addCase(deleteAvatar.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(deleteAvatar.fulfilled, (state) => {
        state.uploading = false;
        if (state.profile) {
          state.profile.avatar = undefined;
        }
        state.error = null;
      })
      .addCase(deleteAvatar.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearUpdateSuccess, resetProfileState } = profileSlice.actions;

export default profileSlice.reducer;
