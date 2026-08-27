import { AccountRepositoryError } from "./error";

export class AccountAlreadyExistsError extends AccountRepositoryError {
  constructor(name: string, options?: ErrorOptions) {
    super(`Account with name "${name}" already exists`, options);
    this.name = "AccountAlreadyExistsError";
    Object.setPrototypeOf(this, AccountAlreadyExistsError.prototype);
  }
}
