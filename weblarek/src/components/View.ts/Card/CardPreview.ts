import { ensureElement } from "../../../utils/utils";
import { Card } from "./Card";
import { categoryMap } from "../../../utils/constants";

export interface IPreviewActions {
  onCardClick?: (event: MouseEvent) => void;
}

interface CardPreviewData {
  category: string;
  title: string;
  image: string;
  price: number;
  text: string;
}

export class CardPreview extends Card<CardPreviewData> {
  protected cardButton: HTMLButtonElement;
  protected categoryCard: HTMLElement;
  protected imageCard: HTMLImageElement;
  protected textCard: HTMLElement;

  constructor(container: HTMLElement, actions?: IPreviewActions) {
    super(container);

    this.cardButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );
    this.categoryCard = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.imageCard = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    this.textCard = ensureElement<HTMLElement>(".card__text", this.container);
    if (actions?.onCardClick) {
      this.cardButton.addEventListener("click", actions.onCardClick);
    }
  }

  set category(value: string) {
    this.categoryCard.textContent = value;

    for (const key in categoryMap) {
      this.categoryCard.classList.toggle(
        categoryMap[key as keyof typeof categoryMap],
        key === value,
      );
    }
  }

  set image(value: string) {
    this.imageCard.src = value;
  }

  set text(value: string) {
    this.textCard.textContent = value;
  }

  set buttonText(value: string) {
    this.cardButton.textContent = value;
  }

 set buttonDisabled(isDisabled:boolean) {
    this.cardButton.disabled = isDisabled;
 }
  
}
