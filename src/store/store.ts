import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from "../features/auth/authSlice";
import workspaceReducer from "../features/workspace/workspaceSlice";
import callReducer from "../features/call/callSlice";
import chatReducer from "../features/chat/chatSlice";
import fileReducer from "../features/files/fileSlice";
import channelReducer from "../features/channel/channelSlice";
import profileReducer from "../features/profile/profileSlice";
import { allMiddleware } from "./middleware";

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // ✅ حفظ auth state
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    workspace: workspaceReducer,
    call: callReducer,
    chat: chatReducer,
    files: fileReducer,
    profile: profileReducer,
    channel: channelReducer,
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

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const selectAuth = (state: RootState) => state.auth;
export const selectProfile = (state: RootState) => state.profile;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectWorkspaces = (state: RootState) => state.workspace.workspaces;
export const selectCurrentWorkspace = (state: RootState) => state.workspace.currentWorkspace;
export const selectActiveChat = (state: RootState) => state.chat.activeChat;
export const selectCurrentChannel = (state: RootState) => state.chat.currentChannel;
export const selectFiles = (state: RootState) => state.files.files;