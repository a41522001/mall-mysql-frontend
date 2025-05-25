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
  userId: string;
}
export interface RequestDeleteCart {
  productID: string;
  userID: string;
}
export interface RequestUpdateCartQuantity {
  productID: string;
  quantity: number;
  userID: string;
}
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