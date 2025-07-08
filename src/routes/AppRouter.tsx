import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import AuthRoutes from "./AuthRoutes";
import WorkspaceRoutes from "./WorkspaceRoutes";
import React, { Suspense, lazy } from "react";
import LoadingPage from "../pages/loadingPage";

const router = createBrowserRouter([
  PublicRoutes,
  AuthRoutes,
  WorkspaceRoutes,
]);

export default function AppRouter() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
