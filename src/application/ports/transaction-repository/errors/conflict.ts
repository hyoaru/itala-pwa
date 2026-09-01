import { TransactionRepositoryError } from "./error";

export class TransactionConflictError extends TransactionRepositoryError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "TransactionConflictError";
    Object.setPrototypeOf(this, TransactionConflictError.prototype);
  }
}
