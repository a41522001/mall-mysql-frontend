import { type Component } from 'vue';
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