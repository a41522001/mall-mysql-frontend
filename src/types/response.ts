import type { Product, UserInfo, Cart } from './interface';
export interface ResponseType<T> {
  code: number;
  data: T;
  message: string;
  time: string;
}
export interface ResponseProduct extends ResponseType<Product[]>{};
export interface ResponseUserInfo extends ResponseType<UserInfo> {};
export interface ResponseCart extends ResponseType<Cart[]> {};