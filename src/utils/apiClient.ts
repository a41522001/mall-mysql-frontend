import type { ResponseProduct, ResponseUserInfo, ResponseCart, ResponseType } from '@/types/response';
import type { DeleteCart, RequestProduct } from '@/types/request';
import { Response } from './res';  
import { useSysStore } from '@/stores/sysStore';
// 取得UserInfo
export const apiGetUserInfo = async (): Promise<ResponseUserInfo> => {
  try {
    const res = await Response.SendResponse<ResponseUserInfo>('auth/userInfo', 'post', {}, undefined, true);
    return res;
  } catch (error) {
    throw error;
  }
}
// 取得商品
export const apiGetProduct = async (): Promise<ResponseProduct> => {
  try {
    const res = await Response.SendResponse<ResponseProduct>('product/getProduct', 'get');
    return res;
  } catch (error) {
    throw error;
  }
}
// 新增購物車
export const apiAddCart = async (product: RequestProduct): Promise<void> => {
  try {
    await Response.SendResponse('cart/addCart', 'post', product);
  } catch (error) {
    throw error;
  }
}
// 取得購物車列表
export const apiGetCartList = async (userId: string): Promise<ResponseCart> => {
  try {
    const res = await Response.SendResponse<ResponseCart>(`cart/getCart?userID=${userId}`, 'get');
    return res;
  } catch (error) {
    throw error;
  }
}
// 刪除購物車
export const apiDeleteCart = async (deleteData: DeleteCart) => {
  try {
    const res = await Response.SendResponse<ResponseType<null>>('cart/deleteCart', 'post', deleteData);
    return res;
  } catch (error) {
    throw error;
  }
}
// TODO:
// 更改購物車數量
