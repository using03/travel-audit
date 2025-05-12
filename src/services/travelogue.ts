import axios, { AxiosError, AxiosResponse } from "axios";

// 创建 axios 实例
const travelogueInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});

// 定义错误响应数据的接口
interface ErrorResponseData {
  message?: string;
  [key: string]: unknown;
}

// 为travelogueInstance实例添加响应拦截器：处理错误
travelogueInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
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

// 获取游记列表
export const getTravelogueList = async (page: number) => {
  const url = `/travelogues?page=${page}`;
  const response = await travelogueInstance.get(url);
  return response.data;
};

// 获取游记详情
export const getTravelogueDetail = async (travelID: number) => {
  const response = await travelogueInstance.get(`/travelogues/${travelID}`);
  return response.data;
};

// 更新游记状态（通过或拒绝通过）
export const updateTravelogueStatus = async (
  travelID: number,
  status: number,
  reason?: string
) => {
  const response = await travelogueInstance.put(
    `/travelogues/${travelID}/status`,
    {
      status,
      reason: reason || "",
    }
  );
  return response.data;
};

// 伪删除游记
export const deleteTravelogue = async (travelID: number) => {
  const response = await travelogueInstance.put(
    `/travelogues/${travelID}/delete`
  );
  return response.data;
};

// 通过搜索条件获取游记列表
export const searchTravelogues = async (
  searchParams: any,
  page: number = 1
) => {
  const queryParams = new URLSearchParams();

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((v) => queryParams.append(key, v));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });
  }
  queryParams.append("page", page.toString());
  const response = await travelogueInstance.get(
    `/travelogues/search?${queryParams.toString()}`
  );
  return response.data;
};
