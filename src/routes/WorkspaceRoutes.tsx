// import ProtectedRoute from "./ProtectedRoute";
import { Suspense, lazy } from "react";
import LoadingPage from "../pages/loadingPage";
import type { RouteObject } from "react-router-dom";

const WorkspaceHome = lazy(() => import("../pages/workspace/WorkspaceHome"));
const CreateWorkspace = lazy(() => import("../pages/workspace/createworkspace/CreateWorkspace"));
const FileDetails = lazy(() => import("../components/organisms/File/FileDetails"));
const CalenderPage = lazy(() => import("../pages/calendar/CalendarPage"));
const SettingsLayout = lazy(() => import("../layouts/SettingsLayout/SettingsLayout"));
const Profile = lazy(() => import("../pages/settings/Profile"));
const ChannelsPage = lazy(() => import("../pages/channels/ChannelsPage"));
const ChannelsLayout = lazy(() => import("../layouts/WorkspaceLayout/ChannelsLayout"));
const Notification = lazy(() => import("../pages/settings/Notification"));
const Privacy = lazy(() => import("../pages/settings/Privacy"));
const ChatLayout = lazy(() => import("../layouts/ChatLayout/ChatLayout"));
const CallPage = lazy(() => import("../pages/call/CallPage"));
const WorkspaceLayout = lazy(() => import("../layouts/WorkspaceLayout/WorkspaceLayout"));

const WorkspaceRoutes: RouteObject = {
  // element: <ProtectedRoute />,
  children: [
    { path: "/workspace", element: <Suspense fallback={<LoadingPage />}><WorkspaceHome /></Suspense> },
    { path: "/create-workspace", element: <Suspense fallback={<LoadingPage />}><CreateWorkspace /></Suspense> },
    {
      path: "/workspace",
      element: <Suspense fallback={<LoadingPage />}><WorkspaceLayout /></Suspense>,
      children: [
        { path: "files", element: <Suspense fallback={<LoadingPage />}><FileDetails /></Suspense> },
        { path: "calendar", element: <Suspense fallback={<LoadingPage />}><CalenderPage /></Suspense> },
        { path: "channels", element: <Suspense fallback={<LoadingPage />}><ChannelsPage /></Suspense> },
        {
          path: "channels",
          element: <Suspense fallback={<LoadingPage />}><ChannelsLayout /></Suspense>,
          children: [
            { path: "chat", element: <Suspense fallback={<LoadingPage />}><ChatLayout /></Suspense> },
            { path: "call", element: <Suspense fallback={<LoadingPage />}><CallPage /></Suspense> }
          ]
        },
        {
          path: "settings",
          element: <Suspense fallback={<LoadingPage />}><SettingsLayout /></Suspense>,
          children: [
            { index: true, element: <Suspense fallback={<LoadingPage />}><Profile /></Suspense> },
            { path: "profile", element: <Suspense fallback={<LoadingPage />}><Profile /></Suspense> },
            { path: "notifications", element: <Suspense fallback={<LoadingPage />}><Notification /></Suspense> },
            { path: "privacy", element: <Suspense fallback={<LoadingPage />}><Privacy /></Suspense> },
            { path: "appearance", element: <div>appearance</div> },
            { path: "overview", element: <div>overview</div> },
            { path: "members", element: <div>members</div> },
            { path: "channels", element: <div>channels</div> },
            { path: "billing", element: <div>billing</div> },
          ],
        },
      ],
    },
  ],
};

export default WorkspaceRoutes;
