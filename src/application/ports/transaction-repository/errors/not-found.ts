import { TransactionRepositoryError } from "./error";

export class TransactionNotFoundError extends TransactionRepositoryError {
  constructor(id: string, options?: ErrorOptions) {
    super(`Transaction with id "${id}" not found`, options);
    this.name = "TransactionNotFoundError";
    Object.setPrototypeOf(this, TransactionNotFoundError.prototype);
  }
}
