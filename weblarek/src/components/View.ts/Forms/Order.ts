import { ensureElement } from "../../../utils/utils";
import { Forms } from "./Forms";

export interface IOrderActions {
  onInput?: (data: {
    payment?: "cash" | "card" | null;
    address?: string;
  }) => void;
  onSubmit?: () => void;
}

interface OrderData {
  payment: "cash" | "card";
  address: string;
  valid: boolean;
  error: string;
}

export class Order extends Forms<OrderData> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressOrder: HTMLInputElement;

  constructor(container: HTMLElement, actions?: IOrderActions) {
    super(container, actions);

    this.cardButton = ensureElement<HTMLButtonElement>(
      '.button[name = "card"]',
      this.container,
    );
    this.cashButton = ensureElement<HTMLButtonElement>(
      '.button[name = "cash"]',
      this.container,
    );
    this.addressOrder = ensureElement<HTMLInputElement>(
      ".form__input",
      this.container,
    );

    //выбор оплаты картой
    this.cardButton.addEventListener("click", () => {
      actions?.onInput?.({
        payment: "card",
        address: this.addressOrder.value,
      });
    });
    //выбор оплаты кеш
    this.cashButton.addEventListener("click", () => {
      actions?.onInput?.({
        payment: "cash",
      });
    });
    //ввод адреса
    this.addressOrder.addEventListener("input", () => {
      actions?.onInput?.({
        address: this.addressOrder.value,
      });
    });
  }

  set payment(payment: "cash" | "card") {
    this.cardButton.classList.toggle("button_alt-active", payment === "card");
    this.cashButton.classList.toggle("button_alt-active", payment === "cash");
  }
  set address(value: string) {
    this.addressOrder.value = value;
  }
}
