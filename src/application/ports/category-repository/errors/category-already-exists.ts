import { CategoryRepositoryError } from "./error";

export class CategoryAlreadyExistsError extends CategoryRepositoryError {
  constructor(name: string, options?: ErrorOptions) {
    super(`Category with name "${name}" already exists`, options);
    this.name = "CategoryAlreadyExistsError";
    Object.setPrototypeOf(this, CategoryAlreadyExistsError.prototype);
  }
}
