import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import React, { Suspense, lazy } from "react";
import LoadingPage from "../pages/loadingPage";

export default function ProtectedRoute() {
  const currentUser = useSelector((state: any) => state.auth.currentUser);
  return (
    <Suspense fallback={<LoadingPage />}>
      {currentUser ? <Outlet /> : <Navigate to="/login" />}
    </Suspense>
  );
}
