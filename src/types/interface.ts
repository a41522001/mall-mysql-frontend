import { type Component } from 'vue';
import type { StickyProps } from 'vuetify/lib/components/VNavigationDrawer/sticky.mjs';
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