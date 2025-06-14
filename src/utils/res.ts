import { api } from "@/utils/api";
import { useSysStore } from '@/stores/sysStore';
import type { CustomError } from '@/types/error';
import type { ResponseType } from '@/types/response';
import type { HttpMethod } from "@/types/interface";
// error物件結構
// {
//   code: number;
//   data?: any;
//   message: string;
//   time: string;
// }
export class Response {
  // common
  static async SendResponse<T>(url: string, method: HttpMethod, data?: any, header?: any, isReturnErrorResponse: boolean = false): Promise<T> {
    const sysStore = useSysStore();
    try {
      sysStore.setLoading(true);
      const res = await api(url, method, data, header);
      return res.data;
    } catch (error: any) {
      // 401 == Token問題 一律導向/login頁面
      if(error.code === 401) {
        sysStore.jumpRoute();
      }
      if(!isReturnErrorResponse) {
        sysStore.openDialog(error.message);
      }
      throw error;
    } finally {
      sysStore.setLoading(false);
    }
  }
  // 金流專用
  static async SendPaymentResponse(url: string, method: HttpMethod, data?: any, header?: any): Promise<any> {
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
  // FormData專用
  static async SendFormDataResponse<T>(url: string, method: HttpMethod, formData: any, header: any, config: object): Promise<T> {
    try {
      const res = await api(url, method, formData, header, config, 20000);
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }
}