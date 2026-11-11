import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class ProductCatalog {
  private products: IProduct[];
  private selectedCard: IProduct | null;
  public events: EventEmitter;

  constructor(events: EventEmitter) {
    this.events = events;
    this.products = [];
    this.selectedCard = null;
  }

  getProducts(): IProduct[] {
    //список товаров
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    //получение массива товаров по его id
    return this.products.find((p) => p.id === id);
  }

  setSelectedProduct(selectedCard: IProduct): void {
    //сохранить выбранную карточку
    this.selectedCard = selectedCard;
    this.events.emit("product:selected", selectedCard);
  }

  getSelectedProduct(): IProduct | null {
    //получить выбранную карточку
    return this.selectedCard;
  }

  setProducts(products: IProduct[]): void {
    //сохранить массив товаров
    this.products = products;
    this.events.emit("products:changed", this.products);
  }
}
