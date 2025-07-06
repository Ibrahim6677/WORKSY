import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import AuthRoutes from "./AuthRoutes";
import WorkspaceRoutes from "./WorkspaceRoutes";

const router = createBrowserRouter([
  PublicRoutes,
  AuthRoutes,
  WorkspaceRoutes,
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
