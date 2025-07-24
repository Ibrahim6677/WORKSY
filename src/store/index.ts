// Re-export everything from store
export * from './store';
export { store as default } from './store';

// Export commonly used hooks for TypeScript
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom hooks for common selectors
export const useAuth = () => useAppSelector(state => state.auth);
export const useCurrentUser = () => useAppSelector(state => state.auth.user);
export const useIsAuthenticated = () => useAppSelector(state => state.auth.isAuthenticated);
export const useWorkspaces = () => useAppSelector(state => state.workspace.workspaces);
export const useCurrentWorkspace = () => useAppSelector(state => state.workspace.currentWorkspace);
export const useFiles = () => useAppSelector(state => state.files.files);
export const useChat = () => useAppSelector(state => state.chat);
export const useActiveChat = () => useAppSelector(state => state.chat.activeChat);
