import axios, { AxiosResponse, AxiosError } from "axios";

export type AdminInfoType = {
  adminid: string;
  adminname: string;
  role: string;
};

interface AuthResponse {
  isAuthenticated: boolean;
  adminInfo: AdminInfoType;
}

const authInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // 允许跨域请求携带凭证
});

// 定义错误响应数据的接口
interface ErrorResponseData {
  message?: string;
  [key: string]: unknown;
}

// 为authInstance实例添加响应拦截器：处理错误
authInstance.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError) => {
    if (error.response && error.response.data) {
      const errorData = error.response.data as ErrorResponseData;
      if (errorData.message) {
        error.message = errorData.message;
      }
    }
    return Promise.reject(error.message);
  }
);

// 登录：发送凭据并设置HttpOnly Cookie
export const adminLoginService = async (
  adminname: string,
  password: string
) => {
  try {
    const response = await authInstance.post("/admin/login", {
      adminname,
      password,
    });

    return response;
  } catch (error) {
    console.error("登录失败:", error);

    throw error;
  }
};

// 登出：清除HttpOnly Cookie
export const adminLogoutService = async () => {
  try {
    await authInstance.post("/admin/logout");
    return true;
  } catch (error) {
    console.error("登出失败:", error);
    return false;
  }
};

// 验证登录状态：通过访问需要认证的API来检查
export const checkAdminAuthStatus = async (): Promise<AuthResponse> => {
  try {
    const data = await authInstance.get("/admin/status");
    return data as unknown as AuthResponse;
  } catch (error) {
    console.error("验证登录状态失败:", error);
    throw error;
  }
};
