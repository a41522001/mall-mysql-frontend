import axios, { AxiosError } from 'axios';
import type { HttpMethod } from '@/types/interface';
// const urlRes = await axios.get(import.meta.env.VITE_CONFIG_PATH);
// const { apiBaseUrl } = urlRes.data;
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_CONFIG_PATH,
  // timeout: 5000,
})

apiClient.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token');
  if(token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
    return Promise.reject(error);
  }
)
apiClient.interceptors.response.use((response) => {
  return response;
}, (error) => {
  // 網路錯誤
  if(error.code === 'ERR_NETWORK' || !error.response) {
    return Promise.reject({
      // 模仿後端錯誤回應的結構
      isNetworkError: true, 
      status: null,
      data: null,
      response: {
        data: {
          code: 500,
          message: '無法連接到伺服器，請檢查您的網絡連線或稍後再試。'
        }
      }
    });
  }
  return Promise.reject(error);
})
export const api = async (url: string, method: HttpMethod, data: any = {}, header: any = {}, config: object = {}, timeout: number = 10000) => {
  try {
    const res = await apiClient({
      url,
      method: method.toUpperCase(), 
      headers: {
        ...header,
        'Content-Type': header['Content-Type'] ?? 'application/json'
      },
      timeout,
      data,
      ...config
    });
    return res;
  } catch (error: any) {
    throw error.response.data
  }
}


