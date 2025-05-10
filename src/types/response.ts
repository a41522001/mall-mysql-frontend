import type { Product, UserInfo, Cart } from './interface';
export interface ResponseType<T> {
  code: number;
  data: T;
  message: string;
  time: string;
}
export interface ResponseProduct extends Product {};
export interface ResponseUserInfo extends UserInfo {};
export interface ResponseCart extends Cart {};