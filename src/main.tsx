import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppRouter from "./routes/AppRouter";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { setAuthData } from "./features/auth/authSlice";
import axiosInstance from "./services/api/axiosInstance";
import "./index.css";

// ✅ استعادة auth state من localStorage (بسيط جداً)
const token = localStorage.getItem("accessToken");
const user = localStorage.getItem("user");

if (token && user) {
  try {
    const userData = JSON.parse(user);

    // ✅ استعادة الـ state في Redux
    store.dispatch(
      setAuthData({
        user: userData,
        accessToken: token,
        refreshToken: localStorage.getItem("refreshToken"),
        isAuthenticated: true,
      })
    );

    // ✅ تحديث axios headers
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    console.log("✅ Auth restored from localStorage");
  } catch (error) {
    console.error("❌ Invalid auth data, clearing...");
    localStorage.clear();
  }
}

const googleClientId = import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID || "";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <Provider store={store}>
        <AppRouter />
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);