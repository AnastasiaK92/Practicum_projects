import { IBuyer } from "../../types";
import type { TPayment } from "../../types";
import type { ValidationResult } from "../../types";
import { EventEmitter } from "../base/Events";

export class Buyer {
  private payment: TPayment = "";
  private email: string = "";
  private phone: string = "";
  private address: string = "";
  public events: EventEmitter;

  constructor(events: EventEmitter) {
    this.events = events;
  }

  setData(data: Partial<IBuyer>): void {
    let changed = false;
    if (data.payment !== undefined) {
      this.payment = data.payment;
      this.events.emit("payment:changed", { payment: this.payment });
      changed = true;
    }
    if (data.email !== undefined) {
      this.email = data.email;
      this.events.emit("email:changed", { email: this.email });
      changed = true;
    }
    if (data.phone !== undefined) {
      this.phone = data.phone;
      this.events.emit("phone:changed", { phone: this.phone });
      changed = true;
    }
    if (data.address !== undefined) {
      this.address = data.address;
      this.events.emit("address:changed", { address: this.address });
      changed = true;
    }

    if (changed) {
      this.events.emit("buyer:changed", this.getBuyer());
    }
  }

  validate(): ValidationResult {
    const result: ValidationResult = {}; //валидация данных

    if (!this.payment) {
      result.payment = "payment не выбран";
    }

    if (!this.email) {
      result.email = "email не заполнен";
    }

    if (!this.phone) {
      result.phone = "phone не заполнен";
    }

    if (!this.address) {
      result.address = "address не заполнен";
    }
    return result;
  }

  getBuyer(): IBuyer {
    //получение данных
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clearBuyerData(): void {
    //очистка данных получателя
    this.payment = "";
    this.email = "";
    this.phone = "";
    this.address = "";

    this.events.emit("buyer:changed", this.getBuyer());
  }
}
