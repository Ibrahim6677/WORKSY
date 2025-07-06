// import ProtectedRoute from "./ProtectedRoute";
import WorkspaceLayout from "../layouts/WorkspaceLayout/WorkspaceLayout";
import WorkspaceHome from "../pages/workspace/WorkspaceHome";
import CreateWorkspace from "../pages/workspace/createworkspace/CreateWorkspace";
import FileDetails from "../components/organisms/File/FileDetails";
import CalenderPage from "../pages/calendar/CalendarPage";
import SettingsLayout from "../layouts/SettingsLayout/SettingsLayout";
import Profile from "../pages/settings/Profile";
import type { RouteObject } from "react-router-dom";
import ChannelsPage from "../pages/channels/ChannelsPage";
import ChannelsLayout from "../layouts/WorkspaceLayout/ChannelsLayout";
import Notification from "../pages/settings/Notification";
import Privacy from "../pages/settings/Privacy";
import ChatLayout from "../layouts/ChatLayout/ChatLayout";
import CallPage from "../pages/call/CallPage";

const WorkspaceRoutes: RouteObject = {
  // element: <ProtectedRoute />,
  children: [
    { path: "/workspace", element: <WorkspaceHome /> },
    { path: "/create-workspace", element: <CreateWorkspace /> },
    {
      path: "/workspace",
      element: <WorkspaceLayout />,
      children: [
        { path: "files", element: <FileDetails /> },
        { path: "calendar", element: <CalenderPage /> },
        { path: "channels", element: <ChannelsPage /> },
        {
          path: "channels",
          element: <ChannelsLayout />,
          children: [
            { path: "chat", element: <ChatLayout /> },
            { path: "call", element: <CallPage /> }
          ]
        },
        {
          path: "settings",
          element: <SettingsLayout />,
          children: [
            { index: true, element: <Profile /> },
            { path: "profile", element: <Profile /> },
            { path: "notifications", element: <Notification /> },
            { path: "privacy", element: <Privacy /> },
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
