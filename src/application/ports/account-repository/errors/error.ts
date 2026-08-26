export class CategoryRepositoryError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "CategoryRepositoryError";
    Object.setPrototypeOf(this, CategoryRepositoryError.prototype);
  }
}
