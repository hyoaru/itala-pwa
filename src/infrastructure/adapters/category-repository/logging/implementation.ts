import {
  CategoryRepositoryError,
  type CategoryPage,
  type CategoryQuery,
  type CategoryRepository,
} from "@/application/ports/category-repository";
import type { Category } from "@/domain/entities";
import type { TransactionType } from "@/domain/value-objects";
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
    const errorMessage = error instanceof Error ? error.message : String(error);
    const fullMessage = `${message}: ${errorMessage}`;
    if (isExpected) {
      logger.warn(fullMessage, extra);
    } else {
      logger.error(fullMessage, extra);
    }
  }

  public async create(
    name: string,
    transactionType: TransactionType,
  ): Promise<string> {
    try {
      logger.debug("Creating category", { name, transactionType });
      const result = await this.inner.create(name, transactionType);
      logger.info("Category created", { name, transactionType });
      return result;
    } catch (error) {
      this.logFailure(
        "Failed to create category",
        { name, transactionType },
        error,
      );
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
