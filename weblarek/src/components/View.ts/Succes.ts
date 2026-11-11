import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export interface ISuссesActions {
  onBasketClick?: (event: MouseEvent) => void;
}

interface SuссesData {
  total: number;
}

export class Succes extends Component<SuссesData> {
  protected description: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ISuссesActions) {
    super(container);
    this.description = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container,
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container,
    );

    if (actions?.onBasketClick)
      this.closeButton.addEventListener("click", actions.onBasketClick);
  }

  set total(value: number) {
    this.description.textContent = `Списано ${value}синапсов`;
  }
}
