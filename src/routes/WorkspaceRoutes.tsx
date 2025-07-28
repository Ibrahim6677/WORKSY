// import ProtectedRoute from "./ProtectedRoute";
import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import LoadingPage from "../pages/loadingPage";
import type { RouteObject } from "react-router-dom";
import DirectMessagesPage from "@/pages/messages/DirectMessagesPage";
import ProtectedRoute from "./ProtectedRoute";

const WorkspaceHome = lazy(() => import("../pages/workspace/WorkspaceHome"));
const CreateWorkspace = lazy(() => import("../pages/workspace/createworkspace/CreateWorkspace"));
const FilesPage = lazy(() => import("../pages/files/FilesPage"));
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
    // Workspace home/selection page
    { path: "/workspace", element: <Suspense fallback={<LoadingPage />}><WorkspaceHome /></Suspense> },
    
    // Create workspace page (outside of workspace layout)
    { path: "/workspace/create", element: <Suspense fallback={<LoadingPage />}><CreateWorkspace /></Suspense> },
    
    // Individual workspace routes with workspace ID
    {
      path: "/workspace/:workspaceId",
      element: <Suspense fallback={<LoadingPage />}><WorkspaceLayout /></Suspense>,
      children: [
        // Default redirect to channels
        { index: true, element: <Navigate to="channels" replace /> },
        
        // Files management
        { path: "files", element: <Suspense fallback={<LoadingPage />}><FilesPage /></Suspense> },
        { path: "files/:fileId", element: <Suspense fallback={<LoadingPage />}><FileDetails /></Suspense> },
        
        // Calendar integration
        { path: "calendar", element: <Suspense fallback={<LoadingPage />}><CalenderPage /></Suspense> },
        
        // Direct messages
        { path: "dms", element: <Suspense fallback={<LoadingPage />}><DirectMessagesPage /></Suspense> },
                // Direct messages
        { path: "dms/:conversationId", element: <Suspense fallback={<LoadingPage />}><DirectMessagesPage /></Suspense> },
        
        // DM calls (private calls between two users)
        { path: "dms/:conversationId/call", element: <Suspense fallback={<LoadingPage />}><CallPage /></Suspense> },
        
        // Channels with proper structure
        
        // Channels with proper structure
        {
          path: "channels",
          element: <Suspense fallback={<LoadingPage />}><ChannelsLayout /></Suspense>,
          children: [
            { index: true, element: <Suspense fallback={<LoadingPage />}><ChannelsPage /></Suspense> },
            { path: ":channelId", element: <Suspense fallback={<LoadingPage />}><ChatLayout /></Suspense> },
            { path: ":channelId/call", element: <Suspense fallback={<LoadingPage />}><CallPage /></Suspense> }
          ]
        },
        
        // Workspace settings
        {
          path: "settings",
          element: <Suspense fallback={<LoadingPage />}><SettingsLayout /></Suspense>,
          children: [
            { index: true, element: <Navigate to="profile" replace /> },
            { path: "profile", element: <Suspense fallback={<LoadingPage />}><Profile /></Suspense> },
            { path: "notifications", element: <Suspense fallback={<LoadingPage />}><Notification /></Suspense> },
            { path: "privacy", element: <Suspense fallback={<LoadingPage />}><Privacy /></Suspense> },
            { path: "appearance", element: <div>Appearance Settings</div> },
            { path: "overview", element: <div>Workspace Overview</div> },
            { path: "members", element: <div>Workspace Members</div> },
            { path: "channels", element: <div>Channel Management</div> },
            { path: "billing", element: <div>Billing & Subscription</div> },
          ],
        },
      ],
    },
  ],
};

export default WorkspaceRoutes;
