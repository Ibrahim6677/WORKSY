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
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  workspaceMembers: WorkspaceMember[];
  loading: boolean;
  error: string | null;
}

const initialState: WorkspaceState = {
  workspaces: [],
  currentWorkspace: null,
  workspaceMembers: [],
  loading: false,
  error: null
};

// Async thunks
export const fetchWorkspaces = createAsyncThunk(
  'workspace/fetchWorkspaces',
  async (_, { rejectWithValue }) => {
    try {
      const workspaces = await getWorkspaces();
      return workspaces;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch workspaces');
    }
  }
);

export const fetchWorkspaceById = createAsyncThunk(
  'workspace/fetchWorkspaceById',
  async (id: string, { rejectWithValue }) => {
    try {
      const workspace = await getWorkspaceById(id);
      return workspace;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch workspace');
    }
  }
);

export const createWorkspaceAsync = createAsyncThunk(
  'workspace/createWorkspace',
  async (payload: CreateWorkspacePayload, { rejectWithValue }) => {
    try {
      const workspace = await createWorkspace(payload);
      return workspace;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create workspace');
    }
  }
);

export const updateWorkspaceAsync = createAsyncThunk(
  'workspace/updateWorkspace',
  async ({ id, payload }: { id: string; payload: UpdateWorkspacePayload }, { rejectWithValue }) => {
    try {
      const workspace = await updateWorkspace(id, payload);
      return workspace;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update workspace');
    }
  }
);

export const deleteWorkspaceAsync = createAsyncThunk(
  'workspace/deleteWorkspace',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteWorkspace(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete workspace');
    }
  }
);

export const fetchWorkspaceMembers = createAsyncThunk(
  'workspace/fetchWorkspaceMembers',
  async (workspaceId: string, { rejectWithValue }) => {
    try {
      const members = await getWorkspaceMembers(workspaceId);
      return members;
    } catch (error: any) {
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
      await changeMemberRole(workspaceId, memberId, newRole);
      return { memberId, newRole };
    } catch (error: any) {
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
      await removeMember(workspaceId, memberId);
      return memberId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove member');
    }
  }
);

export const leaveWorkspaceAsync = createAsyncThunk(
  'workspace/leaveWorkspace',
  async (workspaceId: string, { rejectWithValue }) => {
    try {
      await leaveWorkspace(workspaceId);
      return workspaceId;
    } catch (error: any) {
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
      await transferOwnership(workspaceId, newOwnerId);
      return { workspaceId, newOwnerId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to transfer ownership');
    }
  }
);

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setWorkspaces: (state, action: PayloadAction<Workspace[]>) => {
      state.workspaces = action.payload;
    },
    setCurrentWorkspace: (state, action: PayloadAction<Workspace | null>) => {
      state.currentWorkspace = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetWorkspaceState: (state) => {
      state.workspaces = [];
      state.currentWorkspace = null;
      state.workspaceMembers = [];
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch workspaces
    builder
      .addCase(fetchWorkspaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaces = action.payload;
      })
      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch workspace by ID
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

      // Create workspace
      .addCase(createWorkspaceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWorkspaceAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaces.push(action.payload);
      })
      .addCase(createWorkspaceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update workspace
      .addCase(updateWorkspaceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWorkspaceAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.workspaces.findIndex(w => w.id === action.payload.id);
        if (index !== -1) {
          state.workspaces[index] = action.payload;
        }
        if (state.currentWorkspace?.id === action.payload.id) {
          state.currentWorkspace = action.payload;
        }
      })
      .addCase(updateWorkspaceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete workspace
      .addCase(deleteWorkspaceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWorkspaceAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaces = state.workspaces.filter(w => w.id !== action.payload);
        if (state.currentWorkspace?.id === action.payload) {
          state.currentWorkspace = null;
        }
      })
      .addCase(deleteWorkspaceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch workspace members
      .addCase(fetchWorkspaceMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkspaceMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaceMembers = action.payload;
      })
      .addCase(fetchWorkspaceMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Change member role
      .addCase(changeMemberRoleAsync.fulfilled, (state, action) => {
        const { memberId, newRole } = action.payload;
        const member = state.workspaceMembers.find(m => m.id === memberId);
        if (member) {
          member.role = newRole;
        }
      })

      // Remove member
      .addCase(removeMemberAsync.fulfilled, (state, action) => {
        state.workspaceMembers = state.workspaceMembers.filter(m => m.id !== action.payload);
      })

      // Leave workspace
      .addCase(leaveWorkspaceAsync.fulfilled, (state, action) => {
        state.workspaces = state.workspaces.filter(w => w.id !== action.payload);
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
