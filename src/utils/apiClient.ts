import type { ResponseProduct, ResponseUserInfo, ResponseCart } from '@/types/response';
import type { RequestProduct } from '@/types/request';
import { Response } from './res';  
export const apiGetProduct = async (): Promise<ResponseProduct[]> => {
  try {
    const res = await Response.SendResponse<ResponseProduct[]>('product/getProduct', 'get');
    return res;
  } catch (error) {
    throw error;
  }
}
export const apiGetUserInfo = async (): Promise<ResponseUserInfo> => {
  try {
    const res = await Response.SendResponse<ResponseUserInfo>('auth/userInfo', 'post', {});
    return res;
  } catch (error) {
    throw error;
  }
}
export const apiAddCart = async (product: RequestProduct): Promise<void> => {
  try {
    await Response.SendResponse('cart/addCart', 'post', product);
  } catch (error) {
    throw error;
  }
}
export const apiGetCartList = async (userId: string): Promise<ResponseCart[]> => {
  try {
    const res = await Response.SendResponse<ResponseCart[]>(`cart/getCart?userID=${userId}`, 'get');
    return res;
  } catch (error) {
    throw error;
  }
}