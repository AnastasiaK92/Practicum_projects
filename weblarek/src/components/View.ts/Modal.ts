import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface ModalData {
  content: HTMLElement;
}

export class Modal extends Component<ModalData> {
  protected modalCloseButton: HTMLButtonElement;
  protected modalContent: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.modalCloseButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container,
    );
    this.modalContent = ensureElement<HTMLElement>(
      ".modal__content",
      this.container,
    );

    this.modalCloseButton.addEventListener("click", () => {
      this.close();
    });
    this.container.addEventListener("click", (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });
  }
  set content(element: HTMLElement) {
    this.modalContent.replaceChildren(element);
  }

  open() {
    this.container.classList.add("modal_active");
  }
  close() {
    this.container.classList.remove("modal_active");
    this.modalContent.replaceChildren();
  }
}
