import { categoryMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { Card } from "./Card";

export type Category = keyof typeof categoryMap;

export interface ICardActions {
  onClick?: (event: MouseEvent) => void;
}

export interface CardCatalogData {
  category: Category;
  title: string;
  image: string;
  price: number | string;
}

export class CardCatalog extends Card<CardCatalogData> {
  protected categoryCatalog: HTMLElement;
  protected imageCatalog: HTMLImageElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.categoryCatalog = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.imageCatalog = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );

    if (actions?.onClick) {
      this.container.addEventListener("click", actions.onClick);
    }
  }

  set category(value: Category) {
    this.categoryCatalog.textContent = value;

    for (const key in categoryMap) {
      this.categoryCatalog.classList.toggle(
        categoryMap[key as Category],
        key === value,
      );
    }
  }

  set image(value: string) {
    this.imageCatalog.src = value;
    this.imageCatalog.alt = this.title;
  }
}
