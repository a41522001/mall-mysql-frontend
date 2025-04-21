import { api } from "@/utils/api";
import { useSysStore } from '@/stores/sysStore';

export class Response {
  static async SendResponse(url: string, method: string, data?: any, header?: any): Promise<any> {
    const sysStore = useSysStore();
    try {
      const res = await api(url, method, data, header);
      if(res?.data.code === 100) {
        return res?.data.data;
      }else {
        return res?.data.message;
      }
    } catch (error: any) {
      const errMessage = error.split('Error:')[1]
      sysStore.openDialog(errMessage);
      throw error;
    }
  }
}