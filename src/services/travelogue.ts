import axios from "axios";

// 创建 axios 实例
const travelogueInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});

// 获取游记列表
export const getTravelogueList = async (page: number) => {
  try {
    const url = `/travelogues?page=${page}`;
    const response = await travelogueInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("获取游记列表失败:", error);
    throw error;
  }
};

// 获取游记详情
export const getTravelogueDetail = async (travelID: number) => {
  try {
    const response = await travelogueInstance.get(`/travelogues/${travelID}`);
    return response.data;
  } catch (error) {
    console.error("获取游记详情失败:", error);
    throw error;
  }
};

// 更新游记状态（通过或拒绝通过）
export const updateTravelogueStatus = async (
  travelID: number,
  status: number,
  reason?: string
) => {
  try {
    const response = await travelogueInstance.put(
      `/travelogues/${travelID}/status`,
      {
        status,
        reason: reason || "",
      }
    );
    return response.data;
  } catch (error) {
    console.error("更新游记状态失败:", error);
    throw error;
  }
};

// 伪删除游记
export const deleteTravelogue = async (travelID: number) => {
  try {
    const response = await travelogueInstance.put(
      `/travelogues/${travelID}/delete`
    );
    return response.data;
  } catch (error) {
    console.error("删除游记失败:", error);
    throw error;
  }
};

// 通过搜索条件获取游记列表
export const searchTravelogues = async (
  searchParams: any,
  page: number = 1
) => {
  try {
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
  } catch (error) {
    console.error("搜索游记列表失败:", error);
    throw error;
  }
};
