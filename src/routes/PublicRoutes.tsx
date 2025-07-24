import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import LoadingPage from "../pages/loadingPage";
import type { RouteObject } from "react-router-dom";

const PublicLayout = lazy(() => import("../layouts/PublicLayout/PublicLayout"));
const HomePage = lazy(() => import("../pages/public/HomePage"));
const Banner = lazy(() => import("../pages/public/Banner"));
const Collaboration = lazy(() => import("../pages/public/Collaboration"));
const IntuitiveWay = lazy(() => import("../pages/public/IntuitiveWay"));
const SwiperTestimonials = lazy(() => import("../pages/public/SwiperTestimonials"));

const PublicRoutes: RouteObject = {
  element: <Suspense fallback={<LoadingPage />}><PublicLayout /></Suspense>,
  children: [
    { path: "/", element: <Suspense fallback={<LoadingPage />}><HomePage /></Suspense> },
    { path: "/home", element: <Navigate to="/" replace /> }, // Redirect /home to /
    { path: "/landing", element: <Suspense fallback={<LoadingPage />}><Banner /></Suspense> },
    { path: "/collaboration", element: <Suspense fallback={<LoadingPage />}><Collaboration /></Suspense> },
    { path: "/features", element: <Suspense fallback={<LoadingPage />}><IntuitiveWay /></Suspense> },
    { path: "/testimonials", element: <Suspense fallback={<LoadingPage />}><SwiperTestimonials /></Suspense> },
    
    // Legacy routes (redirects)
    { path: "/banner", element: <Navigate to="/landing" replace /> },
    { path: "/intuitive-way", element: <Navigate to="/features" replace /> },
  ],
};

export default PublicRoutes;
