import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as callApi from "../../services/api/call/callApi";

// Async Thunks
export const createCallThunk = createAsyncThunk(
  'call/createCall',
  async ({ workspaceId, callData }: { workspaceId: string; callData: callApi.CreateCallData }) => {
    return await callApi.createCall(workspaceId, callData);
  }
);

export const joinCallThunk = createAsyncThunk(
  'call/joinCall',
  async ({ workspaceId, callId, joinData }: { 
    workspaceId: string; 
    callId: string; 
    joinData?: callApi.JoinCallData 
  }) => {
    return await callApi.joinCall(workspaceId, callId, joinData);
  }
);

export const leaveCallThunk = createAsyncThunk(
  'call/leaveCall',
  async ({ workspaceId, callId }: { workspaceId: string; callId: string }) => {
    await callApi.leaveCall(workspaceId, callId);
  }
);

export const endCallThunk = createAsyncThunk(
  'call/endCall',
  async ({ workspaceId, callId }: { workspaceId: string; callId: string }) => {
    await callApi.endCall(workspaceId, callId);
  }
);

interface CallState {
  currentCall: callApi.Call | null;
  isInCall: boolean;
  isLoading: boolean;
  error: string | null;
  callMembers: callApi.CallMember[];
  callSettings: callApi.CallSettings;
}

const initialState: CallState = {
  currentCall: null,
  isInCall: false,
  isLoading: false,
  error: null,
  callMembers: [],
  callSettings: {
    audio: true,
    video: true,
    screenShare: false,
    recording: false,
  },
};

const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    startCall(state) {
      state.isInCall = true;
    },
    endCall(state) {
      state.isInCall = false;
      state.currentCall = null;
      state.callMembers = [];
    },
    updateCallSettings(state, action) {
      state.callSettings = { ...state.callSettings, ...action.payload };
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Call
      .addCase(createCallThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCallThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCall = action.payload;
        state.isInCall = true;
      })
      .addCase(createCallThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create call';
      })
      
      // Join Call
      .addCase(joinCallThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(joinCallThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCall = action.payload.call;
        state.isInCall = true;
      })
      .addCase(joinCallThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to join call';
      })
      
      // Leave Call
      .addCase(leaveCallThunk.fulfilled, (state) => {
        state.isInCall = false;
        state.currentCall = null;
        state.callMembers = [];
      })
      
      // End Call
      .addCase(endCallThunk.fulfilled, (state) => {
        state.isInCall = false;
        state.currentCall = null;
        state.callMembers = [];
      });
  },
});

export const { startCall, endCall, updateCallSettings, clearError } = callSlice.actions;

export default callSlice.reducer;