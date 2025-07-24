import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import AuthRoutes from "./AuthRoutes";
import WorkspaceRoutes from "./WorkspaceRoutes";
import { Suspense, lazy } from "react";
import LoadingPage from "../pages/loadingPage";

// Lazy load Socket test page
const SocketTestPage = lazy(() => import("../pages/test/SocketTestPage"));
// Lazy load Accept Invite page
const AcceptInvite = lazy(() => import("../pages/invite/AcceptInvite"));
// Lazy load 404 page
const NotFoundPage = lazy(() => import("../pages/public/NotFoundPage"));

const router = createBrowserRouter([
  PublicRoutes,
  AuthRoutes,
  WorkspaceRoutes,
  // Socket test route (development only)
  {
    path: "/socket-test/*",
    element: <SocketTestPage />,
  },
  // Invite acceptance route
  {
    path: "/invite/accept/:token",
    element: <Suspense fallback={<LoadingPage />}><AcceptInvite /></Suspense>,
  },
  // 404 catch-all route
  {
    path: "*",
    element: <Suspense fallback={<LoadingPage />}><NotFoundPage /></Suspense>,
  },
]);

export default function AppRouter() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
