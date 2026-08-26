import {
  CategoryAlreadyExistsError,
  CategoryNotFoundError,
  type CategoryPage,
  type CategoryQuery,
  type CategoryRepository,
} from "@/application/ports/account-repository";
import type { Category } from "@/domain/entities";
import { logger } from "@/infrastructure/logger";

export class LoggingCategoryRepository implements CategoryRepository {
  private inner: CategoryRepository;

  public constructor(inner: CategoryRepository) {
    this.inner = inner;
  }

  public async create(name: string): Promise<string> {
    try {
      logger.debug("Creating category", { name });
      const result = await this.inner.create(name);
      logger.info("Category created", { name });
      return result;
    } catch (error) {
      if (error instanceof CategoryAlreadyExistsError) {
        logger.warn("Category already exists", { name });
        throw error;
      }
      logger.error("Failed to create category", { name });
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
      if (error instanceof CategoryNotFoundError) {
        logger.warn("Category not found", { id });
        throw error;
      }
      logger.error("Failed to find category", { id });
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
      logger.error("Failed to find categories", { query });
      throw error;
    }
  }
}
