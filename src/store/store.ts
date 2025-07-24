import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "../features/auth/authSlice";
import workspaceReducer from "../features/workspace/workspaceSlice";
import callReducer from "../features/call/callSlice";
import chatReducer from "../features/chat/chatSlice";
import fileReducer from "../features/files/fileSlice";
import profileReducer from "../features/profile/profileSlice";
import { allMiddleware } from "./middleware";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workspace: workspaceReducer,
    call: callReducer,
    chat: chatReducer,
    files: fileReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST', 
          'persist/REHYDRATE',
          'files/uploadFile/pending',
          'files/uploadFile/fulfilled',
          'files/downloadFile/fulfilled'
        ],
        ignoredPaths: [
          'register',
          'files.uploadProgress',
          'auth.user.avatar'
        ],
      },
    }).concat(allMiddleware),
  devTools: process.env.NODE_ENV !== 'production' && {
    name: 'Worksy App',
    trace: true,
    traceLimit: 25,
  },
});

// Enable listener behavior for refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Selectors للوصول السريع للبيانات المهمة
export const selectAuth = (state: RootState) => state.auth;
export const selectProfile = (state: RootState) => state.profile;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectWorkspaces = (state: RootState) => state.workspace.workspaces;
export const selectCurrentWorkspace = (state: RootState) => state.workspace.currentWorkspace;
export const selectActiveChat = (state: RootState) => state.chat.activeChat;
export const selectCurrentChannel = (state: RootState) => state.chat.currentChannel;
export const selectFiles = (state: RootState) => state.files.files;
