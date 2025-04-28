import { api } from "@/utils/api";
import { useSysStore } from '@/stores/sysStore';

export class Response {
  static async SendResponse<T>(url: string, method: string, data?: any, header?: any): Promise<T> {
    try {
      const res = await api(url, method, data, header);
      if(res.data.code === 100) {
        return res.data.data;
      }else {
        throw res?.data.message;
      }
    } catch (error) {
      throw error;
    }
  }
  static async SendPaymentResponse(url: string, method: string, data?: any, header?: any): Promise<any> {
    try {
      const res = await api(url, method, data, header);
      if(res?.data.code === 100) {
        return res?.data;
      }else {
        return res?.data.message;
      }
    } catch (error: any) {
      throw error;
    }
  }
}