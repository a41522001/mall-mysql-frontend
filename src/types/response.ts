import type { Product, UserInfo, Cart, OrderDetail, System, AllOrder, SellProduct, SellCount, SellOrder, SellOrderDetail } from './interface';
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
export interface ResponseAllOrder extends ResponseType<AllOrder[]> {};
export interface ResponseCancelOrder extends ResponseType<string> {};
export interface ResponseSellProduct extends ResponseType<SellProduct[]> {};
export interface ResponseSellCount extends ResponseType<SellCount[]> {};
export interface ResponseSellOrder extends ResponseType<SellOrder[]> {};
export interface ResponseSellOrderDetail extends ResponseType<SellOrderDetail> {};