import { api } from "@/utils/api";
import { useSysStore } from '@/stores/sysStore';
import type { CustomError } from '@/types/error';
import type { ResponseType } from '@/types/response';
export class Response {
  static async SendResponse<T>(url: string, method: string, data?: any, header?: any, isReturnErrorResponse: boolean = false): Promise<T> {
    const sysStore = useSysStore();
    try {
      const res = await api(url, method, data, header);
      return res.data;
    } catch (error: any) {
      if(!isReturnErrorResponse) {
        sysStore.openDialog(error.message);
      }
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