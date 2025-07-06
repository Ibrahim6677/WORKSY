import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import callReducer from "../features/call/callSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    call: callReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
