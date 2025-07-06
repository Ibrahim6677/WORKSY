import PublicLayout from "../layouts/PublicLayout/PublicLayout";
import HomePage from "../pages/public/HomePage";

const PublicRoutes = {
  element: <PublicLayout />,
  children: [
    { path: "/", element: <HomePage /> },
  ],
};

export default PublicRoutes;
