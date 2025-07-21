// src/hooks/useAuth/useAuth.ts
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

export function useAuth() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user); // لو عندك user
  return { isAuthenticated, user };
}
