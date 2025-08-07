import type {
  ResponseProduct,
  ResponseUserInfo,
  ResponseCart,
  ResponseType,
  ResponseSignOrderDetail,
  ResponseLogin,
  ResponseSystem,
  ResponseAllOrder,
  ResponseCancelOrder,
  ResponseSellProduct,
  ResponseSellCount,
  ResponseSellOrder,
  ResponseSellOrderDetail,
} from "@/types/response";
import type {
  RequestDeleteCart,
  RequestProduct,
  RequestUpdateCartQuantity,
  RequestAddOrder,
  RequestSingleOrder,
  RequestCheckout,
  RequestSignup,
  RequestLogin,
  RequestAddProduct,
  RequestChangeProductIsActive,
  RequestChartData,
  RequestSellDeliver,
  RequestSellCancelOrder,
  RequestResetPwd,
} from "@/types/request";
import { Response } from "./res";
// 註冊
export const apiSignup = async (
  signupData: RequestSignup
): Promise<ResponseType<null>> => {
  try {
    const res = await Response.SendResponse<ResponseType<null>>(
      "auth/signup",
      "post",
      signupData
    );
    return res;
  } catch (error) {
    throw error;
  }
};
// 登入
export const apiLogin = async (
  loginData: RequestLogin
): Promise<ResponseLogin> => {
  try {
    const res = await Response.SendResponse<ResponseLogin>(
      "auth/login",
      "post",
      loginData
    );
    return res;
  } catch (error) {
    throw error;
  }
};
// 取得UserInfo
export const apiGetUserInfo = async (): Promise<ResponseUserInfo> => {
  try {
    const res = await Response.SendResponse<ResponseUserInfo>(
      "auth/userInfo",
      "get",
      {},
      undefined,
      true
    );
    return res;
  } catch (error) {
    throw error;
  }
};
// 重設密碼
export const apiResetPwd = async (
  data: RequestResetPwd
): Promise<ResponseType<string>> => {
  try {
    const res = await Response.SendResponse<ResponseType<string>>(
      "auth/resetPassword",
      "post",
      data
    );
    return res;
  } catch (error) {
    throw error;
  }
};
// 取得系統設定
export const apiGetSystemSetting = async (
  sysNo: string
): Promise<ResponseSystem> => {
  try {
    const res = await Response.SendResponse<ResponseSystem>(
      `system?sysNo=${sysNo}`,
      "get"
    );
    return res;
  } catch (error) {
    throw error;
  }
};
// 新增商品
export const apiAddProduct = async (
  data: RequestAddProduct
): Promise<ResponseType<string>> => {
  try {
    const res = await Response.SendResponse<ResponseType<string>>(
      "sell/product",
      "post",
      data
    );
    return res;
  } catch (error) {
    throw error;
  }
};
// 編輯商品
export const apiModifyProduct = async (data: any) => {
  try {
    const res = await Response.SendResponse<ResponseType<string>>(
      "sell/product",
      "patch",
      data
    );
  } catch (error) {
    throw error;
  }
};
// 上傳商品圖片
export const apiUploadProductImg = async (
  formdata: FormData,
  config: object
): Promise<ResponseType<string>> => {
  try {
    const res = await Response.SendFormDataResponse<ResponseType<string>>(
      "sell/addProductImage",
      "post",
      formdata,
      { "Content-Type": "multipart/form-data" },
      config
    );
    return res;
  } catch (error) {
    throw error;
  }
};
// 取得商品
export const apiGetProduct = async (): Promise<ResponseProduct> => {
  try {
    const res = await Response.SendResponse<ResponseProduct>("product", "get");
    return res;
  } catch (error) {
    throw error;
  }
};
// 取得賣家商品
export const apiGetSellProduct = async () => {
  try {
    const res = await Response.SendResponse<ResponseSellProduct>(
      "sell/product",
      "get"
    );
    return res;
  } catch (error) {
    throw error;
  }
};
// 更改商品上下架狀態
export const apiChangeProductIsActive = async (
  data: RequestChangeProductIsActive
): Promise<ResponseType<string>> => {
  try {
    const res = await Response.SendResponse<ResponseType<string>>(
      "sell/changeProductIsActive",
      "patch",
      data
    );
    return res;
  } catch (error) {
    throw error;
  }
};
// 取得購物車列表
export const apiGetCartList = async (): Promise<ResponseCart> => {
  try {
    const res = await Response.SendResponse<ResponseCart>("cart", "get");
    return res;
  } catch (error) {
    throw error;
  }
};
// 新增購物車
export const apiAddCart = async (product: RequestProduct): Promise<void> => {
  try {
    await Response.SendResponse("cart", "post", product);
  } catch (error) {
    throw error;
  }
};
// 刪除購物車
export const apiDeleteCart = async (
  productId: string
): Promise<ResponseType<null>> => {
  try {
    const res = await Response.SendResponse<ResponseType<null>>(
      `cart?productID=${productId}`,
      "delete"
    );
    return res;
  } catch (error) {
    throw error;
  }
};
// 更改購物車數量
export const apiUpdateCartQuantity = async (
  updateQuantityData: RequestUpdateCartQuantity
): Promise<ResponseType<null>> => {
  try {
    const res = await Response.SendResponse<ResponseType<null>>(
      "cart",
      "patch",
      updateQuantityData,
      undefined,
      true
    );
    return res;
  } catch (error) {
    throw error;
  }
};
// 新增訂單
export const apiAddOrder = async (
  addOrderData: RequestAddOrder
): Promise<ResponseType<string>> => {
  try {
    const res = await Response.SendResponse<ResponseType<string>>(
      "order/addOrder",
      "post",
      addOrderData
    );
    return res;
  } catch (error) {
    throw error;
  }
};
// 取得單筆訂單資訊
export const apiGetSingleOrderDetail = async (
  getSingleDetailData: RequestSingleOrder
): Promise<ResponseSignOrderDetail> => {
  try {
    const res = await Response.SendResponse<ResponseSignOrderDetail>(
      "order/getSingleOrderDetail",
      "post",
      getSingleDetailData
    );
    return res;
  } catch (error) {
    throw error;
  }
};
// 取得所有訂單資訊
export const apiGetOrder = async (
  userId: string
): Promise<ResponseAllOrder> => {
  try {
    const res = await Response.SendResponse<ResponseAllOrder>(
      `order/getOrder/${userId}`,
      "get"
    );
    return res;
  } catch (error) {
    throw error;
  }
};
// 買家取消訂單
export const apiCancelOrder = async (orderId: {
  orderId: string;
}): Promise<ResponseCancelOrder> => {
  try {
    const res = await Response.SendResponse<ResponseCancelOrder>(
      "order/cancelOrder",
      "post",
      orderId
    );
    return res;
  } catch (error) {
    throw error;
  }
};
// 結帳
export const apiCheckout = async (
  checkoutData: RequestCheckout
): Promise<ResponseType<string>> => {
  try {
    const res = await Response.SendResponse<ResponseType<string>>(
      "checkout/checkout",
      "post",
      checkoutData
    );
    return res;
  } catch (error) {
    throw error;
  }
};
// chart
// 取得chart的日期區間
export const apiChartDateItem = async (
  period: string
): Promise<ResponseType<string[]>> => {
  try {
    const res = await Response.SendResponse<ResponseType<string[]>>(
      `sell/dateItem?period=${period}`,
      "get"
    );
    return res;
  } catch (error) {
    throw error;
  }
};
// 取得chart的數據資料
export const apiChartData = async (
  data: RequestChartData
): Promise<ResponseType<number[]>> => {
  try {
    const res = await Response.SendResponse<ResponseType<number[]>>(
      "sell/sumData",
      "post",
      data
    );
    return res;
  } catch (error) {
    throw error;
  }
};
// 取得本月銷售數量排行
export const apiGetSellCount = async (): Promise<ResponseSellCount> => {
  try {
    const res = await Response.SendResponse<ResponseSellCount>(
      "sell/sellCount",
      "get"
    );
    return res;
  } catch (error) {
    throw error;
  }
};
// 取得賣家訂單
export const apiGetSellOrders = async (): Promise<ResponseSellOrder> => {
  try {
    const res = await Response.SendResponse<ResponseSellOrder>(
      "sell/sellOrders",
      "get"
    );
    return res;
  } catch (error) {
    throw error;
  }
};
// 取得賣家訂單詳細資訊
export const apiSellOrderDetail = async (
  orderId: string
): Promise<ResponseSellOrderDetail> => {
  try {
    const res = await Response.SendResponse<ResponseSellOrderDetail>(
      `sell/orderDetail?orderId=${orderId}`,
      "get"
    );
    return res;
  } catch (error) {
    throw error;
  }
};
// 賣家出貨
export const apiSellDeliver = async (
  data: RequestSellDeliver
): Promise<ResponseType<null>> => {
  try {
    const res = await Response.SendResponse<ResponseType<null>>(
      "sell/deliver",
      "patch",
      data,
      undefined,
      true
    );
    return res;
  } catch (error) {
    throw error;
  }
};
// 賣家取消訂單
export const apiSellCancelOrder = async (data: RequestSellCancelOrder) => {
  try {
    const res = await Response.SendResponse<ResponseType<null>>(
      "sell/cancelOrder",
      "post",
      data,
      undefined,
      true
    );
    return res;
  } catch (error) {
    throw error;
  }
};
