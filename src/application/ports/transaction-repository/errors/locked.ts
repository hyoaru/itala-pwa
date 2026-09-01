import { TransactionRepositoryError } from "./error";

export class TransactionLockedError extends TransactionRepositoryError {
  constructor(options?: ErrorOptions) {
    super("Operation in progress, please try again", options);
    this.name = "TransactionLockedError";
    Object.setPrototypeOf(this, TransactionLockedError.prototype);
  }
}
