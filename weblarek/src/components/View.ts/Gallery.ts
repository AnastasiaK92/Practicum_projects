import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface GalleryData {
  catalog: HTMLElement[];
}

export class Gallery extends Component<GalleryData> {
  protected catalogeElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.catalogeElement = ensureElement<HTMLElement>(
      ".gallery",
      this.container,
    );
  }

  set catalog(items: HTMLElement[]) {
    this.catalogeElement.replaceChildren(...items);
  }
}
