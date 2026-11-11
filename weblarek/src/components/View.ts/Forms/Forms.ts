import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";

export interface IFormActions {
  onSubmit?: () => void;
}

export abstract class Forms<T> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorElement: HTMLElement;
  protected onSubmithandler?: () => void;

  constructor(container: HTMLElement, actions?: IFormActions) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>(
      '.button[type="submit"]',
      container,
    );
    this.errorElement = ensureElement<HTMLElement>(".form__errors", container);
    this.onSubmithandler = actions?.onSubmit;

    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      this.onSubmit();
    });
  }
  protected onSubmit() {
    if (this.onSubmithandler) {
      this.onSubmithandler();
    }
  }

  set errors(value: string) {
    this.errorElement.textContent = value;
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }
}
