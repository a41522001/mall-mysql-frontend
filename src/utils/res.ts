import { api } from "@/utils/api";
export class Response {
  static async SendResponse(url: string, method: string, data?: any, header?: any): Promise<any> {
    try {
      const res = await api(url, method, data, header);
      if(res?.data.code === 100) {
        return res?.data.data;
      }else {
        return res?.data.message;
      }
    } catch (error) {
      throw error;
    }
  }
}