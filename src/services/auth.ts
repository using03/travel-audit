import axios, { AxiosResponse, AxiosError } from "axios";

// 创建一个专用的axios实例用于认证操作（连接到3001端口的NestJS后端）
const authInstance = axios.create({
  baseURL: "http://localhost:3001/",
  timeout: 10000,
  withCredentials: true, // 允许跨域请求携带cookie
});

// 创建第二个axios实例用于连接3000端口的服务
const secondaryInstance = axios.create({
  baseURL: "http://localhost:3000/",
  timeout: 10000,
  withCredentials: false, // 不携带跨域cookie
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

// 为第二个实例添加响应拦截器
secondaryInstance.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError) => {
    if (error.response && error.response.data) {
      const errorData = error.response.data as ErrorResponseData;
      if (errorData.message) {
        error.message = errorData.message;
      }
    }
    return Promise.reject(error);
  }
);

// 登录：发送凭据并设置HttpOnly Cookie
export const login = async (adminname: string, password: string) => {
  try {
    const response = await authInstance.post("/auth/login", {
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
export const logout = async () => {
  try {
    await authInstance.post("/auth/logout");
    return true;
  } catch (error) {
    console.error("登出失败:", error);
    return false;
  }
};

// 验证登录状态：通过访问需要认证的API来检查
export const checkAuthStatus = async () => {
  try {
    const adminInfo = await authInstance.get("/auth/profile");
    return {
      isAuthenticated: true,
      adminInfo,
    };
  } catch (error) {
    console.error("验证登录状态失败:", error);
    throw error;
  }
};

// 获取用户资料
export const getUserProfile = async () => {
  try {
    return await authInstance.get("/auth/profile");
  } catch (error) {
    console.error("获取用户资料失败:", error);
    throw error;
  }
};

// 导出第二个实例，用于访问3000端口的服务
export const secondaryApi = secondaryInstance;
