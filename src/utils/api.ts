import axios, { AxiosError } from 'axios';
const urlRes = await axios.get(import.meta.env.VITE_CONFIG_PATH);
const { apiBaseUrl } = urlRes.data;
const apiClient = axios.create({
  baseURL: apiBaseUrl,
  // timeout: 5000,
})

apiClient.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token');
  if(token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error: Error) => {
    return Promise.reject(error);
  }
)
export const api = async (url: string, method: string, data: any = null, header: any = {}, config: object = {}, timeout: number = 10000) => {
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


