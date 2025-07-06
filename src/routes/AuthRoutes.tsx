import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import ForgetPassword from "../pages/auth/ForgetPassword";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ResetPassword from "../pages/auth/ResetPassword";
import Verify from "../pages/auth/Verify";

const AuthRoutes = {
  element: <AuthLayout />,
  children: [
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/forget-password", element: <ForgetPassword /> },
    { path: "/reset-password", element: <ResetPassword /> },
    { path: "/verify", element: <Verify /> },
  ],
};

export default AuthRoutes;
