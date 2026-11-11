import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export interface IBasketActions {
  onClick?: (event: MouseEvent) => void;
}

interface BasketData {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<BasketData> {
  protected listElement: HTMLElement;
  protected basketButtton: HTMLButtonElement;
  protected basketPrice: HTMLElement;

  constructor(container: HTMLElement, actions?: IBasketActions) {
    super(container);

    this.listElement = ensureElement<HTMLElement>(
      ".basket__list",
      this.container,
    );
    this.basketPrice = ensureElement<HTMLElement>(
      ".basket__price",
      this.container,
    );
    this.basketButtton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container,
    );

    this.buttonDisabled = true;

    if (actions?.onClick) {
      this.basketButtton.addEventListener("click", actions.onClick);
    }
  }
  set list(items: HTMLElement[]) {
    this.listElement.replaceChildren(...items);
  }
  set total(value: number) {
    this.basketPrice.textContent = `${value} синапсов`;
  }
  set buttonDisabled(value: boolean) {
    this.basketButtton.disabled = value;
  }
}
