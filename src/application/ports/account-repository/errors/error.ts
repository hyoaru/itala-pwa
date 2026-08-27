export class AccountRepositoryError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "AccountRepositoryError";
    Object.setPrototypeOf(this, AccountRepositoryError.prototype);
  }
}
