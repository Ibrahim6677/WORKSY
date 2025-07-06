import { createSlice } from "@reduxjs/toolkit";

interface CallState {
  isInCall: boolean;
  // callId: string | null;
}

const initialState: CallState = {
  isInCall: false,
  // callId: null,
};

const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    startCall(state: CallState) {
      state.isInCall = true;
    },
    endCall(state: CallState) {
      state.isInCall = false;
    }
  },
});

export const { startCall, endCall } = callSlice.actions;

export default callSlice.reducer;