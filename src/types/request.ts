import type { OrderDetail, Period } from '@/types/interface'
interface CartList {
  productID: string;
  quantity: number;
  price: number;
}
export interface RequestLogin {
  email: string;
  password:string;
}
export interface RequestSignup extends RequestLogin {
  name: string;
}

export interface RequestProduct {
  productId: string;
  quantity: number;
}
export interface RequestDeleteCart {
  productID: string;
  userID: string;
}
export interface RequestUpdateCartQuantity extends RequestProduct {}
export interface RequestAddOrder {
  cartList: CartList[];
  total: number;
  userId: string;
}
export interface RequestSingleOrder {
  userId: string;
  orderId: string;
}
export interface RequestCheckout extends OrderDetail {
  address: string;
  phone: string;
  receiverName: string;
}
export interface RequestAddProduct {
  userId: string;
  productName: string;
  price: number;
  quantity: number;
  url: string;
}
export interface RequestChangeProductIsActive {
  productId: string;
  isActive: 0 | 1;
}
export interface RequestChartData {
  userId: string,
  period: Period
}
export interface RequestSellDeliver {
  orderId: string;
}
export interface RequestSellCancelOrder extends RequestSellDeliver {};