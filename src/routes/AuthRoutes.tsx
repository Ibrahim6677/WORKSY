import React, { Suspense, lazy } from "react";
import LoadingPage from "../pages/loadingPage";
import type { RouteObject } from "react-router-dom";

const AuthLayout = lazy(() => import("../layouts/AuthLayout/AuthLayout"));
const ForgetPassword = lazy(() => import("../pages/auth/ForgetPassword"));
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));
const Verify = lazy(() => import("../pages/auth/Verify"));

const AuthRoutes: RouteObject = {
  element: <Suspense fallback={<LoadingPage />}><AuthLayout /></Suspense>,
  children: [
    { path: "login", element: <Suspense fallback={<LoadingPage />}><Login /></Suspense> },
    { path: "register", element: <Suspense fallback={<LoadingPage />}><Register /></Suspense> },
    { path: "forget-password", element: <Suspense fallback={<LoadingPage />}><ForgetPassword /></Suspense> },
    { path: "reset-password", element: <Suspense fallback={<LoadingPage />}><ResetPassword /></Suspense> },
    { path: "verify", element: <Suspense fallback={<LoadingPage />}><Verify /></Suspense> },
  ],
};

export default AuthRoutes;
