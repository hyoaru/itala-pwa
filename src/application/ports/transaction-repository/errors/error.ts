export class TransactionRepositoryError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "TransactionRepositoryError";
    Object.setPrototypeOf(this, TransactionRepositoryError.prototype);
  }
}
