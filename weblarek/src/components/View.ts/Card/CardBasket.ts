import { ensureElement } from "../../../utils/utils";
import { Card } from "./Card";

export interface IBasketActions {
  onBasketClick?: (event: MouseEvent) => void;
}

interface CardBasketData {
  index: number;
  title: string;
  price: number;
}

export class CardBasket extends Card<CardBasketData> {
  protected basketButton: HTMLButtonElement;
  protected indexCard: HTMLElement;

  constructor(container: HTMLElement, actions?: IBasketActions) {
    super(container);

    this.basketButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );
    this.indexCard = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );

    if (actions?.onBasketClick)
      this.basketButton.addEventListener("click", actions.onBasketClick);
  }

  set index(value: number) {
    this.indexCard.textContent = String(value);
  }
}
