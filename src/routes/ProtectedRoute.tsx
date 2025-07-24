import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import React, { Suspense } from "react";
import LoadingPage from "../pages/loadingPage";
import type { RootState } from "../store/store";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = "/login",
  requireAuth = true 
}) => {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  // If you want to show a loading page, you need to get 'isLoading' from somewhere else or remove this block.
  // For now, removing the loading check since 'isLoading' does not exist.

  // Check authentication requirement
  const isAuthenticated = !!user;

  if (requireAuth && !isAuthenticated) {
    // Save the attempted location for redirect after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    // If user is already authenticated and trying to access auth pages
    return <Navigate to="/workspace" replace />;
  }

  return (
    <Suspense fallback={<LoadingPage />}>
      {children ? children : <Outlet />}
    </Suspense>
  );
};

export default ProtectedRoute;
