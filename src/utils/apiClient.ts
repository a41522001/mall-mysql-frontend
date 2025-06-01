import type { ResponseProduct, ResponseUserInfo, ResponseCart, ResponseType, ResponseSignOrderDetail, ResponseLogin, ResponseSystem, ResponseAllOrder, ResponseCancelOrder, ResponseSellProduct, ResponseSellCount, ResponseSellOrder, ResponseSellOrderDetail } from '@/types/response';
import type { RequestDeleteCart, RequestProduct, RequestUpdateCartQuantity, RequestAddOrder, RequestSingleOrder, RequestCheckout, RequestSignup, RequestLogin, RequestAddProduct, RequestChangeProductIsActive, RequestChartData, RequestSellDeliver, RequestSellCancelOrder } from '@/types/request';
import { Response } from './res';  
// 註冊
export const apiSignup = async (signupData: RequestSignup): Promise<ResponseType<null>> => {
  try {
    const res = await Response.SendResponse<ResponseType<null>>('api/auth/signup', 'post', signupData);
    return res;
  } catch (error) {
    throw error;
  }
}
// 登入
export const apiLogin = async (loginData: RequestLogin): Promise<ResponseLogin> => {
  try {
    const res = await Response.SendResponse<ResponseLogin>('api/auth/login', 'post', loginData);
    return res
  } catch (error) {
    throw error;
  }
}
// 取得UserInfo
export const apiGetUserInfo = async (): Promise<ResponseUserInfo> => {
  try {
    const res = await Response.SendResponse<ResponseUserInfo>('api/auth/userInfo', 'get', {}, undefined, true);
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
export const apiAddProduct = async (data: RequestAddProduct): Promise<ResponseType<string>> => {
  try {
    const res = await Response.SendResponse<ResponseType<string>>('api/sell/addProduct', 'post', data);
    return res;
  } catch (error) {
    throw error;
  }
}
// 上傳商品圖片
export const apiUploadProductImg = async (formdata: FormData, config: object): Promise<ResponseType<string>> => {
  try {
    const res = await Response.SendFormDataResponse<ResponseType<string>>('api/sell/addProductImage', 'post', formdata, {'Content-Type': 'multipart/form-data' }, config);
    return res;
  } catch (error) {
    throw error;
  }
}
// 取得商品
export const apiGetProduct = async (): Promise<ResponseProduct> => {
  try {
    const res = await Response.SendResponse<ResponseProduct>('api/product', 'get');
    return res;
  } catch (error) {
    throw error;
  }
}
// 取得賣家商品
export const apiGetSellProduct = async (userId: string) => {
  try {
    const res = await Response.SendResponse<ResponseSellProduct>(`api/sell/product?userId=${userId}`, 'get');
    return res;
  } catch (error) {
    throw error;
  }
}
// 更改商品上下架狀態
export const apiChangeProductIsActive = async (data: RequestChangeProductIsActive): Promise<ResponseType<string>> => {
  try {
    const res = await Response.SendResponse<ResponseType<string>>('api/sell/changeProductIsActive', 'patch', data);
    return res;
  } catch (error) {
    throw error;
  }
}
// 取得購物車列表
export const apiGetCartList = async (): Promise<ResponseCart> => {
  try {
    const res = await Response.SendResponse<ResponseCart>('api/cart', 'get');
    return res;
  } catch (error) {
    throw error;
  }
}
// 新增購物車
export const apiAddCart = async (product: RequestProduct): Promise<void> => {
  try {
    await Response.SendResponse('api/cart', 'post', product);
  } catch (error) {
    throw error;
  }
}
// 刪除購物車
export const apiDeleteCart = async (productId: string): Promise<ResponseType<null>> => {
  try {
    const res = await Response.SendResponse<ResponseType<null>>(`api/cart?productID=${productId}`, 'delete');
    return res;
  } catch (error) {
    throw error;
  }
}
// 更改購物車數量
export const apiUpdateCartQuantity = async (updateQuantityData: RequestUpdateCartQuantity): Promise<ResponseType<null>> => {
  try {
    const res = await Response.SendResponse<ResponseType<null>>('api/cart', 'patch', updateQuantityData, undefined, true);
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
// 買家取消訂單
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
    const res = await Response.SendResponse<ResponseType<string>>('api/checkout/checkout', 'post', checkoutData);
    return res;
  } catch (error) {
    throw error;
  }
}
// chart
// 取得chart的日期區間
export const apiChartDateItem = async (period: string): Promise<ResponseType<string[]>> => {
  try {
    const res = await Response.SendResponse<ResponseType<string[]>>(`api/sell/getDateItem?period=${period}`, 'get');
    return res;
  } catch (error) {
    throw error;
  }
}
// 取得chart的數據資料
export const apiChartData = async (data: RequestChartData): Promise<ResponseType<number[]>> => {
  try {
    const res = await Response.SendResponse<ResponseType<number[]>>('api/sell/getSumData', 'post', data);
    return res;
  } catch (error) {
    throw error;
  }
}
// 取得本月銷售數量排行
export const apiGetSellCount = async (userId: string): Promise<ResponseSellCount> => {
  try {
    const res = await Response.SendResponse<ResponseSellCount>(`api/sell/getSellCount?userId=${userId}`, 'get');
    return res;
  } catch (error) {
    throw error;
  }
}
// 取得賣家訂單
export const apiGetSellOrders = async (): Promise<ResponseSellOrder> => {
  try {
    const res = await Response.SendResponse<ResponseSellOrder>('api/sell/getSellOrders', 'get');
    return res;
  } catch (error) {
    throw error;
  }
}
// 取得賣家訂單詳細資訊
export const apiSellOrderDetail = async (orderId: string): Promise<ResponseSellOrderDetail> => {
  try {
    const res = await Response.SendResponse<ResponseSellOrderDetail>(`api/sell/orderDetail?orderId=${orderId}`, 'get');
    return res;
  } catch (error) {
    throw error;
  }
}
// 賣家出貨
export const apiSellDeliver = async (data: RequestSellDeliver): Promise<ResponseType<null>> => {
  try {
    const res = await Response.SendResponse<ResponseType<null>>('api/sell/deliver', 'patch', data, undefined, true);
    return res;
  } catch (error) {
    throw error;
  }
}
// 賣家取消訂單
export const apiSellCancelOrder = async (data: RequestSellCancelOrder) => {
  try {
    const res = await Response.SendResponse<ResponseType<null>>('api/sell/cancelOrder', 'post', data, undefined, true);
    return res;
  } catch (error) {
    throw error;
  }
}

