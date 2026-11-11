import { ensureElement } from "../../../utils/utils";
import { Forms } from "./Forms";

export interface IContactsActions {
  onInput?: (data: { email: string; phone: string }) => void;
  onSubmit?: () => void;
}

interface ContactsData {
  errors: string;
  email: string;
  phone: string;
  valid: boolean;
}

export class Contacts extends Forms<ContactsData> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLElement, actions?: IContactsActions) {
    super(container, actions);

    this.emailInput = ensureElement<HTMLInputElement>(
      '.form__input[name="email"]',
      this.container,
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      '.form__input[name="phone"]',
      this.container,
    );

    if (actions?.onInput) {
      this.emailInput.addEventListener("input", () => {
        actions.onInput!({
          email: this.emailInput.value,
          phone: this.phoneInput.value,
        });
      });

      this.phoneInput.addEventListener("input", () => {
        actions.onInput!({
          email: this.emailInput.value,
          phone: this.phoneInput.value,
        });
      });
    }
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}
