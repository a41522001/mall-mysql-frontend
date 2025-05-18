import type { ResponseProduct, ResponseUserInfo, ResponseCart, ResponseType, ResponseSignOrderDetail, ResponseLogin, ResponseSystem, ResponseAllOrder, ResponseCancelOrder } from '@/types/response';
import type { RequestDeleteCart, RequestProduct, RequestUpdateCartQuantity, RequestAddOrder, RequestSingleOrder, RequestCheckout, RequestSignup, RequestLogin } from '@/types/request';
import { Response } from './res';  
// 註冊
export const apiSignup = async (signupData: RequestSignup): Promise<ResponseType<null>> => {
  try {
    const res = await Response.SendResponse<ResponseType<null>>('auth/signup', 'post', signupData);
    return res;
  } catch (error) {
    throw error;
  }
}
// 登入
export const apiLogin = async (loginData: RequestLogin): Promise<ResponseLogin> => {
  try {
    const res = await Response.SendResponse<ResponseLogin>('auth/login', 'post', loginData);
    return res
  } catch (error) {
    throw error;
  }
}
// 取得UserInfo
export const apiGetUserInfo = async (): Promise<ResponseUserInfo> => {
  try {
    const res = await Response.SendResponse<ResponseUserInfo>('auth/userInfo', 'get', {}, undefined, true);
    return res;
  } catch (error) {
    throw error;
  }
}
// 取得系統設定
export const apiGetSystemSetting = async (sysNo: string): Promise<ResponseSystem> => {
    try {
    const res = await Response.SendResponse<ResponseSystem>(`system/getSystem?sysNo=${sysNo}`, 'get');
    return res;
  } catch (error) {
    throw error;
  }
}
// 新增商品
export const apiAddProduct = async () => {

}
// 上傳商品圖片
export const apiUploadProductImg = async () => {

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
export const apiDeleteCart = async (deleteData: RequestDeleteCart): Promise<ResponseType<null>> => {
  try {
    const res = await Response.SendResponse<ResponseType<null>>('cart/deleteCart', 'post', deleteData);
    return res;
  } catch (error) {
    throw error;
  }
}
// 更改購物車數量
export const apiUpdateCartQuantity = async (updateQuantityData: RequestUpdateCartQuantity): Promise<ResponseType<null>> => {
  try {
    const res = await Response.SendResponse<ResponseType<null>>('cart/changeCartQuantity', 'post', updateQuantityData, undefined, true);
    return res;
  } catch (error) {
    throw error;
  }
}
// 新增訂單
export const apiAddOrder = async (addOrderData: RequestAddOrder): Promise<ResponseType<string>> => {
  try {
    const res = await Response.SendResponse<ResponseType<string>>('order/addOrder', 'post', addOrderData);
    return res;
  } catch (error) {
    throw error;
  }
}
// 取得單筆訂單資訊
export const apiGetSingleOrderDetail = async (getSingleDetailData: RequestSingleOrder): Promise<ResponseSignOrderDetail> => {
  try {
    const res = await Response.SendResponse<ResponseSignOrderDetail>('order/getSingleOrderDetail', 'post', getSingleDetailData);
    return res;
  } catch (error) {
    throw error;
  }
}
// 取得所有訂單資訊
export const apiGetOrder = async (userId: string): Promise<ResponseAllOrder> => {
  try {
    const res = await Response.SendResponse<ResponseAllOrder>(`order/getOrder/${userId}`, 'get');
    return res;
  } catch (error) {
    throw error;
  }
}
// 取消訂單
export const apiCancelOrder = async (orderId: {orderId: string}): Promise<ResponseCancelOrder> => {
  try {
    const res = await Response.SendResponse<ResponseCancelOrder>('order/cancelOrder', 'post', orderId);
    return res;
  } catch (error) {
    throw error;
  }
}
// 結帳
export const apiCheckout = async (checkoutData: RequestCheckout): Promise<ResponseType<string>> => {
  try {
    const res = await Response.SendResponse<ResponseType<string>>('checkout/checkout', 'post', checkoutData);
    return res;
  } catch (error) {
    throw error;
  }
}