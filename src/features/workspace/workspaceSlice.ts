import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  getWorkspaces,
  getWorkspaceById,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  getWorkspaceMembers,
  changeMemberRole,
  removeMember,
  leaveWorkspace,
  transferOwnership
} from "../../services/api/workspace/workspaceApi";
import type {
  Workspace,
  CreateWorkspacePayload,
  UpdateWorkspacePayload,
  WorkspaceMember
} from "../../services/api/workspace/workspaceApi";

interface WorkspaceState {
  workspaces: Workspace[]; // ✅ يجب أن يكون array دائماً
  currentWorkspace: Workspace | null;
  workspaceMembers: WorkspaceMember[]; // ✅ يجب أن يكون array دائماً
  loading: boolean;
  error: string | null;
}

// ✅ Initial state محمي من undefined
const initialState: WorkspaceState = {
  workspaces: [], // ✅ default empty array
  currentWorkspace: null,
  workspaceMembers: [], // ✅ default empty array
  loading: false,
  error: null
};

// ✅ Async thunks محسنة مع error handling أفضل
export const fetchWorkspaces = createAsyncThunk(
  'workspace/fetchWorkspaces',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🚀 Fetching workspaces from API...');
      const response = await getWorkspaces();
      
      // ✅ تحقق من structure الـ response
      console.log('📦 API Response:', response);
      
      // ✅ استخراج البيانات من الـ response
      let workspacesData = response;
      
      // إذا كانت البيانات فيresponse.data
      if (response && typeof response === 'object' && 'data' in response) {
        workspacesData = response.data as Workspace[];
      }
      
      // إذا كانت البيانات في response.workspaces
      if (response && typeof response === 'object' && 'workspaces' in response) {
        const workspaces = (response as { workspaces: unknown }).workspaces;
        workspacesData = Array.isArray(workspaces) ? workspaces as Workspace[] : [];
      }
      
      // ✅ تأكد من أن البيانات array
      if (!Array.isArray(workspacesData)) {
        console.warn('⚠️ Workspaces data is not an array:', workspacesData);
        return []; // إرجاع empty array بدلاً من undefined
      }
      
      console.log('✅ Workspaces fetched successfully:', workspacesData.length, 'workspaces');
      return workspacesData;
    } catch (error: any) {
      console.error('❌ Failed to fetch workspaces:', error);
      
      // ✅ تحسين error message
      let errorMessage = 'Failed to fetch workspaces';
      
      if (error.response?.status === 401) {
        errorMessage = 'Authentication required. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied. You do not have permission to view workspaces.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchWorkspaceById = createAsyncThunk(
  'workspace/fetchWorkspaceById',
  async (id: string, { rejectWithValue }) => {
    try {
      console.log('🚀 Fetching workspace by ID:', id);
      const workspace = await getWorkspaceById(id);
      console.log('✅ Workspace fetched successfully:', workspace);
      return workspace;
    } catch (error: any) {
      console.error('❌ Failed to fetch workspace:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch workspace');
    }
  }
);

export const createWorkspaceAsync = createAsyncThunk(
  'workspace/createWorkspace',
  async (payload: CreateWorkspacePayload, { rejectWithValue }) => {
    try {
      console.log('🚀 Creating workspace:', payload);
      const workspace = await createWorkspace(payload);
      console.log('✅ Workspace created successfully:', workspace);
      return workspace;
    } catch (error: any) {
      console.error('❌ Failed to create workspace:', error);
      
      let errorMessage = 'Failed to create workspace';
      if (error.response?.status === 400) {
        errorMessage = 'Invalid workspace data. Please check your inputs.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateWorkspaceAsync = createAsyncThunk(
  'workspace/updateWorkspace',
  async ({ id, payload }: { id: string; payload: UpdateWorkspacePayload }, { rejectWithValue }) => {
    try {
      console.log('🚀 Updating workspace:', id, payload);
      const workspace = await updateWorkspace(id, payload);
      console.log('✅ Workspace updated successfully:', workspace);
      return workspace;
    } catch (error: any) {
      console.error('❌ Failed to update workspace:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to update workspace');
    }
  }
);

export const deleteWorkspaceAsync = createAsyncThunk(
  'workspace/deleteWorkspace',
  async (id: string, { rejectWithValue }) => {
    try {
      console.log('🚀 Deleting workspace:', id);
      await deleteWorkspace(id);
      console.log('✅ Workspace deleted successfully');
      return id;
    } catch (error: any) {
      console.error('❌ Failed to delete workspace:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete workspace');
    }
  }
);

export const fetchWorkspaceMembers = createAsyncThunk(
  'workspace/fetchWorkspaceMembers',
  async (workspaceId: string, { rejectWithValue }) => {
    try {
      console.log('🚀 Fetching workspace members:', workspaceId);
      const members = await getWorkspaceMembers(workspaceId);
      
      // ✅ تأكد من أن members array
      const membersArray = Array.isArray(members) ? members : [];
      console.log('✅ Workspace members fetched successfully:', membersArray.length, 'members');
      return membersArray;
    } catch (error: any) {
      console.error('❌ Failed to fetch workspace members:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch workspace members');
    }
  }
);

export const changeMemberRoleAsync = createAsyncThunk(
  'workspace/changeMemberRole',
  async (
    { workspaceId, memberId, newRole }: { workspaceId: string; memberId: string; newRole: string },
    { rejectWithValue }
  ) => {
    try {
      console.log('🚀 Changing member role:', { workspaceId, memberId, newRole });
      await changeMemberRole(workspaceId, memberId, newRole);
      console.log('✅ Member role changed successfully');
      return { memberId, newRole };
    } catch (error: any) {
      console.error('❌ Failed to change member role:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to change member role');
    }
  }
);

export const removeMemberAsync = createAsyncThunk(
  'workspace/removeMember',
  async (
    { workspaceId, memberId }: { workspaceId: string; memberId: string },
    { rejectWithValue }
  ) => {
    try {
      console.log('🚀 Removing member:', { workspaceId, memberId });
      await removeMember(workspaceId, memberId);
      console.log('✅ Member removed successfully');
      return memberId;
    } catch (error: any) {
      console.error('❌ Failed to remove member:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to remove member');
    }
  }
);

export const leaveWorkspaceAsync = createAsyncThunk(
  'workspace/leaveWorkspace',
  async (workspaceId: string, { rejectWithValue }) => {
    try {
      console.log('🚀 Leaving workspace:', workspaceId);
      await leaveWorkspace(workspaceId);
      console.log('✅ Left workspace successfully');
      return workspaceId;
    } catch (error: any) {
      console.error('❌ Failed to leave workspace:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to leave workspace');
    }
  }
);

export const transferOwnershipAsync = createAsyncThunk(
  'workspace/transferOwnership',
  async (
    { workspaceId, newOwnerId }: { workspaceId: string; newOwnerId: string },
    { rejectWithValue }
  ) => {
    try {
      console.log('🚀 Transferring ownership:', { workspaceId, newOwnerId });
      await transferOwnership(workspaceId, newOwnerId);
      console.log('✅ Ownership transferred successfully');
      return { workspaceId, newOwnerId };
    } catch (error: any) {
      console.error('❌ Failed to transfer ownership:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to transfer ownership');
    }
  }
);

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    // ✅ تحسين setWorkspaces مع type safety
    setWorkspaces: (state, action: PayloadAction<Workspace[]>) => {
      // ✅ تأكد من أن payload array
      state.workspaces = Array.isArray(action.payload) ? action.payload : [];
      console.log('📝 Workspaces set:', state.workspaces.length, 'workspaces');
    },
    setCurrentWorkspace: (state, action: PayloadAction<Workspace | null>) => {
      state.currentWorkspace = action.payload;
      console.log('📝 Current workspace set:', action.payload?.name || 'None');
    },
    clearError: (state) => {
      state.error = null;
      console.log('🧹 Error cleared');
    },
    resetWorkspaceState: (state) => {
      state.workspaces = [];
      state.currentWorkspace = null;
      state.workspaceMembers = [];
      state.loading = false;
      state.error = null;
      console.log('🔄 Workspace state reset');
    }
  },
  extraReducers: (builder) => {
    // ✅ Fetch workspaces
    builder
      .addCase(fetchWorkspaces.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('⏳ Fetching workspaces...');
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ تأكد من أن payload array
        state.workspaces = Array.isArray(action.payload) ? action.payload : [];
        console.log('✅ Workspaces loaded:', state.workspaces.length, 'workspaces');
      })
      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // ✅ احتفظ بـ empty array بدلاً من undefined
        state.workspaces = [];
        console.error('❌ Failed to load workspaces:', action.payload);
      })

      // ✅ Fetch workspace by ID
      .addCase(fetchWorkspaceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkspaceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWorkspace = action.payload;
      })
      .addCase(fetchWorkspaceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Create workspace
      .addCase(createWorkspaceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWorkspaceAsync.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ تأكد من وجود workspaces array
        if (Array.isArray(state.workspaces)) {
          state.workspaces.push(action.payload);
        } else {
          state.workspaces = [action.payload];
        }
      })
      .addCase(createWorkspaceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Update workspace
      .addCase(updateWorkspaceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWorkspaceAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.workspaces)) {
          const index = state.workspaces.findIndex(w => w.id === action.payload.id);
          if (index !== -1) {
            state.workspaces[index] = action.payload;
          }
        }
        if (state.currentWorkspace?.id === action.payload.id) {
          state.currentWorkspace = action.payload;
        }
      })
      .addCase(updateWorkspaceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Delete workspace
      .addCase(deleteWorkspaceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWorkspaceAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.workspaces)) {
          state.workspaces = state.workspaces.filter(w => w.id !== action.payload);
        }
        if (state.currentWorkspace?.id === action.payload) {
          state.currentWorkspace = null;
        }
      })
      .addCase(deleteWorkspaceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Fetch workspace members
      .addCase(fetchWorkspaceMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkspaceMembers.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ تأكد من أن payload array
        state.workspaceMembers = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchWorkspaceMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // ✅ احتفظ بـ empty array
        state.workspaceMembers = [];
      })

      // ✅ Change member role
      .addCase(changeMemberRoleAsync.fulfilled, (state, action) => {
        const { memberId, newRole } = action.payload;
        if (Array.isArray(state.workspaceMembers)) {
          const member = state.workspaceMembers.find(m => m.id === memberId);
          if (member) {
            member.role = newRole;
          }
        }
      })

      // ✅ Remove member
      .addCase(removeMemberAsync.fulfilled, (state, action) => {
        if (Array.isArray(state.workspaceMembers)) {
          state.workspaceMembers = state.workspaceMembers.filter(m => m.id !== action.payload);
        }
      })

      // ✅ Leave workspace
      .addCase(leaveWorkspaceAsync.fulfilled, (state, action) => {
        if (Array.isArray(state.workspaces)) {
          state.workspaces = state.workspaces.filter(w => w.id !== action.payload);
        }
        if (state.currentWorkspace?.id === action.payload) {
          state.currentWorkspace = null;
        }
      });
  }
});

export const { 
  setWorkspaces, 
  setCurrentWorkspace, 
  clearError, 
  resetWorkspaceState 
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
