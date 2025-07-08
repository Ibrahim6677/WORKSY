import React, { Suspense, lazy } from "react";
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
    { path: "banner", element: <Suspense fallback={<LoadingPage />}><Banner /></Suspense> },
    { path: "collaboration", element: <Suspense fallback={<LoadingPage />}><Collaboration /></Suspense> },
    { path: "intuitive-way", element: <Suspense fallback={<LoadingPage />}><IntuitiveWay /></Suspense> },
    { path: "testimonials", element: <Suspense fallback={<LoadingPage />}><SwiperTestimonials /></Suspense> },
  ],
};

export default PublicRoutes;
