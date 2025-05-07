import { login, logout, checkAuthStatus } from "./auth";

export type AdminInfoType = {
  adminid: string;
  adminname: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

// 导出认证相关函数
export const adminLoginService = login;
export const adminLogoutService = logout;
export const checkAdminAuthStatus = checkAuthStatus;
