import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export interface IHeaderActions {
  onBasketClick?: (event: MouseEvent) => void;
}

interface HeaderData {
  counter: number;
}

export class Header extends Component<HeaderData> {
  protected basketButton: HTMLButtonElement;
  protected counterElement: HTMLElement;

  constructor(container: HTMLElement, actions?: IHeaderActions) {
    super(container);
    this.counterElement = ensureElement<HTMLElement>(
      ".header__basket-counter",
      this.container,
    );
    this.basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container,
    );

    if (actions?.onBasketClick) {
      this.basketButton.addEventListener("click", actions.onBasketClick);
    }
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
