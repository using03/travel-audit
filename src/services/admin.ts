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
  const response = await authInstance.post("/admin/login", {
    adminname,
    password,
  });

  return response;
};

// 登出：清除HttpOnly Cookie
export const adminLogoutService = async () => {
  await authInstance.post("/admin/logout");
  return true;
};

// 验证登录状态：通过访问需要认证的API来检查
export const checkAdminAuthStatus = async (): Promise<AuthResponse> => {
  const data = await authInstance.get("/admin/status");
  return data as unknown as AuthResponse;
};
