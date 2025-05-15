import type { Product, UserInfo, Cart, OrderDetail, System } from './interface';
export interface ResponseType<T> {
  code: number;
  data: T;
  message: string;
  time: string;
}
export interface ResponseSystem extends ResponseType<System[]> {};
export interface ResponseLogin extends ResponseType<null> {
  token: string;
}
export interface ResponseProduct extends ResponseType<Product[]> {};
export interface ResponseUserInfo extends ResponseType<UserInfo> {};
export interface ResponseCart extends ResponseType<Cart[]> {};
export interface ResponseSignOrderDetail extends ResponseType<OrderDetail> {};