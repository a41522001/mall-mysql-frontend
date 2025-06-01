import { type Component } from 'vue';
export type HttpMethod = 'get' | 'post' | 'delete' | 'patch' | 'put';
export interface SignupDataForm {
  name: string;
  email: string;
  pwd: string;
  confirmPwd: string;
}
export interface ComponentList {
  [key: string]: Component;
}
export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sellUserId: string;
  isActive: 0 | 1;
}
export interface UserInfo {
  id: string;
  name: string;
  email: string;
  [key: string]: string;
}
export interface Cart {
  productId: string;
  quantity: number;
  name: string;
  price: number;
}
export interface OrderProduct {
  image: string | null;
  perPrice: number;
  quantity: number;
  productID: string;
  orderItemID: string;
  productName: string;
}
export interface OrderDetail {
  userID: string;
  email: string;
  name: string;
  orderID: string;
  total: number;
  products: OrderProduct[];
}
export interface System {
  prop: string;
  name: string;
}
export interface Select {
  title: string;
  value: string;
}
export interface OrderQuery {
  status: string;
  date: string;
  orderNo: string;
}
export type Status = 'cancel' | 'paying' | 'paid' | 'deliver' | 'delivered' | 'finish';
export interface AllOrder {
  orderId: string;
  totalPrice: number;
  status: Status;
  createdDate: string;
  product: { quantity: number; productName: string;}[];
}
export interface AddProductDataForm {
  productName: null | string;
  productPrice: null | string;
  quantity: null | string;
}
export interface SellProduct extends Product {
  count: number;
}
export type Period = 'month' | 'season' | 'halfYear' | 'year';
export interface SellCount {
  name: string;
  count: number;
}
export interface SellOrder {
  orderNo: string;
  date: string;
  total: number;
  status: Status;
  custom: number;
}
export interface SellOrderDetail {
  total: number;
  receiverName: string;
  email: string;
  address: string;
  phone: string;
  status: Status;
  orderId: string;
  userName: string;
  createdDate: string;
  createdTime: string;
  products: {
    image: string;
    productName: string;
    price: number;
    quantity: number;
  }[];
}
