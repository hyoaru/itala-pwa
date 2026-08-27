import { AccountRepositoryError } from "./error";

export class AccountNotFoundError extends AccountRepositoryError {
  constructor(id: string, options?: ErrorOptions) {
    super(`Account with id "${id}" not found`, options);
    this.name = "AccountNotFoundError";
    Object.setPrototypeOf(this, AccountNotFoundError.prototype);
  }
}
