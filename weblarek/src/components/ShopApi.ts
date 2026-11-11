import { IApi } from "../types";
import { IProductResponse } from "../types";
import { IOrder } from "../types";
import { IOrderResponse } from "../types";

export class ShopApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IProductResponse> {
    return this.api.get("/product/");
  }

  createOrder(order: IOrder): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>("/order", order);
  }
}
