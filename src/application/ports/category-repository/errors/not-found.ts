import { CategoryRepositoryError } from "./error";

export class CategoryNotFoundError extends CategoryRepositoryError {
  constructor(id: string, options?: ErrorOptions) {
    super(`Category with id "${id}" not found`, options);
    this.name = "CategoryNotFoundError";
    Object.setPrototypeOf(this, CategoryNotFoundError.prototype);
  }
}
