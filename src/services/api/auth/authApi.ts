import axiosInstance from "../axiosInstance";
import { apiRoutes } from "../../../utils/constants/apiRoutes";

export const login = async (data: { email: string; password: string }) => {
  const res = await axiosInstance.post(apiRoutes.auth.login, data);
  return res.data;
};

export const completeLogin = async (data: { email: string; sessionToken: string; otp: string }) => {
  const res = await axiosInstance.post(apiRoutes.auth.completeLogin, data);
  return res.data;
};

export const verifyOtp = async (data: { email: string; otp: string; sessionToken: string }) => {
  const res = await axiosInstance.post(apiRoutes.auth.verifyOtp, data);
  return res.data;
};

export const register = async (data: { name: string; email: string; password: string }) => {
  const res = await axiosInstance.post(apiRoutes.auth.register, data);
  return res.data;
};

/**
 * Request a password reset by email.
 * @param email - The user's email address.
 * @returns API response
 */
export const forgotPasswordRequest = async (email: string) => {
  const res = await axiosInstance.post(apiRoutes.auth.forgotPasswordRequest, { email });
  return res.data;
};

/**
 * Verify the reset PIN sent to the user's email.
 * @param data - Object containing email, pin, and resetToken
 * @returns API response
 */
export const forgotPasswordVerify = async (data: { email: string; pin: string; resetToken: string }) => {
  const res = await axiosInstance.post(apiRoutes.auth.forgotPasswordVerify, data);
  return res.data;
};

/**
 * Resend the reset PIN to the user's email.
 * @param email - The user's email address.
 * @returns API response
 */
export const resendPin = async (email: string) => {
  const res = await axiosInstance.post(apiRoutes.auth.resendPin, { email });
  return res.data;
};

export const verifyEmail = async (data: { email: string; token: string }) => {
  const res = await axiosInstance.post(apiRoutes.auth.verifyEmail, data);
  return res.data;
};

export const resendVerificationEmail = async (email: string) => {
  const res = await axiosInstance.post(apiRoutes.auth.resendVerificationEmail, { email });
  return res.data;
};

/**
 * Change the user's password (requires old password).
 * @param data - Object containing email, oldPassword, newPassword, confirmPassword
 * @returns API response
 */
export const changePassword = async (data: { email: string; oldPassword: string; newPassword: string; confirmPassword: string }) => {
  const res = await axiosInstance.patch(apiRoutes.auth.changePassword, data);
  return res.data;
};

export const requestResetPin = async (data: { email: string }) => {
  const res = await axiosInstance.post(apiRoutes.auth.forgotPasswordRequest, data);
  return res.data;
};

export const verifyResetPin = async (data: { email: string; pin: string }) => {
  const res = await axiosInstance.post(apiRoutes.auth.forgotPasswordVerify, data);
  return res.data;
};

export const resetPassword = async (data: { token: string; password: string }) => {
  const res = await axiosInstance.post(apiRoutes.auth.resetPassword, data);
  return res.data;
};

export const fetchMe = async () => {
  const res = await axiosInstance.get(apiRoutes.auth.me);
  return res.data;
};

export const logout = async () => {
  const res = await axiosInstance.post(apiRoutes.auth.logout);
  return res.data;
};

export const loginWithGoogle = async () => {
  try {
  // فتح نافذة جديدة لمصادقة جوجل
  const width = 500;
  const height = 600;
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;
  const authWindow = window.open(
    apiRoutes.auth.loginWithGoogle,
    "GoogleLogin",
    `width=${width},height=${height},top=${top},left=${left}`
  );
  // هنا يمكنك الاستماع لرسالة من السيرفر بعد نجاح المصادقة
  // أو استخدام polling/check إذا كان backend يرسل التوكن عبر window.postMessage أو redirect
  } catch (error) {
    console.error("Google login error:", error);
    // أظهر رسالة للمستخدم أو تعامل مع الخطأ
  }
};
