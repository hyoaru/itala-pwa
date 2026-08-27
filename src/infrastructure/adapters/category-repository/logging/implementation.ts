import {
  CategoryRepositoryError,
  type CategoryPage,
  type CategoryQuery,
  type CategoryRepository,
} from "@/application/ports/category-repository";
import type { Category } from "@/domain/entities";
import { logger } from "@/infrastructure/logger";

export class LoggingCategoryRepository implements CategoryRepository {
  private inner: CategoryRepository;

  public constructor(inner: CategoryRepository) {
    this.inner = inner;
  }

  private logFailure(
    message: string,
    extra: object | undefined,
    error: unknown,
  ): void {
    const isExpected =
      error instanceof CategoryRepositoryError &&
      error.constructor !== CategoryRepositoryError;
    if (isExpected) {
      logger.warn(message, extra);
    } else {
      logger.error(message, extra);
    }
  }

  public async create(name: string): Promise<string> {
    try {
      logger.debug("Creating category", { name });
      const result = await this.inner.create(name);
      logger.info("Category created", { name });
      return result;
    } catch (error) {
      this.logFailure("Failed to create category", { name }, error);
      throw error;
    }
  }

  public async findOne(id: string): Promise<Category> {
    try {
      logger.debug("Finding category", { id });
      const result = await this.inner.findOne(id);
      logger.info("Category found", { id });
      return result;
    } catch (error) {
      this.logFailure("Failed to find category", { id }, error);
      throw error;
    }
  }

  public async find(query?: CategoryQuery): Promise<CategoryPage> {
    try {
      logger.debug("Finding categories", { query });
      const result = await this.inner.find(query);
      logger.info("Categories found", { query });
      return result;
    } catch (error) {
      this.logFailure("Failed to find categories", { query }, error);
      throw error;
    }
  }
}
