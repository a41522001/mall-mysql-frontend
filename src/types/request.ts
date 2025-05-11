export interface RequestProduct {
  productId: string;
  quantity: number;
  userId: string;
}
export interface DeleteCart {
  productID: string;
  userID: string;
}