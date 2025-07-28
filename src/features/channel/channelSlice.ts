// src/features/channels/channelsSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Channel {
  id: string;
  name: string;
  description: string;
  memberCount: number;
}

interface ChannelsState {
  channels: Channel[];
  loading: boolean;
  error: string | null;
}

// ✅ Initial state مع default values
const initialState: ChannelsState = {
  channels: [], // ✅ مش null أو undefined
  loading: false,
  error: null,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannels: (state, action: PayloadAction<Channel[]>) => {
      // ✅ تأكد إن الـ payload array
      state.channels = Array.isArray(action.payload) ? action.payload : [];
    },
    addChannel: (state, action: PayloadAction<Channel>) => {
      if (Array.isArray(state.channels)) {
        state.channels.push(action.payload);
      } else {
        state.channels = [action.payload];
      }
    },
    clearChannels: (state) => {
      state.channels = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setChannels, addChannel, clearChannels, setLoading, setError } = channelsSlice.actions;
export default channelsSlice.reducer;