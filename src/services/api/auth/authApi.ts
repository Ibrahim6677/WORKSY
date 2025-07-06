import axiosInstance from "../axiosInstance";
import { apiRoutes } from "../../../utils/constants/apiRoutes";

export const login = async (data: { email: string; password: string }) => {
  const res = await axiosInstance.post(apiRoutes.auth.login, data);
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
